import base64
from cryptography.hazmat.primitives.keywrap import aes_key_unwrap
from cryptography.hazmat.backends import default_backend
from redis import Redis

import jwt
from cryptography.hazmat.primitives import serialization
from utils.get_secret import get_secret
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cache.store import CHALLENGE_PREFIX, CHALLENGE_COUNTER_BIT_LENGTH

# Load the Base64-encoded keys from your secret manager
GOOGLE_PLAY_INTEGRITY_DECRYPTION_KEY = get_secret(
    "PLAY_INTEGRITY_DECRYPTION_KEY")
GOOGLE_PLAY_INTEGRITY_VERIFICATION_KEY = get_secret(
    "PLAY_INTEGRITY_VERIFICATION_KEY")

# Adds Base64 padding if needed (to make length a multiple of 4)


def add_padding(b64_str):
    return b64_str + '=' * (-len(b64_str) % 4)


def validate_challenge(redis_client: Redis, decoded_token: dict, challenge: str):
    challenge_id = challenge.split('.')[0]
    challenge_root_value = challenge.split('.')[1]

    request_challenge = decoded_token['requestDetails']['nonce']
    request_challenge_counter = request_challenge[-CHALLENGE_COUNTER_BIT_LENGTH:]
    request_challenge_root_value = request_challenge[:-
                                                     CHALLENGE_COUNTER_BIT_LENGTH]
    request_challenge_value = request_challenge_root_value + \
        '.' + request_challenge_counter

    stored_challenge = redis_client.get(f"{CHALLENGE_PREFIX}{challenge_id}")
    stored_challenge_root_value = stored_challenge.split('.')[0]
    stored_challenge_counter = stored_challenge.split('.')[1]

    print(f"stored_challenge: {stored_challenge}")
    print(f"stored_challenge_root_value: {stored_challenge_root_value}")
    print(f"challenge_root_value: {challenge_root_value}")
    print(f"request_challenge_root_value: {request_challenge_root_value}")

    if not stored_challenge_root_value == challenge_root_value == \
            request_challenge_root_value:
        raise Exception("Invalid challenge")

    print(f"request_challenge_counter: {request_challenge_counter}")
    print(f"stored_challenge_counter: {stored_challenge_counter}")

    if not int(request_challenge_counter) > int(stored_challenge_counter):
        raise Exception("Invalid challenge counter")

    redis_client.set(f"{CHALLENGE_PREFIX}{challenge_id}",
                     request_challenge_value)


def validate_token(redis_client: Redis, token: str, challenge: str) -> bool:
    try:

        # Decode the base64-encoded decryption and verification keys
        decryption_key_bytes = base64.b64decode(
            GOOGLE_PLAY_INTEGRITY_DECRYPTION_KEY)
        verification_key_bytes = base64.b64decode(
            GOOGLE_PLAY_INTEGRITY_VERIFICATION_KEY)

        # Load the verification key into a usable public key object
        public_key = serialization.load_der_public_key(verification_key_bytes)

        # The token is a compact JWE (JSON Web Encryption) split into 5 parts:
        # [JWE header, encrypted key, IV, ciphertext, auth tag]
        parts = token.split('.')
        header_b64 = parts[0]
        encrypted_key_b64 = parts[1]
        iv_b64 = parts[2]
        ciphertext_b64 = parts[3]
        auth_tag_b64 = parts[4]

        # Decode each JWE part (with padding fixed)
        header_decoded_bytes = base64.urlsafe_b64decode(
            add_padding(header_b64))
        encrypted_key_decoded_bytes = base64.urlsafe_b64decode(
            add_padding(encrypted_key_b64))
        iv_decoded_bytes = base64.urlsafe_b64decode(add_padding(iv_b64))
        ciphertext_decoded_bytes = base64.urlsafe_b64decode(
            add_padding(ciphertext_b64))
        auth_tag_decoded_bytes = base64.urlsafe_b64decode(
            add_padding(auth_tag_b64))

        # Unwrap the CEK (Content Encryption Key) using the decryption key
        cek = aes_key_unwrap(
            decryption_key_bytes,
            encrypted_key_decoded_bytes,
            backend=default_backend()
        )

        # Decrypt the ciphertext using AES-GCM with the unwrapped CEK
        aesgcm = AESGCM(cek)
        # The Additional Authenticated Data (AAD) is the base64-encoded header
        aad = base64.urlsafe_b64encode(header_decoded_bytes).rstrip(b"=")
        # Perform the actual AES-GCM decryption
        plaintext = aesgcm.decrypt(
            iv_decoded_bytes,
            ciphertext_decoded_bytes + auth_tag_decoded_bytes,
            aad
        )

        # The plaintext is a JWS (JSON Web Signature) — verify its signature next
        jws_token = plaintext.decode("utf-8")

        # Validate the inner signed JWT using the Google-provided verification key
        decoded_token = jwt.decode(
            jws_token,
            public_key,
            algorithms=["ES256"],
            # Google’s token doesn’t use an audience field, so skip that check
            options={"verify_aud": False}
        )

        validate_challenge(redis_client, decoded_token, challenge)

        return True

    except Exception as e:
        print(f"Error in validate_token: {e}")
        return False
