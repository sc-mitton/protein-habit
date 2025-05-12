import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ProteinEntry } from "@store/slices/proteinSlice";
import { Food } from "@store/slices/foodsSlice";
import { BookmarkCategory } from "@store/slices/bookmarksSlice";

export type RecipesStackParamList = {
  RecipesList: undefined;
};

export type BottomTabsParamList = {
  Home: undefined;
  Recipes: NavigatorScreenParams<RecipesStackParamList>;
  Profile: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  WeightInput: undefined;
  BottomTabs: NavigatorScreenParams<BottomTabsParamList>;
  RecipeDetail: { recipe: string };
  BookmarkedRecipes: undefined;
  BookmarkCategory: { category: BookmarkCategory };
  GroceryList: undefined;
  SuccessModal: undefined;
  PurchaseModal?: { proFeatureAccess?: boolean };
  SearchModal: undefined;
  EntryModal: undefined | { entry: ProteinEntry };
  MyFoodsModal: undefined | { entry: ProteinEntry };
  AddFoodModal: undefined | { food: Food };
  NewTagModal: undefined;
  BookmarkModal: { recipe: string };
  AppearanceModal: undefined;
  PersonalInfoModal: undefined;
  EditDailyGoalModal: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type BottomTabsScreenProps<T extends keyof BottomTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, T>,
    RootScreenProps<keyof RootStackParamList>
  >;

export type RecipesScreenProps<T extends keyof RecipesStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<RecipesStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabsParamList, keyof BottomTabsParamList>,
      RootScreenProps<keyof RootStackParamList>
    >
  >;
