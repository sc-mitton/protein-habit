import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@shopify/restyle";
import { Platform, StyleSheet, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { SymbolView } from "expo-symbols";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, {
  FadeOut,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation, useNavigationState } from "@react-navigation/native";

import AndroidHomeStack from "./AndroidHomeStack";
import IOSHomeStack from "./IOSHomeStack";
import RecipesScreen from "./recipes/RecipesScreen";
import ProfileStack from "./profile/Stack";
import { Box, Text } from "@components";
import { RootStackParamList } from "@types";

const Tab = createBottomTabNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarBigShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -60,
    height: Dimensions.get("window").height * 0.17,
  },
});

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const theme = useTheme();
  const nav = useNavigation();
  const navOpacity = useSharedValue(1);
  const [showGradient, setShowGradient] = useState(false);
  const routes = useNavigationState((state) => state?.routes || []);

  useEffect(() => {
    nav.addListener("state", () => {
      const index = navigation.getState().index;
      setShowGradient(index === 0);
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

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          opacity: navOpacity,
          pointerEvents: navOpacity.value === 0 ? "none" : "auto",
        },
      ]}
    >
      {showGradient && (
        <Animated.View
          exiting={FadeOut.duration(100)}
          style={styles.tabBarBigShadow}
        >
          <LinearGradient
            colors={[
              theme.colors.transparentRGB,
              theme.colors.secondaryBackground,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.4 }}
            style={StyleSheet.absoluteFill}
          />
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
          tabBarLabel: "Home",
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
          tabBarLabel: "Recipes",
          headerBackground: () => (
            <Box backgroundColor="mainBackground" flex={1} />
          ),
          title: "",
          headerLeft: () => (
            <Box paddingLeft="l">
              <Text variant="bold" fontSize={24}>
                Recipes
              </Text>
            </Box>
          ),
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
          tabBarLabel: "Profile",
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
