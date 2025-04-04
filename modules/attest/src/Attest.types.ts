import type { StyleProp, ViewStyle } from "react-native";

export type OnLoadEventPayload = {
  url: string;
};

export type AttestModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type AttestViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

// Platform-specific types
export type AttestKeyResult = {
  keyId?: string;
  attestation: string;
};

export type AttestError = {
  code: string;
  message: string;
};

export type AttestAssertionResult = string;

export type AttestModule = {
  asyncGenerateAssertion(clientData: string): Promise<AttestAssertionResult>;
  asyncGenerateKey(challenge: string): Promise<AttestKeyResult | AttestError>;
};
