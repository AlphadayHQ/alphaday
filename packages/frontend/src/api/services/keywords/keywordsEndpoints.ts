import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetKeywordsRequest,
    TGetKeywordsResponse,
    TGetKeywordByIdRequest,
    TGetKeywordByIdResponse,
    TUpdateKeywordFreqRequest,
    TUpdateKeywordFreqResponse,
    TGetTrendingKeywordsResponse,
    TGetTrendingKeywordsRequest,
    TGetTrendingKeywordsRawResponse,
} from "./types";

const API_CONFIG = CONFIG.API.DEFAULT;
const { KEYWORDS } = API_CONFIG.ROUTES;
const { QUERY_KEYWORDS_HARD_LIMIT } = CONFIG.UI;

const keywordsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getKeywordsList: builder.query<
            TGetKeywordsResponse,
            TGetKeywordsRequest
        >({
            query: (req) => {
                const reqMod = {
                    ...req,
                    limit: QUERY_KEYWORDS_HARD_LIMIT,
                };
                const params: string = queryString.stringify(reqMod);
                const path = `${KEYWORDS.BASE}${KEYWORDS.LIST}?${params}`;
                Logger.debug("getKeywordsList: querying...", path);
                return path;
            },
        }),
        getTrendingKeywordsList: builder.query<
            TGetTrendingKeywordsResponse,
            TGetTrendingKeywordsRequest
        >({
            query: () => {
                const params: string = queryString.stringify({
                    limit: QUERY_KEYWORDS_HARD_LIMIT,
                });
                const path = `${KEYWORDS.BASE}${KEYWORDS.TRENDING}?${params}`;
                Logger.debug("getTrendingKeywordsList: querying...", path);
                return path;
            },
            transformResponse: ({
                results,
                ...rest
            }: TGetTrendingKeywordsRawResponse): TGetTrendingKeywordsResponse => ({
                results: results?.map((item) => item.keyword),
                ...rest,
            }),
        }),
        getKeywordById: builder.query<
            TGetKeywordByIdResponse,
            TGetKeywordByIdRequest
        >({
            query: ({ id }) => `${KEYWORDS.BASE}${KEYWORDS.BY_ID(id)}`,
        }),
        updateKeywordFreq: builder.mutation<
            TUpdateKeywordFreqResponse,
            TUpdateKeywordFreqRequest
        >({
            query: (request) => ({
                url: `${KEYWORDS.BASE}${KEYWORDS.FREQUENCY}`,
                method: "POST",
                body: request,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetTrendingKeywordsListQuery,
    useGetKeywordsListQuery,
    useGetKeywordByIdQuery,
    useUpdateKeywordFreqMutation,
} = keywordsApi;
