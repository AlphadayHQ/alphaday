import queryString from "query-string";
import { TDeveloperActivitySnapshot } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetDeveloperActivityRequest,
    TGetDeveloperActivityRawResponse,
    TGetDeveloperActivityResponse,
} from "./types";

const { COINS } = CONFIG.API.DEFAULT.ROUTES;

const developerActivityApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getDeveloperActivity: builder.query<
            TGetDeveloperActivityResponse,
            TGetDeveloperActivityRequest
        >({
            query: ({ coin, limit }) => {
                const params = queryString.stringify(
                    { limit },
                    { skipNull: true, skipEmptyString: true }
                );
                const path = `${String(COINS.BASE)}${String(
                    COINS.DEVELOPER_ACTIVITY(coin)
                )}${params ? `?${params}` : ""}`;
                Logger.debug("getDeveloperActivity: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetDeveloperActivityRawResponse
            ): TGetDeveloperActivityResponse => {
                try {
                    const snapshots: TDeveloperActivitySnapshot[] = r
                        .map((s) => ({
                            id: s.id,
                            coin: s.coin,
                            commitsLast4Weeks: s.commits_last_4_weeks,
                            contributorsCount: s.contributors_count,
                            openIssues: s.open_issues,
                            stars: s.stars,
                            forks: s.forks,
                            date: s.date,
                        }))
                        // The endpoint returns snapshots newest-first; sort
                        // oldest-first so the data is ready to plot on a time
                        // axis and the latest snapshot is the last element.
                        .sort(
                            (a, b) =>
                                new Date(a.date).getTime() -
                                new Date(b.date).getTime()
                        );
                    return { snapshots };
                } catch (error) {
                    Logger.error(
                        "getDeveloperActivity::transformResponse: error while parsing response:",
                        error
                    );
                    return { snapshots: [] };
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetDeveloperActivityQuery } = developerActivityApi;
