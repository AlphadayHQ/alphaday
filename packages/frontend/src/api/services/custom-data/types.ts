import { TCustomItem } from "src/api/types";
import { TPagination } from "../baseTypes";

export type TGetCustomItemsRequest = {
    page?: number;
    tags?: string;
    endpointUrl: string;
};

export type TGetCustomItemsResponse = TPagination & {
    results: TCustomItem[];
};
