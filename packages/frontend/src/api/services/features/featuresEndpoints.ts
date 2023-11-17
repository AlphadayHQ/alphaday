import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import { TGetFeaturesRequest, TGetFeaturesResponse } from "./types";

const { FEATURES } = CONFIG.API.DEFAULT.ROUTES;

const featuresApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getFeatures: builder.query<TGetFeaturesResponse, TGetFeaturesRequest>({
            query: (req) => {
                const params = queryString.stringify(req ?? {});
                Logger.debug(
                    "querying getFeatures...",
                    `${FEATURES.BASE}${FEATURES.LIST}?${params}`
                );
                return `${FEATURES.BASE}${FEATURES.LIST}?${params}`;
            },
            providesTags: ["Account"], // refetch if a user account is updated
        }),
    }),
    overrideExisting: false,
});

export const { useGetFeaturesQuery } = featuresApi;
