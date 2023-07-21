import queryString from "query-string";
import CONFIG from "../../../config";
import { alphadayApi } from "../alphadayApi";
import {
    TResolveEnsRequest,
    TResolveEnsResponse,
    TGetTokensBalanceForAddressesResponse,
    TGetTokensBalanceForAddressesRequest,
} from "./types";

const { PORTFOLIO } = CONFIG.API.DEFAULT.ROUTES;

const portfolioApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        resolveEns: builder.query<TResolveEnsResponse, TResolveEnsRequest>({
            query: ({ ens }) => PORTFOLIO.RESOLVE_ENS(ens),
        }),
        getBalances: builder.query<
            TGetTokensBalanceForAddressesResponse,
            TGetTokensBalanceForAddressesRequest
        >({
            query: ({ addresses }) => {
                const params = queryString.stringify({
                    addresses: addresses.join(","),
                });
                return `${PORTFOLIO.BASE}${PORTFOLIO.BALANCES}?${params}`;
            },
        }),
    }),
});

export const { useResolveEnsQuery, useGetBalancesQuery } = portfolioApi;
