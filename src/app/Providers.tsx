import React, { useEffect } from "react";
import { useColorScheme, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import { Provider as StoreProvider } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from "redux-persist/integration/react";
import { PaperProvider } from "react-native-paper";
import { EventProvider } from "react-native-outside-press";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SQLiteProvider } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import Purchases from "react-native-purchases";
import { PortalProvider } from "@gorhom/portal";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { selectUserInfo } from "@store/slices/userSlice";
import lightTheme, { darkTheme } from "@theme";
import { store, persistor } from "@store";
import { dbName, sqliteDb } from "@db";
import migrations from "@db/migrations/migrations";
import { useNavigationTheme } from "@hooks";
import { navigationRef } from "./RootNavigation";

export const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Recipes: "recipes",
      Home: {
        screens: {
          Purchase: {
            path: "subscription-review",
          },
        },
      },
    },
  },
};

const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  useDrizzleStudio(sqliteDb);
  const drizzleDb = drizzle(sqliteDb);
  const { error } = useMigrations(drizzleDb, migrations);

  useEffect(() => {
    if (error) {
      console.error("db error: ", error);
    }
  }, [error]);

  return <>{children}</>;
};

const PostHogIdentify = ({ children }: { children: React.ReactNode }) => {
  const posthog = usePostHog();
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    if (user.id) {
      posthog.identify("distinct_id", {
        $set: {
          id: user.id,
        },
        $set_once: {
          date_of_first_login: user.inceptionDate,
        },
      });
    }
  }, [user.id, posthog]);

  return <>{children}</>;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const restyledTheme = colorScheme === "dark" ? darkTheme : lightTheme;
  const navigationTheme = useNavigationTheme();

  useEffect(() => {
    Purchases.configure({
      apiKey:
        Platform.OS === "android"
          ? "goog_NDrSpVKSsFOPfzlxpFaJUkAhDCt"
          : "appl_ojwoHcZMWhzMUgwCtpuFgwRhHvP",
    });
  }, []);

  return (
    <NavigationContainer
      linking={linking as any}
      theme={navigationTheme}
      ref={navigationRef}
    >
      <SQLiteProvider
        databaseName={dbName}
        options={{ enableChangeListener: true }}
      >
        <DatabaseProvider>
          <GestureHandlerRootView>
            <StoreProvider store={store}>
              <KeyboardProvider>
                <ThemeProvider theme={restyledTheme}>
                  <PaperProvider>
                    <EventProvider>
                      <BottomSheetModalProvider>
                        <PortalProvider>
                          <SafeAreaProvider>
                            <PersistGate loading={null} persistor={persistor}>
                              <PostHogProvider
                                apiKey={Constants.expoConfig?.extra?.posthogKey}
                                options={{
                                  disabled: true,
                                  // process.env.EXPO_PUBLIC_APP_ENV ===
                                  // "development",
                                  // @ts-ignore - PostHog types are outdated
                                  captureScreenViews: true,
                                  captureTaps: true,
                                  captureFormInteractions: true,
                                  captureNetworkRequests: true,
                                  sessionRecording: {
                                    enabled: true,
                                  },
                                }}
                              >
                                <PostHogIdentify>{children}</PostHogIdentify>
                              </PostHogProvider>
                            </PersistGate>
                          </SafeAreaProvider>
                        </PortalProvider>
                      </BottomSheetModalProvider>
                    </EventProvider>
                  </PaperProvider>
                </ThemeProvider>
              </KeyboardProvider>
            </StoreProvider>
          </GestureHandlerRootView>
        </DatabaseProvider>
      </SQLiteProvider>
    </NavigationContainer>
  );
};

export default Providers;
