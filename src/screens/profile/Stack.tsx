import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@shopify/restyle";
import { Platform } from "react-native";

import { ProfileStackParamList, BottomTabsScreenProps } from "@types";
import ProfileNavList from "./ProfileNavList";
import AppearanceScreen from "./appearance/Appearance";
import PersonalInfoScreen from "./personal-info/PersonalInfo";
import EditDailyGoalScreen from "./edit-daily-goal/EditDailyGoal";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = (props: BottomTabsScreenProps<"Profile">) => {
  const theme = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="ProfileNavList"
        component={ProfileNavList}
      />
      <Stack.Group
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
          animation: Platform.OS === "android" ? "slide_from_bottom" : "fade",
          statusBarBackgroundColor: theme.colors.modalAndroidStatusBackground,
        }}
      >
        <Stack.Screen name="AppearanceModal" component={AppearanceScreen} />
        <Stack.Screen
          name="EditDailyGoalModal"
          component={EditDailyGoalScreen}
        />
      </Stack.Group>
      <Stack.Screen
        options={{
          presentation: "modal",
          headerShown: false,
          headerTintColor: theme.colors.primaryText,
          ...(Platform.OS === "android" && {
            animation: "slide_from_bottom",
          }),
        }}
        name="PersonalInfoModal"
        component={PersonalInfoScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
