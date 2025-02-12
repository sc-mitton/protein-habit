import { Fragment } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTheme } from "@shopify/restyle";
import { Home, Book } from "geist-native-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Dimensions, StyleSheet, useColorScheme } from "react-native";
import { useDrawerProgress } from "@react-navigation/drawer";

import HomeStack from "./HomeStack";
import RecipesScreen from "./recipes/RecipesScreen";
import { Icon, Text } from "@components";
import { RootStackParamList } from "@types";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Drawer = createDrawerNavigator<RootStackParamList>();

const withDrawerBlurBackground = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return function WithDrawerBlurBackground(props: P) {
    const colorScheme = useColorScheme();
    const progress = useDrawerProgress();

    const animation = useAnimatedStyle(() => {
      return {
        opacity: interpolate(progress.value, [0, 1], [0, 1]),
        zIndex: 1000,
      };
    });

    return (
      <Fragment key={`drawer-blur-${Math.random().toString(36).slice(0, 9)}`}>
        <AnimatedBlurView
          intensity={20}
          experimentalBlurMethod={"dimezisBlurView"}
          tint={colorScheme === "dark" ? "dark" : "light"}
          style={[StyleSheet.absoluteFillObject, animation]}
        />
        <Component {...props} />
      </Fragment>
    );
  };
};

const RootDrawer = () => {
  const theme = useTheme();
  const scheme = useColorScheme();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerLabelStyle: {
          color: theme.colors.primaryText,
        },
        drawerActiveBackgroundColor: "transparent",
        drawerStyle: {
          backgroundColor: theme.colors.secondaryBackground,
          borderRightWidth: 1.5,
          borderRightColor:
            scheme === "dark"
              ? "rgba(125, 125, 125, 0.05)"
              : "rgba(0, 0, 0, 0.05)",
          width: Dimensions.get("window").width / 2,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}
    >
      <Drawer.Screen
        options={{
          drawerLabelStyle: {
            color: theme.colors.primaryText,
          },
          drawerLabel: ({ focused }) => (
            <Text color={focused ? "primaryText" : "tertiaryText"}>Home</Text>
          ),
          drawerIcon: ({ focused, color }) => (
            <Icon
              icon={Home}
              size={20}
              color={focused ? "primaryText" : "tertiaryText"}
              strokeWidth={2}
            />
          ),
        }}
        name="Home"
        component={withDrawerBlurBackground(HomeStack)}
      />
      <Drawer.Screen
        options={{
          drawerLabel: ({ focused }) => (
            <Text color={focused ? "primaryText" : "tertiaryText"}>
              Recipes
            </Text>
          ),
          drawerIcon: ({ focused, color }) => (
            <Icon
              icon={Book}
              size={20}
              color={focused ? "primaryText" : "tertiaryText"}
              strokeWidth={2}
            />
          ),
        }}
        name="Recipes"
        component={withDrawerBlurBackground(RecipesScreen)}
      />
    </Drawer.Navigator>
  );
};

export default RootDrawer;
