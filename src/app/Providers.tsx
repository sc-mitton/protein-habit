import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import { Provider } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react";
import { PaperProvider } from "react-native-paper";
import { EventProvider } from "react-native-outside-press";
import { KeyboardProvider } from "react-native-keyboard-controller";

import lightTheme, { darkTheme } from "@theme";
import { store, persistor } from "@store";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const restyledTheme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <Provider store={store}>
      <KeyboardProvider>
        <ThemeProvider theme={restyledTheme}>
          <PaperProvider>
            <EventProvider>
              <BottomSheetModalProvider>
                <SafeAreaProvider>
                  <GestureHandlerRootView>
                    <PersistGate loading={null} persistor={persistor}>
                      {children}
                    </PersistGate>
                  </GestureHandlerRootView>
                </SafeAreaProvider>
              </BottomSheetModalProvider>
            </EventProvider>
          </PaperProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </Provider>
  );
};

export default Providers;
