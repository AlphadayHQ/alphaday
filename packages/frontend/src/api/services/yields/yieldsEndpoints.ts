import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetYieldsRequest,
    TGetYieldsRawResponse,
    TGetYieldsResponse,
} from "./types";

const { YIELDS } = CONFIG.API.DEFAULT.ROUTES;

const yieldsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getYields: builder.query<TGetYieldsResponse, TGetYieldsRequest>({
            query: (req) => {
                const params: string = queryString.stringify({
                    ...req,
                    limit: req.limit ?? 30,
                });
                const path = `${String(YIELDS.BASE)}${String(
                    YIELDS.DEFAULT
                )}?${params}`;
                Logger.debug("getYields: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetYieldsRawResponse,
                _meta,
                _arg
            ): TGetYieldsResponse => {
                try {
                    // The backend already returns pools ordered by tvl_usd
                    // descending, so we preserve that order here — a client-side
                    // re-sort would only apply per-page and break the global
                    // ordering once pages are appended.
                    const facadeData = r.results
                        .filter(
                            (item, index, self) =>
                                self.findIndex(
                                    (innerItem) => innerItem.id === item.id
                                ) === index
                        )
                        .map((data) => ({
                            id: data.id,
                            poolId: data.pool_id,
                            project: data.project,
                            chain: data.chain,
                            symbol: data.symbol,
                            apy: data.apy,
                            apyBase: data.apy_base,
                            apyReward: data.apy_reward,
                            tvlUsd: data.tvl_usd,
                            ilRisk: data.il_risk,
                            date: data.date,
                        }));
                    return {
                        ...r,
                        results: facadeData,
                    };
                } catch (error) {
                    Logger.error(
                        "getYields::transformResponse: error while parsing response:",
                        error
                    );
                    return {
                        ...r,
                        results: [],
                    };
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetYieldsQuery } = yieldsApi;
