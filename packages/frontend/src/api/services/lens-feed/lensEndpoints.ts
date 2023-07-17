import queryString from "query-string";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import { TGetLensRequest, TGetLensResponse } from "./types";

const { SOCIALS } = CONFIG.API.DEFAULT.ROUTES;

const lensApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getLensItems: builder.query<TGetLensResponse, TGetLensRequest>({
            query: (req) => {
                const params: string = queryString.stringify({
                    tags: req.tags,
                    page: req.page,
                    social_network: SOCIALS.LENS,
                });
                const path = `${String(SOCIALS.BASE)}?${params}`;
                Logger.debug("getLensItems: querying", path);
                return path;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useGetLensItemsQuery } = lensApi;
