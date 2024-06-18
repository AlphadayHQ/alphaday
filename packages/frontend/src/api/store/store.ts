import { configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    createMigrate,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { setupListeners } from '@reduxjs/toolkit/query'
import CONFIG from "src/config";
import {
    alphadayApi,
    coingeckoApi,
    zapperApi,
    ipApi,
    blobsApi,
} from "../services";
import migrations from "./migrations";
import { rootReducer, RootState as ReducerState } from "./reducer";

const persistConfig = {
    key: CONFIG.APP.STORAGE_KEY,
    version: CONFIG.APP.STORAGE_VERSION,
    storage,
    migrate: createMigrate(migrations, { debug: true }),
    blacklist: [
        alphadayApi.reducerPath,
        coingeckoApi.reducerPath,
        zapperApi.reducerPath,
        ipApi.reducerPath,
        blobsApi.reducerPath,
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// we can remove persistor using previous config:
// export const store = configureStore({
//     reducer: rootReducer,
// });

// Adding the api middleware enables caching, invalidation, polling,
// and other useful features of `rtk-query`.
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        })
            .concat(alphadayApi.middleware)
            .concat(coingeckoApi.middleware)
            .concat(zapperApi.middleware)
            .concat(ipApi.middleware)
            .concat(blobsApi.middleware),
});

export const persistor = persistStore(store);

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch)

// Infer the `AppDispatch` types from the store itself
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type RootState = ReducerState;
