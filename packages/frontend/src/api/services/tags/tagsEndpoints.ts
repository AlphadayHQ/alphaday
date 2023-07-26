import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetTagsRequest,
    TGetTagsResponse,
    TGetTagsRawResponse,
    TGetTagByIdRequest,
    TGetTagByIdResponse,
} from "./types";

const { TAGS } = CONFIG.API.DEFAULT.ROUTES;

const tagsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getTagsList: builder.query<TGetTagsResponse, TGetTagsRequest>({
            query: (req) => {
                const params: string = queryString.stringify({
                    ...req,
                    limit: 30, // for now
                });
                const path = `${TAGS.BASE}${TAGS.LIST}?${params}`;
                Logger.debug("getTagsList: querying", path);
                return path;
            },
            transformResponse: (r: TGetTagsRawResponse, _meta, _arg) => {
                return {
                    ...r,
                    results: r.results
                        .filter((e, index, self) => self.indexOf(e) === index)
                        .map((rawTag) => ({
                            id: rawTag.id,
                            name: rawTag.name,
                            slug: rawTag.slug,
                            tagType: rawTag.tag_type,
                        })),
                };
            },
        }),
        getTagById: builder.query<TGetTagByIdResponse, TGetTagByIdRequest>({
            query: ({ id }) => `${TAGS.BASE}${TAGS.BY_ID(id)}`,
        }),
    }),
    overrideExisting: false,
});

export const { useGetTagsListQuery, useGetTagByIdQuery } = tagsApi;
