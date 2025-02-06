import { StackScreenProps } from "@react-navigation/stack";
import { Food } from "@store/slices/foodsSlice";
export type RootStackParamList = {
  Welcome: undefined;
  WeightInput: undefined;
  Home: undefined;
  Appearance: undefined;
  PersonalInfo: undefined;
  Entry: undefined;
  EditDailyGoal: undefined;
  MyFoods: undefined;
  AddFood: undefined | { food: Food };
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
