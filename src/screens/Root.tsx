import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
          name="Entry"
          component={Entry}
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
            headerShown: false,
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen
          name="AddFood"
          component={AddFood}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootStack;
