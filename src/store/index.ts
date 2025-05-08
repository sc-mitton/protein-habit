import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

import foodsReducer from "./slices/foodsSlice";
import userReducer from "./slices/userSlice";
import proteinReducer from "./slices/proteinSlice";
import uiReducer from "./slices/uiSlice";
import bookmarksReducer from "./slices/bookmarksSlice";
import apiSlice from "./slices/apiSlice";
import entitlementReducer from "./slices/entitlementSlice";

const migrations = {
  37: (state: RootState) => {
    return {
      ...state,
      bookmarks: {
        categories: [
          {
            id: "favorites",
            name: "Favorites",
            recipeIds: [],
          },
        ],
      },
    };
  },
  38: (state: RootState) => {
    return {
      ...state,
      user: { ...state.user, entitlement: "" },
    };
  },
  39: (state: RootState) => {
    return {
      ...state,
      user: { ...state.user, entitlement: "" },
    };
  },
} as any;

const persistConfig = {
  key: "root",
  version: 39,
  storage: AsyncStorage,
  migrate: createMigrate(migrations),
  blacklist: [],
};

const rootReducer = combineReducers({
  user: userReducer,
  protein: proteinReducer,
  ui: uiReducer,
  foods: foodsReducer,
  bookmarks: bookmarksReducer,
  entitlement: entitlementReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware),
  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
