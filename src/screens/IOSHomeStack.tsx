import { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState } from "react-native";
import { Menu2 } from "geist-native-icons";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import { Box, Text, Icon, Button } from "@components";
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
import NewTag from "./new-tag/NewTag";
import Purchase from "./purchase/Purchase";
import Search from "./search/Search";
import { RootScreenProps } from "@types";
import CalendarSheet from "./home-main/CalendarSheet";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const RootStack = (props: RootScreenProps<"Home">) => {
  const theme = useTheme();

  const { name } = useAppSelector((state) => state.user);
  const [currentDay, setCurrentDay] = useState(dayjs());

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
          // headerTitle: () => {
          //   return (
          //     <Box
          //       paddingTop="xs"
          //       paddingHorizontal="xs"
          //       gap="xs"
          //       alignItems="center"
          //     >
          //       <Text>Welcome, {name}</Text>
          //       <Text color="tertiaryText">
          //         {currentDay.format("MMM D, YYYY")}
          //       </Text>
          //     </Box>
          //   );
          // },
          headerLeft: () => {
            return (
              // <Button
              //   marginTop="xs"
              //   onPress={() => props.navigation.openDrawer()}
              // >
              //   <Icon
              //     icon={Menu2}
              //     strokeWidth={2}
              //     size={22}
              //   />
              // </Button>
              <Box
                paddingTop="xs"
                paddingHorizontal="s"
                gap="xs"
                alignItems="flex-start"
              >
                <Text fontSize={18} variant="bold">
                  Welcome, {name}
                </Text>
                <Text color="tertiaryText">
                  {currentDay.format("MMM D, YYYY")}
                </Text>
              </Box>
            );
          },
          headerRight: () => (
            <Box paddingTop="xs" marginRight="xs">
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
        <Stack.Screen
          name="SuccessModal"
          component={SuccessModal}
          options={{ animation: "fade" }}
        />
        <Stack.Screen name="Purchase" component={Purchase} />
        <Stack.Screen name="Calendar" component={CalendarSheet} />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Group>

      {/* Other Modals */}
      <Stack.Screen
        name="Entry"
        component={Entry}
        options={{
          animation: "fade_from_bottom",
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewTag"
        component={NewTag}
        options={{
          animation: "fade_from_bottom",
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyFoods"
        component={MyFoods}
        options={{
          animation: "fade_from_bottom",
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        options={{
          presentation: "modal",
          headerShown: false,
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
