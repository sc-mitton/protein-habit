import { useEffect, useCallback } from "react";
import { StatusBar, Platform } from "react-native";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import { Provider } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { EventProvider } from "react-native-outside-press";
import * as Linking from "expo-linking";

import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";

import lightTheme, { darkTheme } from "@theme";
import { Box, Text } from "@components";
import { store, persistor } from "./src/store";
import RootStack from "./src/screens/RootDrawer";
import { baseIap, premiumIap } from "@constants/iaps";

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
  const colorScheme = useColorScheme();
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
      <NavigationContainer linking={linking as any}>
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

function App() {
  const colorScheme = useColorScheme();
  const restyledTheme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <Provider store={store}>
      <ThemeProvider theme={restyledTheme}>
        <PaperProvider>
          <EventProvider>
            <BottomSheetModalProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView>
                  <PersistGate loading={null} persistor={persistor}>
                    <MainApp />
                  </PersistGate>
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </BottomSheetModalProvider>
          </EventProvider>
        </PaperProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
