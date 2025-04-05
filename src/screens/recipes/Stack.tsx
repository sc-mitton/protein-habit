import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabsScreenProps, RecipesStackParamList } from "@types";
import { useTheme } from "@shopify/restyle";

import ExploreScreen from "./RecipesScreen";
import { Button, Icon } from "@components";
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
            barTintColor: theme.colors.secondaryBackground,
          },
          headerRight: () => (
            <Button
              padding="xss"
              backgroundColor="primaryButton"
              onPress={() => {
                props.navigation.navigate("BookmarkedRecipes");
              }}
            >
              <Icon
                icon={Bookmark}
                size={16}
                color="secondaryText"
                borderColor="secondaryText"
              />
            </Button>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default RecipesStack;
