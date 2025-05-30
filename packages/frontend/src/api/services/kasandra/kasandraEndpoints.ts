// import queryString from "query-string";
import { EPredictionCase, TPredictionData } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetPredictionsRequest,
    TGetPredictionsRawResponse,
    TGetPredictionsResponse,
} from "./types";

const { KASANDRA } = CONFIG.API.DEFAULT.ROUTES;

const mapRemotePredictions = (
    r: TGetPredictionsRawResponse
): TGetPredictionsResponse => {
    const result: TGetPredictionsResponse = {} as TGetPredictionsResponse;

    Object.entries(r).forEach(([predictionCase, item]) => {
        result[predictionCase as EPredictionCase] = {
            ...item,
            data: item.data.map(
                ({ price_percent_change, ...rest }) =>
                    ({
                        ...rest,
                        pricePercentChange: price_percent_change,
                    }) as TPredictionData["data"][0]
            ),
        };
    });

    return result;
};

const kasandraApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getPredictions: builder.query<
            TGetPredictionsResponse,
            TGetPredictionsRequest
        >({
            query: (req) => {
                // const params: string = queryString.stringify(req);
                // const route = `${KASANDRA.BASE}${KASANDRA.DEFAULT}?${params}`;
                const route = `${KASANDRA.BASE}${KASANDRA.DEFAULT}${
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
    }),
    overrideExisting: false,
});

export const { useGetPredictionsQuery } = kasandraApi;
