from fastapi import Depends, Header, HTTPException, Body
from security.attest.ios import validate_assertion
from security.attest.android import validate_token
from appconf import IOS_APP_ID
from redis import Redis
from cache import get_redis


async def is_valid_mobile(
    x_key_id: str = Header(None),
    x_challenge: str = Header(None),
    x_assertion: str = Header(None),
    client_data: dict = Body(default={}),
    redis_client: Redis = Depends(get_redis),
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
    if x_key_id:
        assertion_valid = validate_assertion(
            redis_client=redis_client,
            key_id=x_key_id,
            app_id=IOS_APP_ID,
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
