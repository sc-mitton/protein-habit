// Platform-specific types
export type AppIntegrityKeyResult = {
  keyId: string;
};

export type AppIntegrityAttestationResult = {
  attestation: string;
};

export type AppIntegrityError = {
  code: string;
  message: string;
};

export type AppIntegrityAssertionResult = string;

export type AppIntegrityTokenResult = string;

export type AppIntegrityModule = {
  /**
   * Generates an assertion for the given client data using the specified key ID (ios only)
   * @param clientData - The client data to generate an assertion for
   * @param keyId - Optional key ID to use for assertion generation
   * @returns Promise that resolves to the assertion result
   */
  asyncGenerateAssertion(
    requestJSON: string,
    keyId?: string,
  ): Promise<AppIntegrityAssertionResult>;

  /**
   * Generates a token for the given challenge (android only)
   * @param challenge - The challenge string to use for token generation
   * @returns Promise that resolves to the token result
   */
  asyncGenerateToken(challenge: string): Promise<AppIntegrityTokenResult>;

  /**
   * Generates a new key for app integrity attestation (ios only)
   * @returns Promise that resolves to either a key result or an error
   */
  asyncGenerateKey(): Promise<AppIntegrityKeyResult | AppIntegrityError>;

  /**
   * Generates an attestation for the given key ID and challenge (ios only)
   * @param keyId - The key ID to generate an attestation for
   * @param challenge - The challenge string to use for attestation
   * @returns Promise that resolves to either an attestation result or an error
   */
  asyncAttestKey(
    keyId: string,
    challenge: string,
  ): Promise<AppIntegrityAttestationResult | AppIntegrityError>;
};

// Default export type for the module
export type AppIntegrity = AppIntegrityModule;

// Default export
declare const AppIntegrity: AppIntegrity;
export default AppIntegrity;
