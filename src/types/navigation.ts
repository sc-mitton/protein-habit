import { StackScreenProps } from "@react-navigation/stack";
import type { Food } from "@store/slices/foodsSlice";
import type { ProteinEntry } from "@store/slices/proteinSlice";

export type RootStackParamList = {
  Welcome: undefined;
  WeightInput: undefined;
  Home: undefined;
  Appearance: undefined;
  PersonalInfo: undefined;
  Entry: undefined | { entry: ProteinEntry };
  EditDailyGoal: undefined;
  MyFoods: undefined | { entry: ProteinEntry };
  AddFood: undefined | { food: Food };
  SuccessModal: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
