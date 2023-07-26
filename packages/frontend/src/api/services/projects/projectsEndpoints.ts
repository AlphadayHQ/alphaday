import queryString from "query-string";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetProjectsRequest,
    TGetProjectsResponse,
    TGetProjectByIdRequest,
    TGetProjectByIdResponse,
    TGetTrendingItemsRawResponse,
    TGetTrendingItemsRequest,
} from "./types";

const { PROJECTS } = CONFIG.API.DEFAULT.ROUTES;

const projectsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<TGetProjectsResponse, TGetProjectsRequest>({
            query: () => `${PROJECTS.BASE}${PROJECTS.LIST}`,
        }),
        getProjectById: builder.query<
            TGetProjectByIdResponse,
            TGetProjectByIdRequest
        >({
            query: ({ id }) => `${PROJECTS.BASE}${PROJECTS.BY_ID(id)}`,
        }),
        getTrendingNfts: builder.query<
            TGetTrendingItemsRawResponse,
            TGetTrendingItemsRequest
        >({
            query: (req) => {
                const params: string = queryString.stringify(req, {
                    arrayFormat: "comma",
                });
                return `${PROJECTS.BASE}${PROJECTS.TRENDING_NFTS}?${params}`;
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useGetTrendingNftsQuery,
} = projectsApi;
