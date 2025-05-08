import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import AppIntegrity from "./AppIntegrityModule";
import type {
  AppIntegrityError,
  AppIntegrityKeyResult,
} from "./AppIntegrity.types";

interface UseAppIntegrityOptions {
  challengeUrl: string;
  attestUrl: string;
}

export const useAppIntegrity = (options: UseAppIntegrityOptions) => {
  const { challengeUrl, attestUrl } = options;

  const getChallenge = useCallback(async (): Promise<string> => {
    const response = await fetch(challengeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get challenge: ${response.statusText}`);
    }

    return response.text();
  }, [challengeUrl]);

  const attest = useCallback(
    async (data: {
      attestation: string;
      keyId: string;
      challenge: string;
    }): Promise<{ status: string; keyId: string }> => {
      const response = await fetch(attestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to attest: ${response.statusText}`);
      }

      return response.json();
    },
    [attestUrl],
  );

  const handleIOSAttestation = useCallback(async () => {
    const existingKeyId = await SecureStore.getItemAsync("keyId");
    const savedChallenge = await SecureStore.getItemAsync("challenge");
    if (existingKeyId && savedChallenge) return;

    // 1. Get challenge
    const challengeResponse = await getChallenge();
    // 2. Generate key (ios only)
    let keyResult: AppIntegrityKeyResult | AppIntegrityError | undefined;
    if (!existingKeyId) {
      keyResult = await AppIntegrity.asyncGenerateKey();
    } else {
      keyResult = { keyId: existingKeyId };
    }

    // Error check
    if (!keyResult) {
      console.error("Key generation error:", keyResult);
      return;
    }
    if (keyResult && "code" in keyResult && "message" in keyResult) {
      const error = keyResult as AppIntegrityError;
      console.error("Key generation error:", error.message);
      return;
    }

    // 3. Generate attestation for the key (ios only)
    const attestResult = await AppIntegrity.asyncAttestKey(
      keyResult.keyId,
      challengeResponse,
    );

    // Error check
    if (attestResult && "code" in attestResult && "message" in attestResult) {
      const error = attestResult as AppIntegrityError;
      console.error("Attestation error:", error.message);
      return;
    }

    // 4. Send attestation to server (ios only)
    await SecureStore.setItemAsync("keyId", keyResult.keyId);
    await attest({
      attestation: attestResult.attestation,
      keyId: keyResult.keyId,
      challenge: challengeResponse,
    });

    // 5. Get new challenge for creating future assertions and store it
    const newChallenge = await getChallenge();
    await SecureStore.setItemAsync("challenge", newChallenge);
  }, [getChallenge, attest]);

  const handleAndroidInit = useCallback(async () => {
    let challenge: string | null = null;
    challenge = await SecureStore.getItemAsync("challenge");
    if (!challenge) {
      challenge = await getChallenge();
    }
    await SecureStore.setItemAsync("challenge", challenge);
  }, [getChallenge]);

  useEffect(() => {
    // if (process.env.NODE_ENV === "development") return;
    try {
      if (Platform.OS === "ios") {
        handleIOSAttestation();
      } else {
        handleAndroidInit();
      }
    } catch (error) {
      console.error("Error during attestation:", error);
    }
  }, [handleIOSAttestation, handleAndroidInit]);
};
