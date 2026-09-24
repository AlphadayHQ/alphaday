import queryString from "query-string";
import CONFIG from "../../../config";
import { alphadayApi } from "../alphadayApi";
import {
    TResolveEnsRequest,
    TResolveEnsResponse,
    TGetTokensBalanceForAddressesResponse,
    TGetTokensBalanceForAddressesRequest,
    TGetNftBalancesResponse,
    TGetNftBalancesRequest,
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
        getNftBalances: builder.query<
            TGetNftBalancesResponse,
            TGetNftBalancesRequest
        >({
            query: ({ addresses }) => {
                const params = queryString.stringify({
                    addresses: addresses.join(","),
                });
                return `${PORTFOLIO.BASE}${PORTFOLIO.NFTS}?${params}`;
            },
        }),
    }),
});

export const {
    useResolveEnsQuery,
    useGetBalancesQuery,
    useGetNftBalancesQuery,
} = portfolioApi;
