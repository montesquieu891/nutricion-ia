"""
Pydantic schemas for authentication
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional


class UserRegister(BaseModel):
    """Schema for user registration"""
    nombre: str = Field(..., min_length=1, max_length=255, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="User's password (minimum 8 characters)")
    password_confirm: str = Field(..., description="Password confirmation")
    objetivo_calorias: Optional[int] = Field(None, gt=0, description="Daily calorie goal")
    
    @field_validator('password_confirm')
    @classmethod
    def passwords_match(cls, v, info):
        """Validate that passwords match"""
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('Passwords do not match')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiration time in seconds")


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request"""
    refresh_token: str = Field(..., description="JWT refresh token")


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    nombre: str
    email: str
    objetivo_calorias: Optional[int] = None
    
    class Config:
        from_attributes = True
