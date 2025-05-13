import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetPredictionsRequest,
    TGetPredictionsRawResponse,
    TGetPredictionsResponse,
} from "./types";

const { KASANDRA } = CONFIG.API.DEFAULT.ROUTES;

const kasandraApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getPredictions: builder.query<
            TGetPredictionsResponse,
            TGetPredictionsRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const route = `${KASANDRA.BASE}${KASANDRA.DEFAULT}?${params}`;
                Logger.debug("querying", route);
                return route;
            },
            transformResponse: (
                r: TGetPredictionsRawResponse
            ): TGetPredictionsResponse => {
                return r.results.map((item) => ({
                    id: item.id,
                    coin: item.coin,
                    price: item.price,
                    insight: item.insight,
                    case: item.case,
                    targetDate: item.target_date,
                    pricePercentChange: item.price_percent_change,
                    created: item.created,
                }));
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetPredictionsQuery } = kasandraApi;
