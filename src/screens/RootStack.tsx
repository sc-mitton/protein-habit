import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@types";
import { useTheme } from "@shopify/restyle";
import { useColorScheme, Platform } from "react-native";

import WelcomeScreen from "./welcome/WelcomeScreen";
import WeightInput from "./welcome/WeightInput";
import BottomTabs from "./BottomTabs";
import RecipesDetailScreen from "./recipes-detail/RecipesDetailScreen";
import GroceryListScreen from "./grocery-list/GroceryListScreen";
import BookmarkedRecipesScreen from "./bookmarked-recipes/BookmarkedRecipesScreen";
import { BookmarkButton } from "@components";
import { useAppSelector } from "@store/hooks";
import { selectUserInfo } from "@store/slices/userSlice";
import { selectAccent } from "@store/slices/uiSlice";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { name } = useAppSelector(selectUserInfo);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const accentColor = useAppSelector(selectAccent);

  return (
    <Stack.Navigator
      initialRouteName={name ? "BottomTabs" : "Welcome"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WeightInput" component={WeightInput} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen
        name="RecipeDetail"
        options={({ route }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerTransparent: true,
          headerBackTitle: "Back",
          headerBlurEffect: colorScheme === "dark" ? "dark" : "light",
          headerTintColor: accentColor
            ? theme.colors[accentColor]
            : theme.colors.primaryText,
          headerTitleStyle: {
            fontSize: 16,
            fontFamily: "Inter-SemiBold",
            color: theme.colors.primaryText,
          },
          title: "",
          headerRight: () => (
            <BookmarkButton bookmarked={false} onPress={() => {}} size={28} />
          ),
          animation:
            Platform.OS === "ios" ? "ios_from_right" : "slide_from_bottom",
        })}
        component={RecipesDetailScreen}
      />
      <Stack.Group
        screenOptions={{
          headerShown: true,
          headerShadowVisible: false,
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
          options={{ title: "Bookmarks" }}
          component={BookmarkedRecipesScreen}
        />
        <Stack.Screen
          name="GroceryList"
          options={{ title: "Grocery List" }}
          component={GroceryListScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootStack;
