import queryString from "query-string";
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
                const path = `${String(TVL.BASE)}${String(
                    TVL.FEES_TOP
                )}?${params}`;
                Logger.debug("getTvlFees: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetTvlFeesRawResponse,
                _meta,
                _arg
            ): TGetTvlFeesResponse => {
                try {
                    const { config, data } = r.protocols;
                    const items = data
                        .filter(
                            (item, index, self) =>
                                self.findIndex(
                                    (innerItem) => innerItem.id === item.id
                                ) === index
                        )
                        .sort((a, b) => b.value - a.value);
                    return { config, items };
                } catch (error) {
                    Logger.error(
                        "getTvlFees::transformResponse: error while parsing response:",
                        error
                    );
                    return {
                        config: {
                            timeframe: "24h",
                            metric: "revenue",
                            mode: "absolute",
                            attribution: "",
                        },
                        items: [],
                    };
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetTvlFeesQuery } = feesApi;
