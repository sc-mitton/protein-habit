import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, AppState } from "react-native";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import { Box, Text } from "@components";
import { dayTimeFormat } from "@constants/formats";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import WelcomeScreen from "./welcome/WelcomeScreen";
import HomeScreen from "./home/HomeScreen";
import Menu from "./Menu";
import { RootStackParamList } from "@types";
import Appearance from "./appearance/Appearance";
import WeightInput from "./welcome/WeightInput";
import PersonalInfo from "./personal-info/PersonalInfo";
import Entry from "./entry/Entry";
import EditDailyGoal from "./edit-daily-goal/EditDailyGoal";
import MyFoods from "./my-foods/MyFoods";
import AddFood from "./add-food/AddFood";
import StatsInfo from "./stats-info/StatsInfo";
import SuccessModal from "./success/SuccessModal";
import { selectUIDay, setUIDay } from "@store/slices/uiSlice";
import { useEffect } from "react";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { name } = useAppSelector((state) => state.user);
  const uiDay = useAppSelector(selectUIDay);
  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  const androidHeaderOptions = {
    headerTintColor: theme.colors.primaryText,
    headerTransparent: true,
    headerBackButtonDisplayMode: "minimal",
    headerTitleStyle: {
      color: theme.colors.primaryText,
      fontFamily: "Inter-Regular",
    },
    title: "",
  } as const;

  // Make sure to update the day when it changes based on the
  // device clock

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          const newDay = new Date().getDate();
          if (newDay !== currentDay) {
            // Day has changed, fire event
            setCurrentDay(newDay);

            // Only update the ui day also if it's within 1 day
            // If the user is in the app on the day change, and
            // they're selecting different dates, then we don't
            // want to interupt that
            if (dayjs().diff(dayjs(uiDay), "day") <= 1) {
              dispatch(setUIDay(dayjs().format(dayTimeFormat)));
            }
          }
        }
      },
    );

    return () => {
      appStateListener.remove();
    };
  }, [currentDay]);

  return (
    <Stack.Navigator initialRouteName={name ? "Home" : "Welcome"}>
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
        name="Home"
        component={HomeScreen}
        options={{
          title: "",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.mainBackground,
          },
          headerLeft: () => {
            return (
              <Box paddingHorizontal="xs" paddingVertical="s">
                <Text variant="header">Welcome, {name}</Text>
                <Text variant="subheader">
                  {dayjs(uiDay).format("MMM D, YYYY")}
                </Text>
              </Box>
            );
          },
          headerRight: () => (
            <Box
              marginRight={Platform.OS === "android" ? "nm" : undefined}
              marginVertical="m"
            >
              <Menu />
            </Box>
          ),
        }}
      />

      {/* Bottom Sheet Modals */}
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
          statusBarBackgroundColor: theme.colors.modalAndroidStatusBackground,
        }}
      >
        <Stack.Screen name="Appearance" component={Appearance} />
        <Stack.Screen name="EditDailyGoal" component={EditDailyGoal} />
        <Stack.Screen name="MyFoods" component={MyFoods} />
        <Stack.Screen
          name="SuccessModal"
          component={SuccessModal}
          options={{ animation: "fade" }}
        />
      </Stack.Group>

      {/* Other Modals */}
      <Stack.Screen
        name="StatsInfo"
        component={StatsInfo}
        options={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Entry"
        component={Entry}
        options={{
          animation: "fade_from_bottom",
          presentation: "modal",
          headerShown: Platform.OS === "android" ? true : false,
          ...(Platform.OS === "android" && androidHeaderOptions),
        }}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          headerShown: Platform.OS === "android" ? true : false,
          headerTitle: "Personal Info",
          headerBackground: () => (
            <Box backgroundColor="mainBackground" flex={1} />
          ),
          headerTintColor: theme.colors.primaryText,
          statusBarBackgroundColor: theme.colors.mainBackground,
        }}
        name="PersonalInfo"
        component={PersonalInfo}
      />
      <Stack.Screen
        name="AddFood"
        component={AddFood}
        options={{
          headerShown: false,
          presentation: "modal",
          ...(Platform.OS === "android" && androidHeaderOptions),
          animation: "fade_from_bottom",
          headerShadowVisible: false,
          statusBarTranslucent: true,
          statusBarBackgroundColor: theme.colors.mainBackground,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
