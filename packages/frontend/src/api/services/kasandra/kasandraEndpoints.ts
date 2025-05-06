import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TRemotePredictionCoin,
    TGetPredictionsRequest,
    TGetPredictionsRawResponse,
    TGetPredictionsResponse,
} from "./types";

const { KASANDRA } = CONFIG.API.DEFAULT.ROUTES;

const mapRemotePredictionCoin = (coin: TRemotePredictionCoin) => {
    return {
        ...coin,
        project: {
            ...coin.project,
            projectType: coin.project.project_type,
            networkId: coin.project.network_id,
        },
        geckoId: coin.gecko_id,
    };
};

const kasandraApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getPredictions: builder.query<
            TGetPredictionsResponse,
            TGetPredictionsRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify(req);
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                const route = `${KASANDRA.BASE}${KASANDRA.DEFAULT}?${params}`;
                Logger.debug("querying", route);
                return route;
            },
            transformResponse: (
                r: TGetPredictionsRawResponse
            ): TGetPredictionsResponse => {
                return r.results.map((item) => ({
                    id: item.id,
                    coin: mapRemotePredictionCoin(item.coin),
                }));
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetPredictionsQuery } = kasandraApi;
