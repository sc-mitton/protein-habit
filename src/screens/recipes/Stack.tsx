import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabsScreenProps, RecipesStackParamList } from "@types";
import { useTheme } from "@shopify/restyle";
import { SymbolView } from "expo-symbols";
import Fontisto from "@expo/vector-icons/Fontisto";

import ExploreScreen from "./RecipesScreen";
import { Box, Button, Icon } from "@components";
import { Bookmark } from "geist-native-icons";
import { selectAccent } from "@store/slices/uiSlice";
import { useAppSelector } from "@store/hooks";
import { Theme } from "@theme";
import { useColorScheme } from "react-native";

const Stack = createNativeStackNavigator<RecipesStackParamList>();

const RecipesStack = (props: BottomTabsScreenProps<"Recipes">) => {
  const theme = useTheme<Theme>();
  const accentColor = useAppSelector(selectAccent);
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: true,
        headerBlurEffect: colorScheme === "dark" ? "dark" : "light",
        headerBackTitle: "Back",
        title: "Bookmarks",
        headerTintColor: accentColor
          ? theme.colors[accentColor]
          : theme.colors.primaryText,
        headerLargeTitle: true,
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Inter-SemiBold",
          color: theme.colors.primaryText,
        },
        headerLargeTitleStyle: {
          fontSize: 30,
          fontWeight: "bold",
          fontFamily: "Inter-SemiBold",
          color: theme.colors.primaryText,
        },
        headerBackTitleStyle: {
          fontSize: 16,
          fontFamily: "Inter-SemiBold",
        },
      }}
    >
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerTitleAlign: "left",
          title: "Recipes",
          headerSearchBarOptions: {
            placeholder: "Search",
            hideWhenScrolling: true,
            barTintColor: theme.colors.cardBackground,
          },
          headerRight: () => (
            <Box flexDirection="row" gap="s">
              <Button
                padding="xss"
                backgroundColor="primaryButton"
                onPress={() => {
                  props.navigation.navigate("GroceryList");
                }}
                icon={
                  <SymbolView
                    name="basket.fill"
                    size={18}
                    tintColor={theme.colors.secondaryText}
                    fallback={
                      <Fontisto
                        name="shopping-basket"
                        size={18}
                        color={theme.colors.secondaryText}
                      />
                    }
                  />
                }
              />
              <Button
                padding="xss"
                backgroundColor="primaryButton"
                onPress={() => {
                  props.navigation.navigate("BookmarkedRecipes");
                }}
              >
                <Icon
                  icon={Bookmark}
                  size={18}
                  color="secondaryText"
                  borderColor="secondaryText"
                />
              </Button>
            </Box>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default RecipesStack;
