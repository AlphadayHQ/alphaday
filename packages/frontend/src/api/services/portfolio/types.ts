import { TPortfolio } from "src/api/types";

export type TResolveEnsRequest = {
    ens: string;
};

export type TResolveEnsResponse = {
    ens: string;
    address: string;
};

export type TGetTokensBalanceForAddressesRequest = {
    addresses: string[];
};

export type TGetTokensBalanceForAddressesResponse = {
    [address: string]: TPortfolio[] | null;
};
