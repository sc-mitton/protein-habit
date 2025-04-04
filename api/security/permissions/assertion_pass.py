from fastapi import Depends, Header, HTTPException, Body
from sqlalchemy.orm import Session

from db.attest_db import get_db as get_attest_db
from security.attest.ios import validate_assertion
from security.attest.android import validate_token
from conf import IOS_APP_ID, IOS_BUNDLE_ID


async def assertion_pass(
    db: Session = Depends(get_attest_db),
    x_key: str = Header(''),
    x_challenge: str = Header(''),
    x_assertion: str = Header(''),
    client_data: dict = Body(default={}),
) -> bool:
    '''
    Validate the assertion.
    For ios, the x_key, x_challenge, and x_assertion headers are required.
    For android, the x_token header is required.
    '''

    # Validate the assertion
    assertion_valid = False
    client_data['challenge'] = x_challenge

    # ios case
    if x_key:
        assertion_valid = validate_assertion(
            db=db,
            key_id=x_key,
            app_id=IOS_APP_ID,
            bundle_id=IOS_BUNDLE_ID,
            assertion=x_assertion,
            client_data=client_data
        )
    elif x_assertion:
        assertion_valid = validate_token(
            token=x_assertion,
            challenge=x_challenge
        )

    if not assertion_valid:
        raise HTTPException(status_code=401, detail="Invalid assertion")

    return True
