import { Fragment } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTheme } from "@shopify/restyle";
import { Home, Book } from "geist-native-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Dimensions, StyleSheet, useColorScheme, Platform } from "react-native";
import { useDrawerProgress } from "@react-navigation/drawer";

import AndroidHomeStack from "./AndroidHomeStack";
import IOSHomeStack from "./IOSHomeStack";
import RecipesScreen from "./recipes/RecipesScreen";
import { Icon, Text, Box } from "@components";
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
      <Fragment>
        <AnimatedBlurView
          intensity={20}
          pointerEvents="none"
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
          paddingTop: 32,
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
          drawerContentStyle: {
            pointerEvents: "none",
          },
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
        component={
          Platform.OS === "android"
            ? withDrawerBlurBackground(AndroidHomeStack)
            : withDrawerBlurBackground(IOSHomeStack)
        }
      />
      <Drawer.Screen
        options={{
          drawerLabel: ({ focused }) => (
            <Box alignItems="flex-start" gap="xs" width="150%">
              <Text color={focused ? "primaryText" : "tertiaryText"}>
                Recipes
              </Text>
              <Box
                paddingHorizontal="xs"
                paddingVertical="nxs"
                marginLeft="nxs"
              >
                <Box
                  style={StyleSheet.absoluteFill}
                  backgroundColor="blue"
                  opacity={0.2}
                  borderRadius="sm"
                />
                <Text color="blue" fontSize={14}>
                  Coming Soon
                </Text>
              </Box>
            </Box>
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
