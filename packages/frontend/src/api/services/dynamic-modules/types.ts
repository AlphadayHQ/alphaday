// TODO: remove
import { TDynamicItem } from "src/api/types";
import { TPagination } from "../baseTypes";

export type TGetDynamicItemsRequest = {
    page?: number;
    tags?: string;
    endpointUrl: string;
};

export type TGetDynamicItemsResponse<T = unknown> = TPagination & {
    results: TDynamicItem<T>[];
};
