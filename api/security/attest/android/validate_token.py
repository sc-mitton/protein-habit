import base64
import json
from jose import jwe, jws
from jose.constants import ALGORITHMS


def validate_token(
    token: str,
    challenge: str,
    decryption_key: str,
    verification_key: str
) -> bool:
    """
    Validates a Play Integrity token by decrypting and verifying it.

    Args:
        token: The encrypted and signed token from the Play Integrity API
        challenge: The nonce/challenge that was used to generate the token
        decryption_key: Base64 encoded AES key for decryption
        verification_key: Base64 encoded EC public key for verification

    Returns:
        bool: True if the token is valid and matches the challenge, False otherwise
    """
    try:
        # Decode the keys from base64
        decryption_key_bytes = base64.b64decode(decryption_key)
        verification_key_bytes = base64.b64decode(verification_key)

        # First decrypt the JWE
        decrypted_token = jwe.decrypt(
            token,
            decryption_key_bytes,
            algorithms=[ALGORITHMS.A256KW],
            encryption=ALGORITHMS.A256GCM
        )

        # Then verify the JWS
        verified_payload = jws.verify(
            decrypted_token,
            verification_key_bytes,
            algorithms=[ALGORITHMS.ES256]
        )

        # Parse the payload
        payload = json.loads(verified_payload)

        # Verify the nonce matches our challenge
        if payload.get('nonce') != challenge:
            return False

        # Verify the app is genuine and device is trustworthy
        app_integrity = payload.get('appIntegrity', {})
        device_integrity = payload.get('deviceIntegrity', {})

        checks = [
            app_integrity.get('appRecognitionVerdict') == 'PLAY_RECOGNIZED',
            device_integrity.get(
                'deviceRecognitionVerdict') == 'MEETS_DEVICE_INTEGRITY',
        ]

        if not all(checks):
            return False

        return True

    except Exception as e:
        # Log the error for debugging
        print(f"Token validation error: {str(e)}")
        return False
