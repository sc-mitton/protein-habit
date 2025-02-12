import { StackScreenProps } from "@react-navigation/stack";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { ProteinEntry } from "@store/slices/proteinSlice";
import { Food } from "@store/slices/foodsSlice";

export type HomeStackParamList = {
  Welcome: undefined;
  WeightInput: undefined;
  Appearance: undefined;
  Main: undefined;
  PersonalInfo: undefined;
  Entry: undefined | { entry: ProteinEntry };
  EditDailyGoal: undefined;
  MyFoods: undefined | { entry: ProteinEntry };
  AddFood: undefined | { food: Food };
  SuccessModal: undefined;
  StatsInfo: undefined;
};

export type RootStackParamList = {
  Home: HomeStackParamList;
  Recipes: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  DrawerScreenProps<RootStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  StackScreenProps<HomeStackParamList, T>;
