import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import { initialState as proteinInitialState } from "./slices/proteinSlice";

import foodsReducer from "./slices/foodsSlice";
import userReducer from "./slices/userSlice";
import proteinReducer from "./slices/proteinSlice";
import uiReducer from "./slices/uiSlice";

const migrations = {
  15: (state: RootState) => {
    return {
      ...state,
      protein: {
        ...state.protein,
        dailyTargets: proteinInitialState.dailyTargets,
        entries: proteinInitialState.entries,
      },
    };
  },
} as any;

const persistConfig = {
  key: "root",
  version: 15,
  storage: AsyncStorage,
  migrate: createMigrate(migrations),
  blacklist: [],
};

const rootReducer = combineReducers({
  user: userReducer,
  protein: proteinReducer,
  ui: uiReducer,
  foods: foodsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers.concat(devToolsEnhancer()),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
