import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import { Box, Text } from "@components";
import { useAppSelector } from "@store/hooks";
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

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { name } = useAppSelector((state) => state.user);
  const theme = useTheme();

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
                <Text variant="subheader">{dayjs().format("MMM D, YYYY")}</Text>
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
