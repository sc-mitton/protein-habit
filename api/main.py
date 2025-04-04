from fastapi import FastAPI
import os
from dotenv import load_dotenv
from api.v1.endpoints import router as api_router

app = FastAPI(title="Protein Counter API")

# Load environment variables
environment = os.getenv('ENVIRONMENT')
load_dotenv(f'.env.{environment}')

# Include routes
app.include_router(api_router, prefix="/v1")
