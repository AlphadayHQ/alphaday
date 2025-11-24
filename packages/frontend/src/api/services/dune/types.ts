import { TCustomItem } from "src/api/types";
import { TPagination } from "../baseTypes";
import { TRemoteCustomMeta } from "../views/types";

export type TImportDuneRequest = {
    query_id: string;
    cached?: boolean;
    widget_name?: string;
    dataset_id?: number;
    name?: string;
    source_slug?: string;
    parameters?: Record<string, unknown> | Array<Record<string, unknown>>;
    execute?: boolean;
};

export type TImportDuneResponse = {
    id: number;
    data: TCustomItem[];
    meta: TRemoteCustomMeta;
};

export type TGetDatasetByIdRequest = {
    id: number;
};

export type TGetDatasetByIdResponse = TPagination & {
    results: TCustomItem[];
};
