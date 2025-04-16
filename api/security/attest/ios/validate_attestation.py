import base64
import hmac
import os
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.constant_time import bytes_eq
from cryptography.hazmat.primitives import serialization


def _to_fixed_length_hex(value: str, length: int = 16):
    return value.encode().ljust(length, b'\x00')[:length].hex()


def _sha256(data: bytes) -> bytes:
    h = hashes.Hash(hashes.SHA256(), default_backend())
    h.update(data)
    return h.finalize()


ENV = os.getenv("INTEGRITY_ENVIRONMENT", "development")
OID_APPLE = x509.ObjectIdentifier("1.2.840.113635.100.8.2")

PROD_AAGUID = 'appattest'
DEV_AAGUID = 'appattestdevelop'
PROD_AAGUID_HEX = _to_fixed_length_hex(PROD_AAGUID)
DEV_AAGUID_HEX = _to_fixed_length_hex(DEV_AAGUID)

# Load Apple's root certificate
ca_path = os.path.join(os.path.dirname(__file__),
                       "apple_attestation_root_ca.pem")
with open(ca_path, "rb") as f:
    apple_attestation_root_ca = f.read()

# Create X509 certificate object
root_cert = x509.load_pem_x509_certificate(
    apple_attestation_root_ca, default_backend()
)


def get_public_key(parsed_data: dict) -> str:
    """Get the public key from the attestation"""
    x5c = parsed_data.get('attStmt', {}).get('x5c', [])
    if not x5c:
        return False

    cred_cert = x509.load_der_x509_certificate(x5c[0])

    public_key = cred_cert.public_key()
    public_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint
    )

    key_hash = _sha256(public_bytes)
    key_hash_b64 = base64.b64encode(key_hash).decode()

    return key_hash_b64


def _validate_certificate_chain(parsed_data: dict) -> bool:
    """Step 1: Validate the certificate chain"""
    x5c = parsed_data.get('attStmt', {}).get('x5c', [])
    if not x5c:
        return False

    certs = [
        x509.load_der_x509_certificate(cert_data)
        for cert_data in x5c
    ]

    for i in range(len(certs) - 1):
        certs[i].verify_directly_issued_by(certs[i + 1])

    certs[-1].verify_directly_issued_by(root_cert)
    return True


def _validate_nonce(parsed_data: dict, challenge: str) -> bool:
    """Step 2: Verify nonce
    - compute client data hash
    - compute nonce
    - make sure nonce is valid
    """
    cert = x509.load_der_x509_certificate(
        parsed_data.get('attStmt', {}).get('x5c', [])[0],
        default_backend()
    )

    client_data_hash = parsed_data['authData']

    expected_nonce = _sha256(
        client_data_hash + challenge.encode())

    ext = cert.extensions.get_extension_for_oid(OID_APPLE)
    ext_nonce = ext.value.value[6:]

    if not bytes_eq(expected_nonce, ext_nonce):
        return False

    return True


def _validate_key_consistency(parsed_data: dict, key_id: str) -> bool:
    """Step 3: Verify key consistency
    - Compute keyIdentifier = SHA256(public key)
    - Ensure that keyIdentifier matches the value sent by the app
    """
    key_hash_b64 = get_public_key(parsed_data)

    return hmac.compare_digest(key_hash_b64, key_id)


def _validate_rp_id(parsed_data: dict, app_id: str, bundle_id: str) -> bool:
    """Step 4: Verify RP id
    - Compute expected_rp_id_hash = SHA256(App ID)
    - Extract rpIdHash from authData and ensure it matches expected_rp_id_hash
    """
    auth_data_rp_id_hash = parsed_data['authData'][:32]
    rp_id = f"{app_id}.{bundle_id}"
    expected_rp_id_hash = _sha256(rp_id.encode())

    return hmac.compare_digest(auth_data_rp_id_hash, expected_rp_id_hash)


def _validate_counter(parsed_data: dict) -> bool:
    """Step 5: Verify counter to prevent replay attacks
    - Counter should be 0 at first attestation
    - Counter should be monotonically increasing for subsequent attestations
    """
    counter_bytes = parsed_data['authData'][33:37]
    counter = int.from_bytes(counter_bytes, 'big')

    # For first attestation, counter should be 0
    if counter != 0:
        return False

    return True


def _validate_environment(parsed_data: dict) -> bool:
    """Step 6: Verify environment
    - Check aaguid field in authData:
      - aaguid should be:
        - "appattestdevelop" for development
        - "appattest000000000000" for production
      - Ensure that the attestation environment matches the expected one
    """
    aaguid = parsed_data['authData'][37:53]
    aaguid_hex = aaguid.hex()

    if ENV == "DEV":
        expected_aaguid = DEV_AAGUID_HEX
    else:
        expected_aaguid = PROD_AAGUID_HEX

    return hmac.compare_digest(aaguid_hex, expected_aaguid)


def _validate_auth_data_credential_id(parsed_data: dict, key_id: str) -> bool:
    """Step 7: Verify credential ID
    - Extract credentialID from authData and ensure it matches the value sent by the app
    """
    credential_id_length = int.from_bytes(
        parsed_data['authData'][53:55], 'big')
    credential_id = parsed_data['authData'][55:55 + credential_id_length]
    credential_id_b64 = base64.b64encode(credential_id).decode()

    return hmac.compare_digest(credential_id_b64, key_id)


def validate_attestation(
    attestation: dict,
    challenge: str,
    key_id: str,
    app_id: str,
    bundle_id: str,
    environment: str = 'DEV'
) -> bool:
    """Main validation method that orchestrates all validation steps"""
    try:
        validation_steps = [
            lambda: _validate_certificate_chain(attestation),
            lambda: _validate_nonce(attestation, challenge),
            lambda: _validate_rp_id(attestation, app_id, bundle_id),
            lambda: _validate_key_consistency(attestation, key_id),
            lambda: _validate_environment(attestation, environment),
            lambda: _validate_counter(attestation),
            lambda: _validate_auth_data_credential_id(attestation, key_id),
        ]

        for step in validation_steps:
            if not step():
                return False

        return True

    except Exception:
        return False
