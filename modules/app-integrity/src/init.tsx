import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import AppIntegrity from "./AppIntegrityModule";
import type { AppIntegrityError } from "./AppIntegrity.types";

interface Props {
  challengeUrl: string;
  attestUrl: string;
  refresh?: boolean;
}

let globalChallengeUrl: string;
let globalAttestUrl: string;

export const appIntegrityInit = async (props: Props) => {
  const { challengeUrl, attestUrl, refresh = false } = props;
  globalChallengeUrl = challengeUrl;
  globalAttestUrl = attestUrl;
  const challenge = await SecureStore.getItemAsync("challenge");
  const keyId = await SecureStore.getItemAsync("keyId");

  const getChallenge = async (keyId?: string): Promise<string> => {
    const response = await fetch(challengeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(keyId && { "x-key-id": keyId }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get challenge: ${response.statusText}`);
    }
    const body = await response.json();
    return body;
  };

  const attest = async (data: {
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
  };

  const handleIOSInit = async () => {
    // 1. Get challenge
    const challengeResponse = await getChallenge();
    // 2. Generate key (ios only)
    const keyResult = await AppIntegrity.asyncGenerateKey();

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
    const newChallenge = await getChallenge(keyResult.keyId);
    await SecureStore.setItemAsync("challenge", newChallenge);
  };

  const handleAndroidInit = async () => {
    const challenge = await getChallenge();
    await SecureStore.setItemAsync("challenge", challenge);
  };

  const shouldInit =
    Platform.OS === "ios"
      ? refresh || !challenge || !keyId
      : refresh || !challenge;

  if (Platform.OS === "ios" && shouldInit) {
    await handleIOSInit();
  } else if (shouldInit) {
    await handleAndroidInit();
  }
};

export const getAppIntegrity = async (
  retryCount: number = 0,
): Promise<{
  challenge: string | null;
  keyId: string | null;
  token: string | null;
}> => {
  if (retryCount > 3) {
    throw new Error("Failed to get app integrity");
  }

  try {
    let challenge = await SecureStore.getItemAsync("challenge");
    const keyId = await SecureStore.getItemAsync("keyId");
    let token = await SecureStore.getItemAsync("token");

    if (!token && Platform.OS === "android" && challenge) {
      const challengeValue = challenge!.split(".").slice(1).join(".");
      token = await AppIntegrity.asyncGenerateToken(challengeValue);
      await SecureStore.setItemAsync("token", token);

      // Increment challenge counter (only necessary on android)
      const challengeParts = challenge.split(".");
      const newChallenge =
        challengeParts.slice(0, challengeParts.length - 1).join(".") +
        "." +
        (parseInt(challengeParts[challengeParts.length - 1]) + 1).toString();
      await SecureStore.setItemAsync("challenge", newChallenge);
      challenge = newChallenge;
    }

    return {
      challenge: challenge || null,
      keyId: keyId || null,
      token: token || null,
    };
  } catch {
    await appIntegrityInit({
      challengeUrl: globalChallengeUrl!,
      attestUrl: globalAttestUrl!,
    });
    return getAppIntegrity(retryCount + 1);
  }
};
