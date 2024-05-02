import { combineReducers } from "@reduxjs/toolkit";
import {
    alphadayApi,
    coingeckoApi,
    zapperApi,
    ipApi,
    blobsApi,
} from "../services";
import searchReducer from "./slices/search";
import uiReducer from "./slices/ui";
import userReducer from "./slices/user";
import userFiltersReducer from "./slices/user-filters";
import viewsReducer from "./slices/views";
import widgetsReducer from "./slices/widgets";

export const rootReducer = combineReducers({
    search: searchReducer,
    ui: uiReducer,
    user: userReducer,
    userFilters: userFiltersReducer,
    views: viewsReducer,
    widgets: widgetsReducer,
    [alphadayApi.reducerPath]: alphadayApi.reducer,
    [coingeckoApi.reducerPath]: coingeckoApi.reducer,
    [zapperApi.reducerPath]: zapperApi.reducer,
    [ipApi.reducerPath]: ipApi.reducer,
    [blobsApi.reducerPath]: blobsApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
