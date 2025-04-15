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
import { SQLiteProvider } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import React, { useEffect } from "react";

import lightTheme, { darkTheme } from "@theme";
import { store, persistor } from "@store";
import { dbName, sqliteDb } from "@db";
import migrations from "@db/migrations/migrations";

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

const Providers = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const restyledTheme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <SQLiteProvider
      databaseName={dbName}
      options={{ enableChangeListener: true }}
    >
      <Provider store={store}>
        <KeyboardProvider>
          <ThemeProvider theme={restyledTheme}>
            <PaperProvider>
              <EventProvider>
                <BottomSheetModalProvider>
                  <SafeAreaProvider>
                    <GestureHandlerRootView>
                      <PersistGate loading={null} persistor={persistor}>
                        <DatabaseProvider>{children}</DatabaseProvider>
                      </PersistGate>
                    </GestureHandlerRootView>
                  </SafeAreaProvider>
                </BottomSheetModalProvider>
              </EventProvider>
            </PaperProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </Provider>
    </SQLiteProvider>
  );
};

export default Providers;
