import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@shopify/restyle";
import { Platform, StyleSheet, Dimensions, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { SymbolView } from "expo-symbols";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, {
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation, useNavigationState } from "@react-navigation/native";

import AndroidHomeStack from "./home/AndroidHomeStack";
import IOSHomeStack from "./home/IOSHomeStack";
import RecipesScreen from "./recipes/Stack";
import ProfileStack from "./profile/Stack";
import { Box } from "@components";
import { BottomTabsParamList } from "@types";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { selectHideBottomBar, showBottomBar } from "@store/slices/uiSlice";

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -40,
    height: 80,
  },
  gradient: {
    width: "100%",
    height: 60,
  },
});

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const nav = useNavigation();
  const navOpacity = useSharedValue(1);
  const [showGradient, setShowGradient] = useState(false);
  const routes = useNavigationState((state) => state?.routes || []);
  const hideBottomBar = useAppSelector(selectHideBottomBar);

  useEffect(() => {
    nav.addListener("state", () => {
      const index = navigation.getState().index;
      setShowGradient(index !== 2);
    });
  }, [navigation]);

  useEffect(() => {
    if (Platform.OS === "ios") return;
    const isModalVisible = routes.some(
      (route) =>
        route.name.includes("Modal") ||
        route.state?.routes?.some((r: any) => r.name.includes("Modal")),
    );

    navOpacity.value = isModalVisible ? 0 : withTiming(1);
  }, [routes]);

  useEffect(() => {
    dispatch(showBottomBar(true));
  }, []);

  useEffect(() => {
    if (hideBottomBar && navOpacity.value === 1) {
      navOpacity.value = withTiming(0);
    } else if (!hideBottomBar && navOpacity.value === 0) {
      navOpacity.value = withTiming(1);
    }
  }, [hideBottomBar]);

  const animation = useAnimatedStyle(() => {
    return {
      opacity: navOpacity.value,
      transform: [
        { translateY: interpolate(navOpacity.value, [0, 1], [100, 0]) },
      ],
      pointerEvents: navOpacity.value === 0 ? "none" : "auto",
    };
  });

  return (
    <Animated.View style={[styles.tabBar, animation]}>
      {showGradient && (
        <Animated.View
          exiting={FadeOut.duration(100)}
          style={styles.gradientContainer}
        >
          <LinearGradient
            colors={[
              theme.colors.transparentRGB,
              theme.colors.secondaryBackground,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
          <Box backgroundColor="secondaryBackground" height={60} />
        </Animated.View>
      )}
      <Box
        shadowColor="tabBarShadow"
        shadowRadius={16}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.5}
        position="absolute"
        elevation={8}
        borderRadius="full"
      >
        <Box
          flexDirection="row"
          gap="l"
          backgroundColor="tabBarBackground"
          shadowColor="tabBarShadow"
          shadowOpacity={0.5}
          shadowRadius={2}
          shadowOffset={{ width: 0, height: 1 }}
          paddingHorizontal="ml"
          paddingVertical="s"
          borderRadius="full"
          elevation={2}
        >
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Box
                key={route.key}
                alignItems="center"
                onTouchStart={onPress}
                margin="xxs"
              >
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused
                      ? theme.colors.primaryText
                      : theme.colors.tertiaryText,
                    size: 24,
                  })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Animated.View>
  );
};

const RootTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primaryText,
        tabBarInactiveTintColor: theme.colors.tertiaryText,
        animation: Platform.OS === "android" ? "none" : "fade",
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <SymbolView
              name="house.fill"
              tintColor={
                focused ? theme.colors.primaryText : theme.colors.tertiaryText
              }
              fallback={
                <Ionicons
                  name="home"
                  size={20}
                  color={
                    focused
                      ? theme.colors.primaryText
                      : theme.colors.tertiaryText
                  }
                />
              }
            />
          ),
        }}
        name="Home"
        component={Platform.OS === "android" ? AndroidHomeStack : IOSHomeStack}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <SymbolView
              name="book.pages.fill"
              tintColor={
                focused ? theme.colors.primaryText : theme.colors.tertiaryText
              }
              fallback={
                <FontAwesome5
                  name="book"
                  size={20}
                  color={
                    focused
                      ? theme.colors.primaryText
                      : theme.colors.tertiaryText
                  }
                />
              }
            />
          ),
        }}
        name="Recipes"
        component={RecipesScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <SymbolView
              name="person.fill"
              size={22}
              tintColor={
                focused ? theme.colors.primaryText : theme.colors.tertiaryText
              }
              fallback={
                <FontAwesome6
                  name="user-large"
                  size={20}
                  color={
                    focused
                      ? theme.colors.primaryText
                      : theme.colors.secondaryText
                  }
                />
              }
            />
          ),
        }}
        name="Profile"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

export default RootTabs;
