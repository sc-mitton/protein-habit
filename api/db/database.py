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
    Text,
    Enum
)
from enum import Enum as PyEnum
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


class CuisineEnum(PyEnum):
    ITALIAN = "italian"
    MEXICAN = "mexican"
    INDIAN = "indian"
    ASIAN = "asian"
    MEDITERRANEAN = "mediterranean"


class MealTypeEnum(PyEnum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
    DESSERT = "dessert"


class ProteinEnum(PyEnum):
    SHRIMP = "shrimp"
    STEAK = "steak"
    CHICKEN = "chicken"
    TOFU = "tofu"
    FISH = "fish"
    GROUND_BEEF = "ground_beef"
    LAMB = "lamb"
    PORK = "pork"


class DishTypeEnum(PyEnum):
    SALAD = "salad"
    SOUP = "soup"
    SANDWICH = "sandwich"
    BOWL = "bowl"
    SHAKE = "shake"


# Association Tables (Many-to-many relationships)
class recipe_cuisine_association(Base):
    __tablename__ = 'recipe_cuisine_association'
    recipe_id = Column(Integer, ForeignKey('recipes.id'), primary_key=True)
    cuisine_id = Column(Integer, ForeignKey('cuisines.id'), primary_key=True)


class recipe_meal_type_association(Base):
    __tablename__ = 'recipe_meal_type_association'
    recipe_id = Column(Integer, ForeignKey('recipes.id'), primary_key=True)
    meal_type_id = Column(Integer, ForeignKey(
        'meal_types.id'), primary_key=True)


class recipe_protein_association(Base):
    __tablename__ = 'recipe_protein_association'
    recipe_id = Column(Integer, ForeignKey('recipes.id'), primary_key=True)
    protein_id = Column(Integer, ForeignKey('proteins.id'), primary_key=True)


class Cuisine(Base):
    __tablename__ = 'cuisines'
    id = Column(Integer, primary_key=True)
    name = Column(Enum(CuisineEnum), unique=True, nullable=False)

    recipes = relationship(
        'Recipe', secondary='recipe_cuisine_association', back_populates='cuisines')


class MealType(Base):
    __tablename__ = 'meal_types'
    id = Column(Integer, primary_key=True)
    name = Column(Enum(MealTypeEnum), unique=True, nullable=False)

    recipes = relationship(
        'Recipe', secondary='recipe_meal_type_association', back_populates='meal_types')


class Protein(Base):
    __tablename__ = 'proteins'
    id = Column(Integer, primary_key=True)
    name = Column(Enum(ProteinEnum), unique=True, nullable=False)

    recipes = relationship(
        'Recipe', secondary='recipe_protein_association', back_populates='proteins')


class DishType(Base):
    __tablename__ = 'dish_types'
    id = Column(Integer, primary_key=True)
    name = Column(Enum(DishTypeEnum), unique=True, nullable=False)

    # One-to-one relationship with Recipe
    recipe = relationship('Recipe', back_populates='dish_type', uselist=False)


class Recipe(Base):
    __tablename__ = 'recipes'
    id = Column(Integer, primary_key=True)
    description = Column(Text, nullable=True)
    ingredients = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    thumbnail = Column(String(255), nullable=True)
    # Foreign key for one-to-one relationship with DishType
    dish_type_id = Column(Integer, ForeignKey('dish_types.id'), nullable=True)

    # Many-to-many relationships
    cuisines = relationship(
        'Cuisine', secondary='recipe_cuisine_association', back_populates='recipes')
    meal_types = relationship(
        'MealType', secondary='recipe_meal_type_association', back_populates='recipes')
    proteins = relationship(
        'Protein', secondary='recipe_protein_association', back_populates='recipes')
    # One-to-one relationship with DishType
    dish_type = relationship('DishType', back_populates='recipe')


# Create tables
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        db.begin()  # Start a transaction
        yield db
    finally:
        db.close()
