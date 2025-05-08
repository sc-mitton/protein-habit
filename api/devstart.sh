# Exit on error
set -e

echo "Starting the server..."

# Load environment variables from .env.development
export $(cat .env.development | xargs)

# Start uvicorn with full logging
uvicorn main:app --reload --log-level debug
