import base64
import cbor2
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Request, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi_types import TextInput

from db.comp_food_database import get_db
from db.database import (
    get_db as get_attest_db, Key, Challenge
)
from rags.protein_amount import chain
from utils.get_secret import get_secret
from security.attest.ios import validate_attestation, get_public_key
from conf import IOS_APP_ID, IOS_BUNDLE_ID
from security.permissions import assertion_pass, test_only

router = APIRouter()
SECRET_KEY = get_secret("SECRET_KEY")


class AttestRequest(BaseModel):
    attestation: str
    keyId: str
    challenge: str


@router.post("/protein", dependencies=[Depends(assertion_pass)])
async def protein(input_data: TextInput, db: Session = Depends(get_db)):
    try:
        results = chain.run(input_data.text, db)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/challenge")
async def attest_challenge(
    attest_db: Session = Depends(get_attest_db),
    x_key: str = Header(None)
):
    challenge_id, challenge = Challenge.generate_challenge()

    # If key provided, delete all challenges for this key
    if x_key:
        attest_db.query(Challenge).filter(
            Challenge.key_id == x_key
        ).delete()

    new_challenge = Challenge(
        id=challenge_id,
        value=challenge,
        key_id=x_key
    )

    attest_db.add(new_challenge)
    attest_db.commit()

    return f"{challenge_id}:{challenge}"


@router.post("/attest")
async def attest(
    request: AttestRequest,
    attest_db: Session = Depends(get_attest_db)
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
            app_id=IOS_APP_ID,
            bundle_id=IOS_BUNDLE_ID,
        )

        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail="Invalid attestation"
            )

        # Check if key already exists
        existing_key = attest_db.query(Key).filter(
            Key.id == request.keyId
        ).first()

        if existing_key:
            # Update last used timestamp
            existing_key.last_used = datetime.now(timezone.utc)
        else:
            # Create new key record
            public_key = get_public_key(decoded_attestation)
            new_key = Key(
                id=request.keyId,
                public_key=public_key
            )
            attest_db.add(new_key)

        # Delete challenge provided in request
        attest_db.query(Challenge).filter(
            Challenge.id == request.challenge.split(':')[0]
        ).delete()

        attest_db.commit()

        return {"status": "ok", "keyId": request.keyId}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/assertion-test", dependencies=[Depends(test_only),
                                              Depends(assertion_pass)])
async def assertion_test(request: Request):
    return {"status": "ok"}


@router.get("/")
async def root():
    return {
        "message": (
            "Welcome to the Protein Counter API. "
            "Use the /protein endpoint to analyze food items."
        )
    }


@router.get("/health")
async def health():
    return {"status": "ok"}
