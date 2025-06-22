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
    return r as TGetPredictionsResponse;
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
