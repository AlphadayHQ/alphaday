import { TPagination } from "../baseTypes";

export type TGetKeyValueRequest = {
    key: string;
};

export type TGetKeyValueRawResponse = {
    key: string;
    value: string;
    created: string; // iso string
    modified: string; // iso string
};

export type TGetMultiKeyValueRequest = {
    keys: string[];
    page?: number;
    limit?: number;
};

export type TGetMultiKeyValueRawResponse = TPagination & {
    results: TGetKeyValueRawResponse[];
};

export type TGetKeyValueResponse = TGetKeyValueRawResponse;
export type TGetMultiKeyValueResponse = TGetMultiKeyValueRawResponse;

export type TGetEthereumLastBlockRequest = void;
export type TGetEthereumLastBlockResponse = TGetKeyValueRawResponse;
