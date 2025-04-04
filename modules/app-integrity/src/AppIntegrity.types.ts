// Platform-specific types
export type AppIntegrityKeyResult = {
  keyId?: string;
  attestation: string;
};

export type AppIntegrityError = {
  name: string;
  message: string;
};

export type AppIntegrityAssertionResult = string;

export type AppIntegrityModule = {
  asyncGenerateAssertion(
    clientData: string,
  ): Promise<AppIntegrityAssertionResult>;
  asyncGenerateKey(
    challenge: string,
  ): Promise<AppIntegrityKeyResult | AppIntegrityError>;
};
