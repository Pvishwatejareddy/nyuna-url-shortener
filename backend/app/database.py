from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load secrets from .env file
load_dotenv()

# Get the database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the database engine
# Engine = the actual connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# Each request gets its own database session
# Think of session like opening a notebook to write in
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all our database table models
Base = declarative_base()

# This function gives each API request its own DB session
# and closes it automatically when done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()