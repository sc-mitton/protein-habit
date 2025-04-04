#!/bin/bash

# Exit on error
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting the server..."
uvicorn main:app --host 0.0.0.0 --port ${PORT:-1000}
