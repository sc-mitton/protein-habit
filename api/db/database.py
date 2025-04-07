import os
import base64
from datetime import datetime, timezone

from sqlalchemy import (
    create_engine,
    Column,
    String,
    DateTime,
    Integer,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from cryptography.fernet import Fernet

from utils.get_secret import get_secret

# Get the directory of this file
DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(DIR, 'Database.db')}"
ENV = os.getenv("ENVIRONMENT", "dev")

# Get encryption parameters from environment variables
KEY = get_secret("SECRET_KEY")

# Create Fernet instance for encryption
fernet = Fernet(KEY.encode())

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    pool_pre_ping=True,
    pool_recycle=300,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Key(Base):
    __tablename__ = "keys"

    id = Column(String, primary_key=True)
    public_key = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    counter = Column(Integer, default=0)

    # One-to-one relationship with AttestChallenge
    challenge = relationship(
        "Challenge",
        back_populates="key",
        uselist=False,  # This makes it one-to-one
        cascade="all, delete"
    )


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String, primary_key=True)
    value = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    # Foreign Key to AttestKey
    key_id = Column(String, ForeignKey(
        # Added unique constraint
        "keys.id", ondelete="CASCADE"), nullable=True, unique=True)

    key = relationship(
        "Key", back_populates="challenge")  # Changed to singular

    @staticmethod
    def generate_challenge() -> tuple[str, str]:
        """Generate a cryptographically secure random challenge and ID"""
        id = base64.urlsafe_b64encode(os.urandom(16)).decode()
        challenge = base64.urlsafe_b64encode(os.urandom(32)).decode()
        return id, challenge


# Create tables
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        db.begin()  # Start a transaction
        yield db
    finally:
        db.close()
