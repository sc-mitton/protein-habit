import { useState } from "react";
// import {
//   CardStyleInterpolators,
//   createStackNavigator,
// } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState } from "react-native";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import { Box, Text } from "@components";
import { useAppSelector } from "@store/hooks";
import WelcomeScreen from "./welcome/WelcomeScreen";
import HomeMainScreen from "./home-main/HomeMain";
import { HomeStackParamList } from "@types";
import Appearance from "./appearance/Appearance";
import WeightInput from "./welcome/WeightInput";
import PersonalInfo from "./personal-info/PersonalInfo";
import Entry from "./entry/Entry";
import Menu from "./Menu";
import EditDailyGoal from "./edit-daily-goal/EditDailyGoal";
import MyFoods from "./my-foods/MyFoods";
import AddFood from "./add-food/AddFood";
import SuccessModal from "./success/SuccessModal";
import Purchase from "./purchase/Purchase";
import { useEffect } from "react";
import { RootScreenProps } from "@types";
import CalendarSheet from "./home-main/CalendarSheet";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const RootStack = (props: RootScreenProps<"Home">) => {
  const theme = useTheme();

  const { name } = useAppSelector((state) => state.user);
  const [currentDay, setCurrentDay] = useState(dayjs());

  const androidHeaderOptions = {
    headerTintColor: theme.colors.primaryText,
    headerBackButtonDisplayMode: "default",
    headerStyle: {
      backgroundColor: theme.colors.secondaryBackground,
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
          options={{
            title: "",
            headerShown: true,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: theme.colors.mainBackground,
            },
            header: () => (
              <Box
                flexDirection="row"
                paddingTop={"statusBar"}
                justifyContent="space-between"
                backgroundColor="mainBackground"
                alignItems="center"
                paddingHorizontal="m"
              >
                {/* <Box flex={1}>
                  <Button onPress={() => props.navigation.openDrawer()}>
                    <Icon icon={Menu2} strokeWidth={2} size={22} />
                  </Button>
                </Box> */}
                <Box
                  // alignItems="center"
                  alignItems="flex-start"
                  gap="xs"
                  flex={2}
                  flexGrow={2}
                >
                  <Text variant="bold">Welcome, {name}</Text>
                  <Text color="tertiaryText">
                    {currentDay.format("MMM D, YYYY")}
                  </Text>
                </Box>
                <Box flex={1} height={"100%"}>
                  <Box marginTop="xxs" marginRight="nm">
                    <Menu />
                  </Box>
                </Box>
              </Box>
            ),
          }}
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
        <Stack.Screen name="EditDailyGoal" component={EditDailyGoal} />
        <Stack.Screen name="Appearance" component={Appearance} />
        <Stack.Screen name="MyFoods" component={MyFoods} />
        <Stack.Screen
          name="SuccessModal"
          component={SuccessModal}
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="Purchase" component={Purchase} />
        <Stack.Screen name="Calendar" component={CalendarSheet} />
      </Stack.Group>

      {/* Other Modals */}
      <Stack.Screen
        name="Entry"
        component={Entry}
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
          headerShown: true,
          ...androidHeaderOptions,
          title: "",
        }}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          headerShown: true,
          headerTitle: "Personal Info",
          headerBackground: () => (
            <Box
              backgroundColor="mainBackground"
              flex={1}
              borderBottomWidth={1.5}
              borderBottomColor="borderColor"
            />
          ),
          headerTintColor: theme.colors.primaryText,
        }}
        name="PersonalInfo"
        component={PersonalInfo}
      />
      <Stack.Screen
        name="AddFood"
        component={AddFood}
        options={{
          headerShown: true,
          headerTitle: "Add Food",
          headerBackTitle: "",
          headerBackground: () => (
            <Box
              backgroundColor="mainBackground"
              flex={1}
              borderBottomWidth={1.5}
              borderBottomColor="borderColor"
            />
          ),
          presentation: "modal",
          animation: "fade_from_bottom",
          ...androidHeaderOptions,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
