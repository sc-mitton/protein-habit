import base64
import json
from jose import jwe, jws
from jose.constants import ALGORITHMS

from utils.get_secret import get_secret

GOOGLE_PLAY_INTEGRITY_DECRYPTION_KEY = get_secret(
    "PLAY_INTEGRITY_DECRYPTION_KEY")
GOOGLE_PLAY_INTEGRITY_VERIFICATION_KEY = get_secret(
    "PLAY_INTEGRITY_VERIFICATION_KEY")


def validate_token(
    token: str,
    challenge: str
) -> bool:

    try:
        # Decode the decryption key from base64
        decryption_key_bytes = base64.b64decode(
            GOOGLE_PLAY_INTEGRITY_DECRYPTION_KEY)

        # Decode the verification key from base64
        verification_key_bytes = base64.b64decode(
            GOOGLE_PLAY_INTEGRITY_VERIFICATION_KEY)

        # Decrypt the JWE token using the decryption key
        decrypted_token = jwe.decrypt(
            token,
            decryption_key_bytes
        )

        # Verify the JWS signature using the verification key
        verified_payload = jws.verify(
            decrypted_token,
            verification_key_bytes,
            algorithms=[ALGORITHMS.ES256]
        )

        # Parse the payload
        payload = json.loads(verified_payload)

        # Check if the challenge matches
        return payload.get("challenge") == challenge

    except Exception as e:
        print(e)
        return False
