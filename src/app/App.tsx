import { useEffect, useCallback } from "react";
import { StatusBar, Platform } from "react-native";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";

import { Box } from "@components";
import RootStack from "../screens/RootStack";
import { baseIap, premiumIap } from "@constants/iaps";
import { useNavigationTheme } from "@hooks";
import Providers from "./Providers";

export const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Recipes: "recipes",
      Home: {
        screens: {
          Purchase: {
            path: "iap-review/:iap",
            parse: {
              iap: (iap: string) => {
                if (iap === baseIap.sku) {
                  return baseIap;
                } else if (iap === premiumIap.sku) {
                  return premiumIap;
                }
                return "bad-sku";
              },
            },
          },
        },
      },
    },
  },
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function MainApp() {
  // useAppIntegrity();

  const colorScheme = useColorScheme();
  const navigationTheme = useNavigationTheme();

  const [fontsLoaded] = useFonts({
    "Inter-Light": require("./assets/fonts/Inter_18pt-Light.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter_18pt-Bold.ttf"),
    "NewYork-Heavy": require("./assets/fonts/NewYork-Heavy.otf"),
    "SFPro-SemiboldStencil": require("./assets/fonts/SFPro-SemiboldStencil.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Set the navigation bar color and button style based on the theme
  useEffect(() => {
    if (Platform.OS !== "android") return;
    setTimeout(() => {
      NavigationBar.setPositionAsync("absolute");
      NavigationBar.setBackgroundColorAsync("#ffffff01");
      NavigationBar.setButtonStyleAsync(
        colorScheme === "dark" ? "light" : "dark",
      );
    }, 1000);
  }, [colorScheme]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Box flex={1} onLayout={onLayoutRootView} backgroundColor="mainBackground">
      <NavigationContainer linking={linking as any} theme={navigationTheme}>
        <RootStack />
      </NavigationContainer>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
    </Box>
  );
}

export default function App() {
  return (
    <Providers>
      <MainApp />
    </Providers>
  );
}
