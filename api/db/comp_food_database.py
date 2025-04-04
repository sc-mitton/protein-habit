from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pathlib import Path

# Get the database path relative to the main.py file
DATABASE_URL = Path(__file__).parent / 'CompFood.sqlite'

# Create SQLAlchemy engine with optimizations for SQLite
engine = create_engine(
    f"sqlite:///{DATABASE_URL}",
    connect_args={
        "check_same_thread": False  # Needed for SQLite
    },
    # Performance optimizations
    pool_pre_ping=True,
    pool_recycle=300,
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
