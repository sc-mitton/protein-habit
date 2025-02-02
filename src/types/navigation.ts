import { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  Welcome: undefined;
  WeightInput: undefined;
  Home: undefined;
  Appearance: undefined;
  PersonalInfo: undefined;
  Entry: undefined;
  EditDailyGoal: undefined;
  MyFoods: undefined;
  AddFood: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
