import { useCallback, useEffect } from "react";
import { StatusBar } from "react-native";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

import { Box } from "@components";
import RootStack from "../screens/RootStack";
import { showBottomBar } from "@store/slices/uiSlice";
import { useAndroidNavBarBackground } from "@hooks";
import { appIntegrityInit } from "app-integrity";
import Providers from "./Providers";
import { useAppDispatch } from "@store/hooks";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

appIntegrityInit({
  challengeUrl: `${process.env.EXPO_PUBLIC_API_URL}/challenge`,
  attestUrl: `${process.env.EXPO_PUBLIC_API_URL}/attest`,
});

// Keep the splash s  creen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function MainApp() {
  useAndroidNavBarBackground();

  const dispatch = useAppDispatch();

  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    "Inter-Light": require("@assets/fonts/Inter_18pt-Light.ttf"),
    "Inter-Regular": require("@assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("@assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("@assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("@assets/fonts/Inter_18pt-Bold.ttf"),
    "NewYork-Heavy": require("@assets/fonts/NewYork-Heavy.otf"),
    "SFPro-SemiboldStencil": require("@assets/fonts/SFPro-SemiboldStencil.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    dispatch(showBottomBar(true));
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Box flex={1} onLayout={onLayoutRootView} backgroundColor="mainBackground">
      <RootStack />
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
