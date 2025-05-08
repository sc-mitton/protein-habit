import os
import cbor2
import base64
import hashlib
import json
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import ec

# Test data from the example
attest_file = os.path.join(os.path.dirname(__file__), "test_attestation.txt")
TEST_ATTESTATION = open(attest_file, "r").read()
TEST_KEY_ID = "bSrEhF8TIzIvWSPwvZ0i2+UOBre4ASH84rK15m6emNY="
TEST_TEAM_ID = "0352187391"
TEST_IOS_BUNDLE_ID = "com.apple.example_app_attest"
TEST_APP_ID = f"{TEST_TEAM_ID}.{TEST_IOS_BUNDLE_ID}"
TEST_CHALLENGE_ID = "test_challenge_id"
TEST_CHALLENGE_VALUE = "test_server_challenge"

# Create a test key pair
private_key = ec.generate_private_key(ec.SECP256R1())
public_key = private_key.public_key()
# Format the public key as base64 string
public_key_b64 = base64.b64encode(public_key.public_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)).decode('utf-8')

# Create test authenticator data
# Format: SHA256(rpId) + flags + counter
rp_id_hash = hashlib.sha256(TEST_APP_ID.encode()).digest()
counter = bytes([0x00, 0x00, 0x00, 0x01])  # Counter value 1
authenticator_data = rp_id_hash + counter

# Create client data
client_data = {"challenge": f"{TEST_CHALLENGE_ID}:{TEST_CHALLENGE_VALUE}"}
client_data_hash = hashlib.sha256(json.dumps(client_data).encode()).digest()

# Create nonce for signing
nonce = hashlib.sha256((authenticator_data + client_data_hash)).digest()

# Sign the nonce with the private key
signature = private_key.sign(
    nonce,
    ec.ECDSA(hashes.SHA256())
)

# Create the assertion object
TEST_ASSERTION = cbor2.dumps({
    "signature": signature,
    "authenticatorData": authenticator_data
})

# Base64 encode the assertion for the header
TEST_ASSERTION_B64 = base64.b64encode(TEST_ASSERTION).decode('utf-8')
