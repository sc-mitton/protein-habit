import { useCallback, useEffect } from "react";
import AppIntegrity from "app-integrity";
import type { AppIntegrityError } from "app-integrity";
import {
  useChallengeMutation,
  useAttestMutation,
} from "@store/slices/appIntegritySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAppIntegrity = () => {
  const [challenge] = useChallengeMutation();
  const [attest] = useAttestMutation();

  const handleAttestation = useCallback(async () => {
    const existingKeyId = await AsyncStorage.getItem("keyId");
    if (existingKeyId) return;
    // 1. Get challenge
    const challengeResponse = await challenge().unwrap();
    // 2. Generate key (ios only)
    const result = await AppIntegrity.asyncGenerateKey(challengeResponse);
    // Error check
    if (result && "code" in result && "message" in result) {
      const error = result as AppIntegrityError;
      console.error("Attestation error:", error.message);
      return;
    }
    // 3. Send attestation to server (ios only)
    if (result.keyId) {
      AsyncStorage.setItem("keyId", result.keyId);
      await attest({
        attestation: result.attestation,
        keyId: result.keyId,
        challenge: challengeResponse,
      }).unwrap();
    }
    // 4. Get new challenge for creating future assertions and store it
    const newChallenge = await challenge().unwrap();
    AsyncStorage.setItem("challenge", newChallenge);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    handleAttestation();
  }, [handleAttestation]);
};
