import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import type {
    TImportDuneRequest,
    TImportDuneResponse,
    TGetDatasetByIdRequest,
    TGetDatasetByIdResponse,
} from "./types";

const { DATASETS } = CONFIG.API.DEFAULT.ROUTES;

export const duneApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        importDune: builder.mutation<TImportDuneResponse, TImportDuneRequest>({
            query: (req) => {
                const path = `${DATASETS.BASE}${DATASETS.IMPORT_DUNE}`;
                Logger.debug("importDune: body", JSON.stringify(req));
                return {
                    url: path,
                    body: req,
                    method: "POST",
                };
            },
        }),
        getDatasetById: builder.query<
            TGetDatasetByIdResponse,
            TGetDatasetByIdRequest
        >({
            query: (req) => {
                const path = `${DATASETS.BASE}${DATASETS.BY_ID(req.id)}`;
                Logger.debug("getDatasetById: querying", path);
                return path;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useImportDuneMutation, useGetDatasetByIdQuery } = duneApi;
