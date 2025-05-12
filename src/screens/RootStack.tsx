import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@types";
import { useTheme } from "@shopify/restyle";
import { useColorScheme, Platform } from "react-native";
import { proEntitlement } from "@constants/iaps";
import { SymbolView } from "expo-symbols";
import { Plus } from "geist-native-icons";
import {
  NavigationProp,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import dayjs from "dayjs";

import WelcomeScreen from "./welcome/WelcomeScreen";
import WeightInput from "./welcome/WeightInput";
import BottomTabs from "./BottomTabs";
import RecipesDetailScreen from "./recipes-detail/RecipesDetailScreen";
import BookmarkedRecipesScreen from "./bookmarked-recipes/BookmarkedRecipesScreen";
import BookmarkCategory from "./bookmark-category/BookmarkCategory";
// Modal screens
import BookmarkModal from "./bookmark-modal/BookmarkModal";
import SuccessModal from "./home/success/SuccessModal";
import Purchase from "./home/purchase/Purchase";
import Search from "./home/search/Search";
import Entry from "./home/entry/Entry";
import NewTag from "./home/new-tag/NewTag";
import MyFoods from "./home/my-foods/MyFoods";
import AddFood from "./home/add-food/AddFood";
import AppearanceScreen from "./profile/appearance/Appearance";
import EditDailyGoalScreen from "./profile/edit-daily-goal/EditDailyGoal";
import PersonalInfoScreen from "./profile/personal-info/PersonalInfo";

import { useAppSelector } from "@store/hooks";
import { selectUserInfo, selectUserInception } from "@store/slices/userSlice";
import { selectAccent } from "@store/slices/uiSlice";
import { Button, Icon } from "@components";
import { selectEntitlement } from "@store/slices/entitlementSlice";
import { getCurrentRoute } from "@src/app/RootNavigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

const PROTECTED_ROUTES = ["SearchModal", "RecipesList"];

export const useSubscriptionCheck = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const entitlement = useAppSelector(selectEntitlement);
  const currentRoute = getCurrentRoute();
  const routes = useNavigationState((state) => state?.routes || []);
  const inceptionDate = useAppSelector(selectUserInception);
  useEffect(() => {
    const hasProAccess = entitlement === proEntitlement;
    const route = currentRoute?.name;
    if (route && PROTECTED_ROUTES.includes(route) && !hasProAccess) {
      if (route.toLowerCase().includes("modal")) {
        navigation.goBack();
      }
      navigation.navigate("PurchaseModal", { proFeatureAccess: true });
    }
  }, [currentRoute, routes]);
  useEffect(() => {
    const hadAppForMoreThan1Day =
      dayjs().diff(dayjs(inceptionDate), "day") > 100;
    if (hadAppForMoreThan1Day && entitlement === "") {
      navigation.navigate("PurchaseModal");
    }
  }, [entitlement]);
};

const RootStack = () => {
  useSubscriptionCheck();

  const { name } = useAppSelector(selectUserInfo);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const accentColor = useAppSelector(selectAccent);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const androidHeaderOptions = {
    headerTintColor: theme.colors.primaryText,
    headerBackButtonDisplayMode: "default",
    headerStyle: {
      backgroundColor: "transparent",
    },
    headerShadowVisible: false,
    headerTitleStyle: {
      color: theme.colors.primaryText,
      fontFamily: "Inter-Bold",
    },
    title: "Add Protein",
  } as const;

  return (
    <Stack.Navigator
      initialRouteName={name ? "BottomTabs" : "Welcome"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WeightInput" component={WeightInput} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />

      {/* Modals */}
      <Stack.Group
        screenOptions={{
          headerShown: false,
          presentation: "modal",
          animation:
            Platform.OS === "ios" ? "fade_from_bottom" : "slide_from_bottom",
          headerShadowVisible: false,
          statusBarTranslucent: true,
          statusBarBackgroundColor: theme.colors.mainBackground,
          ...(Platform.OS === "android" && androidHeaderOptions),
        }}
      >
        <Stack.Screen name="EntryModal" component={Entry} />
        <Stack.Screen
          options={{
            ...(Platform.OS === "android" && { title: "" }),
          }}
          name="NewTagModal"
          component={NewTag}
        />
        <Stack.Screen name="MyFoodsModal" component={MyFoods} />
        <Stack.Screen name="AddFoodModal" component={AddFood} />
        <Stack.Screen name="PersonalInfoModal" component={PersonalInfoScreen} />
      </Stack.Group>

      {/* Transparent Modals */}
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          animation: Platform.OS === "ios" ? "fade" : "slide_from_bottom",
          headerShown: false,
        }}
      >
        <Stack.Screen name="SearchModal" component={Search} />
      </Stack.Group>

      {/* Bottom Sheet Modals */}
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
          animation: Platform.OS === "ios" ? "fade" : "slide_from_bottom",
          statusBarBackgroundColor: theme.colors.modalAndroidStatusBackground,
        }}
      >
        <Stack.Screen name="SuccessModal" component={SuccessModal} />
        <Stack.Screen name="PurchaseModal" component={Purchase} />
        <Stack.Screen name="BookmarkModal" component={BookmarkModal} />
        <Stack.Screen name="AppearanceModal" component={AppearanceScreen} />
        <Stack.Screen
          name="EditDailyGoalModal"
          component={EditDailyGoalScreen}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          headerShown: true,
          headerShadowVisible: false,
          headerBackButtonMenuEnabled: false,
          headerTransparent: true,
          headerBlurEffect: colorScheme === "dark" ? "dark" : "light",
          headerBackTitle: "Back",
          headerTintColor: accentColor
            ? theme.colors[accentColor]
            : theme.colors.primaryText,
          headerLargeTitle: true,
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter-Bold",
            color: theme.colors.primaryText,
          },
          headerLargeTitleStyle: {
            fontSize: 30,
            fontWeight: "bold",
            fontFamily: "Inter-Bold",
            color: theme.colors.primaryText,
          },
          headerBackTitleStyle: {
            fontSize: 16,
            fontFamily: "Inter-SemiBold",
          },
        }}
      >
        <Stack.Screen
          name="BookmarkedRecipes"
          options={{
            title: "Bookmarks",
            headerRight: () => (
              <Button
                marginRight="ns"
                onPress={() => {
                  navigation.navigate("BookmarkModal", { recipe: "" });
                }}
                accent
                icon={
                  <SymbolView
                    name="plus.circle.fill"
                    tintColor={
                      accentColor
                        ? theme.colors[accentColor]
                        : theme.colors.primaryText
                    }
                    size={24}
                    fallback={
                      <Icon
                        icon={Plus}
                        color="modalBackground"
                        accent
                        strokeWidth={2}
                        size={24}
                      />
                    }
                  />
                }
              />
            ),
          }}
          component={BookmarkedRecipesScreen}
        />
        <Stack.Screen
          name="RecipeDetail"
          options={() => ({
            headerLargeStyle: false,
            headerBlurEffect: "none",
            headerTitle: "",
            headerLargeTitle: false,
            headerTransparent: true,
          })}
          component={RecipesDetailScreen}
        />
        <Stack.Screen
          name="BookmarkCategory"
          options={() => ({
            headerLargeStyle: false,
            headerBlurEffect: "none",
            headerTitle: "",
          })}
          component={BookmarkCategory}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootStack;
