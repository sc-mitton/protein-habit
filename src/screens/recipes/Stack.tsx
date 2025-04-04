import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RecipesStackParamList } from "@types";

// Import screens
import ExploreScreen from "./explore/ExploreScreen";
import BookmarkedScreen from "./bookmarked/BookmarkedScreen";
import DetailScreen from "./detail/DetailScreen";

const Stack = createStackNavigator<RecipesStackParamList>();

const RecipesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ title: "Explore Recipes" }}
      />
      <Stack.Screen
        name="Bookmarked"
        component={BookmarkedScreen}
        options={{ title: "Bookmarked Recipes" }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params.recipe.description || "Recipe Details",
          headerBackTitle: "Back",
        })}
      />
    </Stack.Navigator>
  );
};

export default RecipesStack;
