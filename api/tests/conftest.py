import os
import sys
from dotenv import load_dotenv

env_file = os.path.join(os.path.dirname(__file__), '..', '.env.development')

load_dotenv(env_file)

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..')))
