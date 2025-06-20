#!/bin/bash

# Exit on error
set -e

echo "Starting the server..."
uvicorn main:app --host 0.0.0.0 --port ${PORT:-1000}
