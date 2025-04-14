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
import BookmarkModal from "./bookmark-modal/BookmarkModal";
import BookmarkCategory from "./bookmark-category/BookmarkCategory";
import { useAppSelector } from "@store/hooks";
import { selectUserInfo } from "@store/slices/userSlice";
import { selectAccent } from "@store/slices/uiSlice";
import { Button, Icon } from "@components";
import { SymbolView } from "expo-symbols";
import { Plus } from "geist-native-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { name } = useAppSelector(selectUserInfo);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const accentColor = useAppSelector(selectAccent);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Stack.Navigator
      initialRouteName={name ? "BottomTabs" : "Welcome"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WeightInput" component={WeightInput} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          headerShown: false,
          animation: "fade",
        }}
        name="BookmarkModal"
        component={BookmarkModal}
      />
      <Stack.Screen
        name="RecipeDetail"
        options={() => ({
          headerLargeStyle: false,
          headerBlurEffect: "none",
          headerTitle: "",
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
          options={{
            title: "Bookmarks",
            headerRight: () => (
              <Button
                marginRight="ns"
                onPress={() => {
                  navigation.navigate("BookmarkModal", {
                    recipe: "",
                  });
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
          name="BookmarkCategory"
          options={() => ({
            headerLargeStyle: false,
            headerBlurEffect: "none",
            headerTitle: "",
          })}
          component={BookmarkCategory}
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
