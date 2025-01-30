import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "@store/hooks";
import WelcomeScreen from "./welcome/WelcomeScreen";
import HomeScreen from "./home/HomeScreen";
import Menu from "./Menu";
import { RootStackParamList } from "@types";
import Appearance from "./appearance/Appearance";

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
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootStack;
