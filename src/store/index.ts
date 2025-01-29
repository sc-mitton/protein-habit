import { configureStore, combineReducers } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'
import userReducer from './slices/userSlice'
import proteinReducer from './slices/proteinSlice'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user', 'protein'], // what to persist
}

const rootReducer = combineReducers({
    user: userReducer,
    protein: proteinReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
