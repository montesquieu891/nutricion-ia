"""
Authentication routes - Register, Login, Refresh, Logout
"""

from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from jose import JWTError
import logging

from app.db.session import get_db
from app.models.dieta import User, RefreshToken
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    RefreshTokenRequest,
    UserResponse
)
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user
    
    Creates a new user account with hashed password and returns JWT tokens
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with hashed password
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        nombre=user_data.nombre,
        email=user_data.email,
        hashed_password=hashed_pwd,
        objetivo_calorias=user_data.objetivo_calorias
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"New user registered: {new_user.email} (ID: {new_user.id})")
    
    # Generate tokens
    access_token = create_access_token(new_user.id)
    refresh_token_str = create_refresh_token(new_user.id)
    
    # Store refresh token in database
    refresh_token_expires = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token_db = RefreshToken(
        user_id=new_user.id,
        token=refresh_token_str,
        expires_at=refresh_token_expires
    )
    db.add(refresh_token_db)
    db.commit()
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return JWT tokens
    
    Validates credentials and returns access and refresh tokens
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    logger.info(f"User logged in: {user.email} (ID: {user.id})")
    
    # Generate tokens
    access_token = create_access_token(user.id)
    refresh_token_str = create_refresh_token(user.id)
    
    # Store refresh token in database
    refresh_token_expires = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token_db = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=refresh_token_expires
    )
    db.add(refresh_token_db)
    db.commit()
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(token_request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token
    
    Validates refresh token and returns a new access token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode refresh token
        payload = decode_token(token_request.refresh_token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "refresh":
            raise credentials_exception
        
        # Verify token exists in database and is not expired
        refresh_token_db = db.query(RefreshToken).filter(
            RefreshToken.token == token_request.refresh_token,
            RefreshToken.user_id == int(user_id)
        ).first()
        
        if not refresh_token_db:
            raise credentials_exception
        
        # Check if token is expired
        if refresh_token_db.expires_at < datetime.utcnow():
            # Delete expired token
            db.delete(refresh_token_db)
            db.commit()
            raise credentials_exception
        
        # Get user
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise credentials_exception
        
        logger.info(f"Access token refreshed for user: {user.email} (ID: {user.id})")
        
        # Generate new access token
        new_access_token = create_access_token(user.id)
        
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=token_request.refresh_token,  # Return same refresh token
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except JWTError:
        raise credentials_exception


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(token_request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Logout user by invalidating refresh token
    
    Removes refresh token from database
    """
    try:
        # Decode token to get user_id
        payload = decode_token(token_request.refresh_token)
        user_id: str = payload.get("sub")
        
        if user_id:
            # Delete refresh token from database
            refresh_token_db = db.query(RefreshToken).filter(
                RefreshToken.token == token_request.refresh_token,
                RefreshToken.user_id == int(user_id)
            ).first()
            
            if refresh_token_db:
                db.delete(refresh_token_db)
                db.commit()
                logger.info(f"User logged out: ID {user_id}")
        
        return {"message": "Successfully logged out"}
    
    except JWTError:
        # Even if token is invalid, consider it a successful logout
        return {"message": "Successfully logged out"}
