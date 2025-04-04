import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState } from "react-native";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import { Box, Text } from "@components";
import { useAppSelector } from "@store/hooks";
import WelcomeScreen from "./welcome/WelcomeScreen";
import HomeMainScreen from "./home-main/HomeMain";
import { HomeStackParamList } from "@types";
import WeightInput from "./welcome/WeightInput";
import Entry from "./entry/Entry";
import MyFoods from "./my-foods/MyFoods";
import AddFood from "./add-food/AddFood";
import SuccessModal from "./success/SuccessModal";
import NewTag from "./new-tag/NewTag";
import Purchase from "./purchase/Purchase";
import { useEffect } from "react";
import { RootScreenProps } from "@types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const RootStack = (props: RootScreenProps<"Home">) => {
  const theme = useTheme();

  const { name } = useAppSelector((state) => state.user);
  const [currentDay, setCurrentDay] = useState(dayjs());

  const androidHeaderOptions = {
    headerTintColor: theme.colors.primaryText,
    headerBackButtonDisplayMode: "default",
    headerStyle: {
      backgroundColor: theme.colors.mainBackground,
    },
    headerShadowVisible: false,
    headerTitleStyle: {
      color: theme.colors.primaryText,
      fontFamily: "Inter-Bold",
    },
    title: "Add Protein",
  } as const;

  // Make sure to update the day when it changes based on the
  // device clock

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          const newDay = dayjs();
          if (newDay.isAfter(currentDay, "day")) {
            // Day has changed, fire event
            setCurrentDay(newDay);
          }
        }
      },
    );

    return () => {
      appStateListener.remove();
    };
  }, [currentDay]);

  return (
    <Stack.Navigator initialRouteName={name ? "Main" : "Welcome"}>
      <Stack.Group>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeightInput"
          component={WeightInput}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={HomeMainScreen}
          options={{ headerShown: false }}
        />
      </Stack.Group>

      {/* Bottom Sheet Modals */}
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="SuccessModal"
          component={SuccessModal}
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="PurchaseModal" component={Purchase} />
      </Stack.Group>

      {/* Other Modals */}
      <Stack.Screen
        name="EntryModal"
        component={Entry}
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
          headerShown: false,
          ...androidHeaderOptions,
        }}
      />
      <Stack.Screen
        name="NewTagModal"
        component={NewTag}
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
          headerShown: false,
          ...androidHeaderOptions,
          title: "",
        }}
      />
      <Stack.Screen
        name="MyFoodsModal"
        component={MyFoods}
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
          headerShown: false,
          ...androidHeaderOptions,
        }}
      />
      <Stack.Screen
        name="AddFoodModal"
        component={AddFood}
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "fade_from_bottom",
          ...androidHeaderOptions,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
