import * as SecureStore from "expo-secure-store";
import AppIntegrity from "app-integrity";
import { Platform } from "react-native";

/**
 * Get the stored app integrity values from SecureStore
 * @returns Promise that resolves to an object containing the stored values
 */
export const getAppIntegrity = async () => {
  const challenge = await SecureStore.getItemAsync("challenge");
  const keyId = await SecureStore.getItemAsync("keyId");
  let token = await SecureStore.getItemAsync("token");

  if (!token && Platform.OS === "android" && challenge) {
    token = await AppIntegrity.asyncGenerateToken(challenge);
    await SecureStore.setItemAsync("token", token);
  }

  return {
    challenge: challenge || null,
    keyId: keyId || null,
    token: token || null,
  };
};
