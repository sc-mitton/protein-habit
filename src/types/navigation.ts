import { StackScreenProps } from "@react-navigation/stack";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ProteinEntry } from "@store/slices/proteinSlice";
import { Food } from "@store/slices/foodsSlice";
import { baseIap, premiumIap } from "@constants/iaps";
import { Recipe } from "@store/slices/recipesSlice";

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
  Explore: undefined;
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
  RecipeDetail: { recipe: Recipe };
  BookmarkedRecipes: undefined;
  GroceryList: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type BottomTabsScreenProps<T extends keyof BottomTabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabsParamList, T>,
    RootScreenProps<keyof RootStackParamList>
  >;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    StackScreenProps<HomeStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabsParamList, keyof BottomTabsParamList>,
      RootScreenProps<keyof RootStackParamList>
    >
  >;

export type RecipesScreenProps<T extends keyof RecipesStackParamList> =
  CompositeScreenProps<
    StackScreenProps<RecipesStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabsParamList, keyof BottomTabsParamList>,
      RootScreenProps<keyof RootStackParamList>
    >
  >;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabsParamList, keyof BottomTabsParamList>,
      RootScreenProps<keyof RootStackParamList>
    >
  >;
