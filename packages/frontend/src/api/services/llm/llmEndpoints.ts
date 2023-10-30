import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import { TGetLlmQnARequest, TGetLlmQnAResponse } from "./types";

const API_CONFIG = CONFIG.API.DEFAULT;
const { LLM } = API_CONFIG.ROUTES;

const llmApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getLlmQnA: builder.query<TGetLlmQnAResponse, TGetLlmQnARequest>({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const path = `${LLM.BASE}${LLM.QNA}?${params}`;
                Logger.debug("getLlmQnA: querying ", path);
                return path;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetLlmQnAQuery } = llmApi;
