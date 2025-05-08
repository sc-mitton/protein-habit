from pydantic import BaseModel


class SearchRequest(BaseModel):
    text: str


class AttestRequest(BaseModel):
    attestation: str
    keyId: str
    challenge: str
