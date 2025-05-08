# Protein Habit API

This FastAPI application provides an endpoint to analyze text and extract protein content from food items using OpenAI's GPT model.

## Setup

1. Create a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Make sure your `.env.dev` file contains your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

4. Start Redis for local development:

```bash
docker-compose up -d
```

## Running the API

Start the server with:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /protein

Analyzes text input and returns protein content for food items mentioned.

Request body:

```json
{
  "text": "I had a chicken breast and a cup of Greek yogurt for lunch"
}
```

Response:

```json
{
  "result": {
    "food_items": [
      {
        "item": "chicken breast",
        "protein_grams": 31,
        "serving_size": "100g"
      },
      {
        "item": "Greek yogurt",
        "protein_grams": 17,
        "serving_size": "1 cup (170g)"
      }
    ]
  }
}
```

### POST /v1/challenge

Creates a new challenge for device integrity validation.

### POST /v1/attest

Validates an attestation and creates a new key if it doesn't exist.

### GET /

Welcome message and basic API information.

## API Documentation

Once the server is running, you can access:

- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## Redis Store

The API uses Redis for storing device integrity validation data. The Redis store is structured as follows:

1. **Challenges Store**:

   - Key: `challenge:{challenge_id}`
   - Value: `{key_id}` or empty string if no key is associated

2. **Keys Store**:
   - Key: `key:{key_id}`
   - Value: `{public_key}`

### Environment Variables

- `REDIS_URL`: The URL of the Redis instance (e.g., `redis://localhost:6379/0` for local development)
- `ENVIRONMENT`: The environment (development, production, etc.)

### Directory Structure

The Redis-related code is located in the `api/redis` directory:

- `api/redis/store.py`: Contains the Redis store implementation with proper dependency injection
- `api/redis/__init__.py`: Exports the Redis store functions and classes

### Dependency Injection

The Redis client is injected into the endpoints using FastAPI's dependency injection system. This approach provides several benefits:

1. **Testability**: Makes it easier to mock the Redis client for testing
2. **Resource Management**: Ensures proper connection handling with automatic cleanup
3. **Flexibility**: Allows for different Redis configurations in different environments

### Simplified Implementation

The Redis store has been simplified to focus on the essential operations:

- `get_redis()`: Provides a Redis client via dependency injection
- `Challenge.generate_challenge()`: Generates a cryptographically secure challenge
- `create_challenge()`: Creates a new challenge in Redis
- `delete_challenge()`: Deletes a challenge from Redis
- `create_key()`: Creates a new key in Redis
- `key_exists()`: Checks if a key exists in Redis

# DB

The db is a chroma vector database of all a comprehensive food databsae.
Embedding should be run in google colab and takes aproximately 1hr 20min
to embed the aproximately 1mil records of branded foods, menu item foods,
and

menustat

- menustat_id
- restaurant
- food_category
- description (rename from item_description)
- energy_amount
- fat_amount
- carb_amount
- protein_amount
- sugar_amount

usda_non_branded_column

- fdc_id
- brand_name
- food_category
- energy_amount
- fat_amount
- carb_amount
- protein_amount
- sugar_amount

usda_branded_column

- fdc_id
- description
- brand_name
- food_category
- energy_amount
- fat_amount
- carb_amount
- protein_amount
- sugar_amount
