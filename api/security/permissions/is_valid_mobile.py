from fastapi import Depends, Header, HTTPException, Request
from security.attest.ios import validate_assertion
from security.attest.android import validate_token
from appconf import IOS_APP_ID
from redis import Redis
from cache import get_redis
from typing import Optional
import json


async def is_valid_mobile(
    request: Request,
    x_key_id: Optional[str] = Header(None),
    x_challenge: Optional[str] = Header(None),
    x_assertion: Optional[str] = Header(None),
    x_token: Optional[str] = Header(None),
    redis_client: Redis = Depends(get_redis),
) -> bool:
    '''
    Validate the assertion.
    For ios, the x_key, x_challenge, and x_assertion headers are required.
    For android, the x_token header is required.
    '''

    print("Headers:")
    print(f"  x_key_id: {x_key_id}")
    print(f"  x_challenge: {x_challenge}")
    print(f"  x_assertion: {x_assertion}")
    print(f"  x_token: {x_token}")

    body = await request.body()
    try:
        client_data = json.loads(body) if body else {}
    except json.JSONDecodeError:
        client_data = {}

    # Validate the assertion
    assertion_valid = False
    if not x_challenge:
        raise HTTPException(status_code=401, detail="Invalid challenge")
    client_data['challenge'] = '.'.join(x_challenge.split('.')[1:])

    # ios case
    if x_key_id:
        assertion_valid = validate_assertion(
            redis_client=redis_client,
            key_id=x_key_id,
            app_id=IOS_APP_ID,
            assertion=x_assertion,
            client_data=client_data
        )
    elif x_token:
        assertion_valid = validate_token(
            redis_client=redis_client,
            token=x_token,
            challenge=x_challenge,
        )

    if not assertion_valid:
        raise HTTPException(status_code=401, detail="Invalid assertion")

    return True
