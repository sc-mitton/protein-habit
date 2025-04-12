import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ProteinEntry } from "@store/slices/proteinSlice";
import { Food } from "@store/slices/foodsSlice";
import { baseIap, premiumIap } from "@constants/iaps";
import { Recipe } from "@db/schema/types";

export type HomeStackParamList = {
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

export type RecipesStackParamList = {
  List: undefined;
};

export type BottomTabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Recipes: NavigatorScreenParams<RecipesStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Welcome: undefined;
  WeightInput: undefined;
  BottomTabs: NavigatorScreenParams<BottomTabsParamList>;
  RecipeDetail: { recipe: string };
  BookmarkedRecipes: undefined;
  GroceryList: undefined;
  BookmarkModal: { recipe: string };
  AddBookmarkCategoryModal: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type BottomTabsScreenProps<T extends keyof BottomTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, T>,
    RootScreenProps<keyof RootStackParamList>
  >;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabsParamList, keyof BottomTabsParamList>,
      RootScreenProps<keyof RootStackParamList>
    >
  >;

export type RecipesScreenProps<T extends keyof RecipesStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<RecipesStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabsParamList, keyof BottomTabsParamList>,
      RootScreenProps<keyof RootStackParamList>
    >
  >;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabsParamList, keyof BottomTabsParamList>,
      RootScreenProps<keyof RootStackParamList>
    >
  >;
