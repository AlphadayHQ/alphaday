import queryString from "query-string";
import {
    THistoryInsightItem,
    TInsightItem,
    TPastPrediction,
} from "src/api/types";
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
    TGetFlakeOffDataResponse,
    TGetFlakeOffDataRequest,
    TGetFlakeOffDataRawResponse,
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
    const predictions: TInsightItem[] = [];
    const history: THistoryInsightItem[] = [];
    r.results.forEach((i) => {
        const insight = {
            id: i.id,
            coin: {
                ...i.coin,
                icon: i.coin.icon || "",
            },
            timestamp: i.timestamp,
            case: i.case,
            title: i.title,
            rationale: i.rationale,
            price: i.price,
            // sources: i.sources,
        };
        if (i.type === "history") history.push({ ...insight, type: "history" });
        if (i.type === "prediction") {
            predictions.push({ ...insight, type: "prediction" });
        }
    });
    return { predictions, history };
};

const mapRemoteFlakeOffData = (
    r: TGetFlakeOffDataRawResponse
): TGetFlakeOffDataResponse => {
    const data = r.data.reduce(
        (acc, c) => ({
            id: c.id,
            coin: c.coin,
            timestamp: c.generation_timestamp,
            data: [
                ...acc.data,
                ...c.chart_data.past_predictions.map((p) => ({
                    id: p.id,
                    case: p.case,
                    chartData: p.chart_data,
                    createdAt: p.created_at,
                    accuracyScore: p.accuracy_score,
                })),
            ],
        }),
        {
            id: 0,
            coin: r.data[0].coin,
            timestamp: r.data[0].generation_timestamp,
            data: [] as TPastPrediction[],
        }
    );
    return data;
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
        getFlakeOffData: builder.query<
            TGetFlakeOffDataResponse,
            TGetFlakeOffDataRequest
        >({
            query: (req) => {
                const route = `${KASANDRA.BASE}${KASANDRA.FLAKE_OFF}?${queryString.stringify(req)}`;
                Logger.debug("querying", route);
                return route;
            },
            transformResponse: (
                r: TGetFlakeOffDataRawResponse
            ): TGetFlakeOffDataResponse => {
                return mapRemoteFlakeOffData(r);
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPredictionsQuery,
    useGetInsightsQuery,
    useGetFlakeOffDataQuery,
} = kasandraApi;
