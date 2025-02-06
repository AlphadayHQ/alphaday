import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import i18next from "i18next";
import { TUserAuth } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../config/config";

const { API_BASE_URL } = CONFIG.API.DEFAULT;

export const alphadayApi = createApi({
    reducerPath: "alphadayApi",
    tagTypes: [
        "Views",
        "SubscribedViews",
        "CurrentView",
        "Account", // verified account
        "AccountPortfolio", // account portfolio
        "PinnedCoins",
        "Superfeed",
    ],
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers: Headers, { getState }) => {
            const langCode =
                // @ts-expect-error
                getState().ui.selectedLanguageCode || i18next.language;

            headers.set("Version", CONFIG.APP.VERSION);
            headers.set("X-App-Id", CONFIG.APP.X_APP_ID);
            headers.set("X-App-Secret", CONFIG.APP.X_APP_SECRET);
            headers.set("Accept-Language", langCode);
            // @ts-expect-error
            const authState = getState().user.auth as TUserAuth | null;
            if (authState != null && authState?.token !== undefined) {
                const token = authState.token.value;
                if (token != null) {
                    // eslint-disable-next-line
                    headers.set("Authorization", `Token ${token}`);
                } else {
                    Logger.debug(
                        "alphadayApi::prepareHeaders: no session token"
                    );
                }
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
});
