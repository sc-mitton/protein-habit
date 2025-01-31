import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "@store/hooks";
import WelcomeScreen from "./welcome/WelcomeScreen";
import HomeScreen from "./home/HomeScreen";
import Menu from "./Menu";
import { RootStackParamList } from "@types";
import Appearance from "./appearance/Appearance";
import WeightInput from "./welcome/WeightInput";
import PersonalInfo from "./personal-info/PersonalInfo";
import ProteinEntry from "./protein-entry/ProteinEntry";
import EditDailyGoal from "./edit-daily-goal/EditDailyGoal";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { name } = useAppSelector((state) => state.user);

  return (
    <Stack.Navigator initialRouteName={name ? "Home" : "Welcome"}>
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
          name="Home"
          component={HomeScreen}
          options={{
            headerBackVisible: false,
            title: "",
            headerTransparent: true,
            headerRight: (props) => <Menu />,
          }}
        />
        <Stack.Screen
          options={{
            presentation: "transparentModal",
            headerShown: false,
          }}
          name="Appearance"
          component={Appearance}
        />
        <Stack.Screen
          options={{
            presentation: "transparentModal",
            headerShown: false,
          }}
          name="EditDailyGoal"
          component={EditDailyGoal}
        />
        <Stack.Screen
          options={{
            presentation: "modal",
            headerShown: false,
          }}
          name="PersonalInfo"
          component={PersonalInfo}
        />
        <Stack.Screen
          name="ProteinEntry"
          component={ProteinEntry}
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootStack;
