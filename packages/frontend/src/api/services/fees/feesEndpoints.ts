import queryString from "query-string";
import { TFeesItem } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetTvlFeesRequest,
    TGetTvlFeesRawResponse,
    TGetTvlFeesResponse,
} from "./types";

const { TVL } = CONFIG.API.DEFAULT.ROUTES;

const feesApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getTvlFees: builder.query<TGetTvlFeesResponse, TGetTvlFeesRequest>({
            query: (req) => {
                const params: string = queryString.stringify({ ...req });
                const path = `${String(TVL.BASE)}${String(TVL.FEES)}?${params}`;
                Logger.debug("getTvlFees: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetTvlFeesRawResponse,
                _meta,
                arg
            ): TGetTvlFeesResponse => {
                try {
                    // Each protocol carries every metric/timeframe combination
                    // (eg. `revenue_24h`, `total_7d`), so we pick the field that
                    // matches the requested view.
                    const metric = arg.metric ?? "revenue";
                    const timeframe = arg.timeframe ?? "24h";
                    const valueKey = `${metric}_${timeframe}` as const;
                    const items: TFeesItem[] = r.results
                        .map((result) => ({
                            id: result.id,
                            name: result.project.name,
                            icon: result.project.icon,
                            value: result[valueKey],
                        }))
                        // NOTE: the backend currently orders results by
                        // `total_24h` regardless of `metric`, so this only sorts
                        // the fetched page by the selected metric. A correct
                        // ranking requires the backend to order by `metric`.
                        .sort((a, b) => b.value - a.value);
                    return { items };
                } catch (error) {
                    Logger.error(
                        "getTvlFees::transformResponse: error while parsing response:",
                        error
                    );
                    return {
                        items: [],
                    };
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetTvlFeesQuery } = feesApi;
