FROM python:3.11-slim

WORKDIR /app

# Install system dependencies and pipenv
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir pipenv

# Copy Pipfile and Pipfile.lock from root
COPY Pipfile* ./

# Install dependencies
RUN pipenv install --deploy --system

# Expose the port
EXPOSE 8000

# Start the application with hot reload
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
