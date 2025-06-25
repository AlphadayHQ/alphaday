import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetPredictionsRequest,
    TGetPredictionsRawResponse,
    TGetPredictionsResponse,
    TGetInsightsResponse,
    TGetInsightsRequest,
    TGetInsightsRawResponse,
} from "./types";

const { KASANDRA } = CONFIG.API.DEFAULT.ROUTES;

const mapRemotePredictions = (
    r: TGetPredictionsRawResponse
): TGetPredictionsResponse => {
    return r as TGetPredictionsResponse;
};

const mapRemoteInsights = (
    r: TGetInsightsRawResponse
): TGetInsightsResponse => {
    const results = r.results.map((i) => ({
        id: i.id,
        coin: {
            ...i.coin,
            icon: i.coin.icon || "",
        },
        timestamp: i.timestamp,
        case: i.case,
        title: i.title,
        rationale: i.rationale,
        pricePercentChange: i.price_percent_change,
        sources: i.sources,
    }));
    return results;
};

const kasandraApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getPredictions: builder.query<
            TGetPredictionsResponse,
            TGetPredictionsRequest
        >({
            query: (req) => {
                const route = `${KASANDRA.BASE}${KASANDRA.PREDICTIONS}${
                    req.coin
                }/${String(req.interval)}`;
                Logger.debug("querying", route);
                return route;
            },
            transformResponse: (
                r: TGetPredictionsRawResponse
            ): TGetPredictionsResponse => {
                return mapRemotePredictions(r);
            },
        }),
        getInsights: builder.query<TGetInsightsResponse, TGetInsightsRequest>({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const route = `${KASANDRA.BASE}${KASANDRA.INSIGHTS}?${params}`;
                Logger.debug("querying", route);
                return route;
            },
            transformResponse: (
                r: TGetInsightsRawResponse
            ): TGetInsightsResponse => {
                return mapRemoteInsights(r);
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetPredictionsQuery, useGetInsightsQuery } = kasandraApi;
