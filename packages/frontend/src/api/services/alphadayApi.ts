import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TUserAuth } from "src/api/types";
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
        "Lang",
    ],
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers: Headers, { getState }) => {
            // getState() is not typed https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
            // And we cannot cast to RootState from the store. It would create a dependency cycle
            // @ts-expect-error
            const langCode = getState().ui.selectedLanguageCode;
            // @ts-expect-error
            const authState = getState().user.auth as TUserAuth | null;

            headers.set("Version", CONFIG.APP.VERSION);
            headers.set("X-App-Id", CONFIG.APP.X_APP_ID);
            headers.set("X-App-Secret", CONFIG.APP.X_APP_SECRET);
            headers.set("Accept-Language", langCode);
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
