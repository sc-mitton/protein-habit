import { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  Welcome: undefined;
  WeightInput: undefined;
  Home: undefined;
  Appearance: undefined;
  PersonalInfo: undefined;
  ProteinEntry: undefined;
  EditDailyGoal: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
