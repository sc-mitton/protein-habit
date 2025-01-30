import { StatusBar } from "expo-status-bar";
import { useColorScheme, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import { Provider } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

import lightTheme, { darkTheme } from "@theme";
import { Box } from "@components";
import { store, persistor } from "./src/store";
import RootStack from "./src/screens/Root";
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function MainApp() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const [fontsLoaded] = useFonts({
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        flex={1}
        onLayout={onLayoutRootView}
        backgroundColor="mainBackground"
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.mainBackground }}
        >
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
          <StatusBar
            backgroundColor="transparent"
            translucent
            style={colorScheme === "dark" ? "light" : "dark"}
          />
        </SafeAreaView>
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BottomSheetModalProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <MainApp />
            </PersistGate>
          </Provider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </BottomSheetModalProvider>
  );
}
