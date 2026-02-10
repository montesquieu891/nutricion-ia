"""
Database session configuration
"""

from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool, StaticPool
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Determine if we're using SQLite or another database
is_sqlite = settings.DATABASE_URL.lower().startswith("sqlite")

# Configure engine based on database type
if is_sqlite:
    # SQLite-specific configuration
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},  # Allow SQLite to be used with FastAPI
        poolclass=StaticPool,  # Use StaticPool for SQLite
        echo=False,
    )
else:
    # PostgreSQL and other databases configuration
    # Note: connect_args with 'options' parameter is PostgreSQL-specific
    # For other databases (MySQL, etc.), adjust connect_args accordingly
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=QueuePool,
        pool_size=5,                    # Number of connections to maintain in the pool
        max_overflow=10,                # Maximum number of connections that can be created beyond pool_size
        pool_timeout=30,                # Timeout in seconds for getting a connection from the pool
        pool_recycle=3600,              # Recycle connections after 1 hour to avoid stale connections
        pool_pre_ping=True,             # Enable pessimistic disconnect handling - test connections before use
        echo=False,                     # Set to True for SQL query logging in development
        connect_args={
            "connect_timeout": 10,       # Connection timeout in seconds
            "options": "-c timezone=utc" # Set timezone to UTC for all connections (PostgreSQL-specific)
        }
    )


# Add event listener to handle connection issues
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Event listener for new database connections"""
    logger.debug("Database connection established")


@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_conn, connection_record, connection_proxy):
    """Event listener when connection is checked out from the pool"""
    logger.debug("Connection checked out from pool")


# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db():
    """
    Dependency for getting database session with proper error handling
    
    This function is used as a FastAPI dependency to provide database sessions
    to route handlers. It ensures proper cleanup of database connections.
    
    Yields:
        Session: SQLAlchemy database session
        
    Example:
        @app.get("/users")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()
