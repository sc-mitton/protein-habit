from security.permissions import is_valid_mobile, test_only
from appconf import IOS_APP_ID
from security.attest.ios import validate_attestation
from utils.get_secret import get_secret
from rags.protein_amount import chain
import base64
from cryptography import x509
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends, Request, Header
import cbor2
import redis
# import httpx
# import os
# from sqlalchemy import text

from db.comp_food_database import get_db
from fastapi_types import AttestRequest, SearchRequest
from cache import (
    get_redis,
    generate_challenge,
    CHALLENGE_PREFIX,
    KEY_CHALLENGE_PREFIX,
    KEY_PUBLIC_KEY_PREFIX,
    KEY_COUNTER_PREFIX
)

router = APIRouter()
SECRET_KEY = get_secret("SECRET_KEY")


@router.post("/protein")
async def protein(request: SearchRequest, db: Session = Depends(get_db),
                  deps=Depends(is_valid_mobile)):
    try:
        print('debugging')
        print("request", request.text)
        results = chain.run(request.text, db)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/challenge")
async def challenge(
    redis_client: redis.Redis = Depends(get_redis),
    x_key_id: str = Header(None)
):

    challenge_id, new_challenge = generate_challenge()

    # If key id provided, update challenge for this key id
    if x_key_id:
        redis_client.set(f"{KEY_CHALLENGE_PREFIX}{x_key_id}", new_challenge)
    else:
        redis_client.set(f"{CHALLENGE_PREFIX}{challenge_id}", new_challenge)

    return f"{challenge_id}:{new_challenge}"


@router.post("/attest")
async def attest(
    request: AttestRequest,
    redis_client: redis.Redis = Depends(get_redis)
):
    '''
    Validate the attestation and create a new key if it doesn't exist.
    (ios only)
    '''

    try:
        # Validate the attestation with Apple
        decoded_attestation = cbor2.loads(
            base64.b64decode(request.attestation))

        is_valid = validate_attestation(
            attestation=decoded_attestation,
            challenge=request.challenge,
            key_id=request.keyId,
            app_id=IOS_APP_ID
        )

        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail="Invalid attestation"
            )

        x5c = decoded_attestation.get('attStmt', {}).get('x5c', [])
        if not x5c:
            raise ValueError("No x5c found in attestation")

        cred_cert = x509.load_der_x509_certificate(x5c[0], default_backend())
        public_key = cred_cert.public_key()
        public_bytes = public_key.public_bytes(
            encoding=serialization.Encoding.DER,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        key_hash_b64 = base64.b64encode(public_bytes).decode()

        redis_client.mset({
            f"{KEY_PUBLIC_KEY_PREFIX}{request.keyId}": key_hash_b64,
            f"{KEY_COUNTER_PREFIX}{request.keyId}": 0
        })

        # Delete challenge provided in request (front end will request a new one)
        redis_client.delete(
            f"{CHALLENGE_PREFIX}{request.challenge.split(':')[0]}")

        return {"status": "ok", "keyId": request.keyId}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/assertion-test")
async def assertion_test(request: Request, is_valid_mobile=Depends(is_valid_mobile),
                         is_test_only=Depends(test_only)):
    return {"status": "ok"}


@router.get("/")
async def root():
    return {
        "message": (
            "Welcome to the Protein Habit API. "
            "Use the /protein endpoint to analyze food items."
        )
    }


@router.get("/health")
async def health():
    return {"status": "ok"}


# @router.post("/imagine/webhook")
# async def imagine_webhook(request: Request, db: Session = Depends(get_db)):
#     try:
#         data = await request.json()

#         # Extract relevant information from the webhook payload
#         status = data.get("status")
#         if status != "done":
#             return {"status": "ignored", "message": "Image generation not complete"}

#         result = data.get("result", {})
#         image_url = result.get("url")
#         filename = result.get("filename")

#         if not image_url or not filename:
#             raise HTTPException(
#                 status_code=400, detail="Missing required image data")

#         # Download the image
#         async with httpx.AsyncClient() as client:
#             response = await client.get(image_url)
#             if response.status_code != 200:
#                 raise HTTPException(
#                     status_code=500, detail="Failed to download image")

#             # Save the image to disk
#             thumbnails_dir = "./thumbnails"
#             os.makedirs(thumbnails_dir, exist_ok=True)
#             file_path = os.path.join(thumbnails_dir, filename)

#             with open(file_path, "wb") as f:
#                 f.write(response.content)

#             # Update the database with the new thumbnail filename
#             db.execute(
#                 text(
#                     "UPDATE recipes "
#                     "SET thumbnail = :filename "
#                     "WHERE thumbnail LIKE '%default%' "
#                     "LIMIT 1"
#                 ),
#                 {"filename": filename}
#             )
#             db.commit()

#         return {"status": "success", "filename": filename}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
