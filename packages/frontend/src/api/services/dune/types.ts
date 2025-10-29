import { TCustomItem } from "src/api/types";
import { TPagination } from "../baseTypes";

export type TImportDuneRequest = {
    query_id: string;
    cached?: boolean;
};

export type TImportDuneResponse = TPagination & {
    results: TCustomItem[];
};

export type TGetDatasetByIdRequest = {
    id: number;
};

export type TGetDatasetByIdResponse = TPagination & {
    results: TCustomItem[];
};
