import { StackScreenProps } from "@react-navigation/stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ProteinEntry } from "@store/slices/proteinSlice";
import { Food } from "@store/slices/foodsSlice";
import { baseIap, premiumIap } from "@constants/iaps";

export type HomeStackParamList = {
  Welcome: undefined;
  WeightInput: undefined;
  StatsInfo: undefined;
  Main: undefined;
  EntryModal: undefined | { entry: ProteinEntry };
  MyFoodsModal: undefined | { entry: ProteinEntry };
  AddFoodModal: undefined | { food: Food };
  SuccessModal: undefined;
  PurchaseModal: { iap: typeof baseIap | typeof premiumIap };
  NewTagModal: undefined;
  SearchModal: undefined;
};

export type ProfileStackParamList = {
  ProfileNavList: undefined;
  AppearanceModal: undefined;
  PersonalInfoModal: undefined;
  EditDailyGoalModal: undefined;
};

export type RootStackParamList = {
  Home: HomeStackParamList;
  Recipes: undefined;
  Profile: ProfileStackParamList;
};

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamList, T>,
    StackScreenProps<RootStackParamList>
  >;

export type RootScreenProps<T extends keyof RootStackParamList> =
  BottomTabScreenProps<RootStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    StackScreenProps<HomeStackParamList, T>,
    StackScreenProps<RootStackParamList>
  >;
