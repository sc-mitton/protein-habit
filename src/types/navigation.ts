import { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Appearance: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
