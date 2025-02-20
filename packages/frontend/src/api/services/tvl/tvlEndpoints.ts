import moment from "moment-with-locales-es6";
import queryString from "query-string";
import { TProjectTvlHistory, TTvlHistory } from "src/api/types";
import { isEmptyObj } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TRemoteTvlHistory,
    TRemoteProjectTvlHistoryRead,
    TGetTvlRequest,
    TGetTvlRawResponse,
    TGetTvlResponse,
} from "./types";

const { TVL } = CONFIG.API.DEFAULT.ROUTES;

const mapTvlHistoryData = (history: TRemoteTvlHistory): TTvlHistory | void => {
    try {
        if (isEmptyObj(history)) return undefined;
        return history.map((h) => ({
            date: moment.unix(h.date).toString(),
            tvlUsd: h.totalLiquidityUSD,
        }));
    } catch (e) {
        Logger.error(
            "tvlEndpoint::getTvlHistory: could not parse history data",
            history
        );
        throw e;
    }
};

const mapTvlHistoryResponse = (
    data: TRemoteProjectTvlHistoryRead | undefined
): TProjectTvlHistory | undefined => {
    if (data === undefined) return undefined;
    return {
        id: data.id,
        project: {
            name: data.project.name,
            slug: data.project.slug,
            networkId: data.project.network_id,
            url: data.project.url,
            projectType: data.project.project_type,
        },
        interval: data.interval,
        currency: data.currency,
        history: mapTvlHistoryData(data.history),
        requestedAt: data.requested_at,
    };
};

const tvlApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getTvl: builder.query<TGetTvlResponse, TGetTvlRequest>({
            query: (req) => {
                const params: string = queryString.stringify({
                    ...req,
                    limit: 30, // for now
                });
                const path = `${String(TVL.BASE)}${String(
                    TVL.DEFAULT
                )}?${params}`;
                Logger.debug("getTvl: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetTvlRawResponse,
                _meta,
                _arg
            ): TGetTvlResponse => {
                try {
                    const facadeData = r.results
                        .filter(
                            (item, index, self) =>
                                self.findIndex(
                                    (innerItem) => innerItem.id === item.id
                                ) === index
                        )
                        .map((data) => {
                            return {
                                id: data.id,
                                project: {
                                    name: data.project.name,
                                    slug: data.project.slug,
                                    projectType: data.project.project_type,
                                    networkId: data.project.network_id,
                                    icon: data.project.icon,
                                    url: data.project.url,
                                },
                                tvlHistories: mapTvlHistoryResponse(
                                    data.tvl_histories[0]
                                ),
                                currency: data.currency,
                                tvl: data.tvl,
                                percentChange1h: data.tvl_percent_change_1h,
                                percentChange1d: data.tvl_percent_change_1d,
                                percentChange7d: data.tvl_percent_change_7d,
                                date: data.date,
                            };
                        });
                    return {
                        ...r,
                        results: facadeData.sort((a, b) => b.tvl - a.tvl),
                    };
                } catch (error) {
                    Logger.error(
                        "getTvl::transformResponse: error while parsing response:",
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

export const { useGetTvlQuery } = tvlApi;
