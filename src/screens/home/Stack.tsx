import { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState } from "react-native";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import HomeMainScreen from "./main/Screen";
import { HomeStackParamList } from "@types";
import { BottomTabsScreenProps } from "@types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const RootStack = (props: BottomTabsScreenProps<"Home">) => {
  const theme = useTheme();

  const [currentDay, setCurrentDay] = useState(dayjs());

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
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={HomeMainScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
