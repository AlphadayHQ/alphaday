import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";
import { TGasPrices } from "src/api/types";
import { getErrorMessage } from "src/api/utils/errorHandling";
import { Logger } from "src/api/utils/logging";
import { SUPPORTED_EVM_NETWORKS } from "src/config/thirdparty";
import CONFIG from "../../config/config";

const { API_BASE_URL, ROUTES, API_KEY } = CONFIG.API_PROVIDERS.ZAPPER;
const { API_BASE_URL: API_BASE_URL_V2, ROUTES: ROUTES_V2 } =
    CONFIG.API_PROVIDERS.ZAPPER_V2;

/**
 * primitive types
 */

export type TZapperContext = {
    symbol: string; // "ETH"
    balance: number;
    decimals: number; // 18
    balanceRaw: string;
    price: number; // asset price
};

export type TZapperDisplayProps = {
    label: string; // "ETH"
    images: string[];
};

export type TZapperAsset = {
    address: string; // "0x..." token address
    appId: "tokens"; // "tokens"
    balanceUSD: number;
    breakdown: [];
    context: TZapperContext;
    contractType: string; // "app-token"
    displayProps: TZapperDisplayProps;
    key: string; // "1949410626"
    metaType: string; // "supplied"
    network: string; // "ethereum"
    type: string; // "token"
};

type TMedia =
    | {
          type: "image";
          originalUrl: "string"; // e.g ipfs://Qma3dgNvmqabeVchAfG95KyESXCDojo4b1Fc8U5xiZ89hf
      }
    | {
          type: "audio";
          original: "string";
      };

export type TZapperNftAsset = {
    balance: string; // number in string format
    token: {
        name: string;
        tokenId: string; // number in string format
        lastSaleEth: number | null; // maybe number or null
        rarityRank: number | null; // maybe number or null
        estimatedValueEth: string | null; // number in string format
        medias: TMedia[]; // array of media files
        collection: {
            address?: string | null;
            name?: string;
            nftStandard?: string; // e.g erc721
            floorPriceEth?: string; // number in string format
            logoImageUrl?: string | null;
            openseaId?: string | null;
        };
    };
};

/**
 * query types
 */

type TGetTokensBalanceForAddressesRequest = {
    addresses: string[];
};

type TGetNftBalanceForAddressesRequest = TGetTokensBalanceForAddressesRequest;

export type TTokensBalanceForAddress = {
    assets: TZapperAsset[];
    totalValue: number;
};

export type TNftBalanceForAddress = {
    items: TZapperNftAsset[];
    totalValue: number;
};

export type TNftBalanceForAddressesResponse = TNftBalanceForAddress;

export type TTokensBalanceForAddressesResponse = Record<
    string,
    TTokensBalanceForAddress
>;

export type TGetGasPriceRequest = void;

export type TGetGasPriceRawResponse = {
    eip1559: boolean;
    standard: {
        baseFeePerGas: number;
        maxPriorityFeePerGas: number;
        maxFeePerGas: number;
    };
    fast: {
        baseFeePerGas: number;
        maxPriorityFeePerGas: number;
        maxFeePerGas: number;
    };
    instant: {
        baseFeePerGas: number;
        maxPriorityFeePerGas: number;
        maxFeePerGas: number;
    };
};

export type TGetGasPriceResponse = TGasPrices;

export const computeAssetTotal: (a: TZapperAsset[]) => number = (a) => {
    const total: number = a.reduce((prev, cur) => prev + cur.balanceUSD, 0);
    return total;
};

export const computeNftAssetTotal: (a: TZapperNftAsset[]) => number = (a) => {
    const total: number = a.reduce(
        (prev, cur) => parseFloat(cur.token.estimatedValueEth ?? "0") + prev,
        0
    );
    return total;
};

export const zapperApi = createApi({
    reducerPath: "zapperApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    keepUnusedDataFor: 5 * 60,
    endpoints: (builder) => ({
        /**
         * @deprecated use alphadayApi.portfolio.getBalances instead
         */
        getTokensBalanceForAddresses: builder.query<
            TTokensBalanceForAddressesResponse,
            TGetTokensBalanceForAddressesRequest
        >({
            queryFn: async ({ addresses }) => {
                const data = {} as TTokensBalanceForAddressesResponse;
                let error;

                if (addresses == null)
                    throw new Error(
                        "zapperApi::getTokensBalance: selectedAddress is null"
                    );
                const params: string = queryString.stringify({
                    "addresses[]": addresses,
                    "networks[]": Object.keys(SUPPORTED_EVM_NETWORKS),
                    bundled: false,
                    api_key: API_KEY,
                });

                if (ROUTES_V2?.TOKEN_BALANCES == null) {
                    throw new Error(
                        "zapperApi::getTokensBalance: invalid route"
                    );
                }
                Logger.debug(
                    "querying tokens balance...",
                    `${ROUTES_V2.TOKEN_BALANCES}?${params}`
                );

                // create an eventSource connection when the cache subscription starts
                const source = new EventSource(
                    `${API_BASE_URL_V2}${ROUTES_V2.TOKEN_BALANCES}?${params}`
                );

                await new Promise<void>((resolve, reject) => {
                    source.addEventListener("balance", (e) => {
                        try {
                            /* eslint-disable-next-line */
                            const res = JSON.parse(e.data);
                            if (res.error) {
                                Logger.error(
                                    "zapperApi::getTokensBalance: error",
                                    res.error
                                );
                                error = {
                                    status: res.response?.status,
                                    data: res.response?.data || res.message,
                                };
                                return;
                            }

                            const address = res?.addresses[0];
                            const wallet = res?.balance?.wallet;

                            if (!wallet || !address) return;

                            const assets: TZapperAsset[] = [];

                            Object.values(
                                wallet as Record<string, TZapperAsset>
                            ).forEach((token) => {
                                assets.push(token);
                            });

                            const prevAssets = data[address]?.assets || [];

                            data[address] = {
                                ...(data[address] && data[address]),
                                assets: [...prevAssets, ...assets],
                                totalValue: computeAssetTotal([
                                    ...prevAssets,
                                    ...assets,
                                ]),
                            };
                        } catch (err) {
                            error = {
                                data: getErrorMessage(err),
                            };
                            reject(err);
                        }
                    });
                    source.addEventListener("end", () => {
                        source.close();
                        resolve();
                    });
                }).catch((err) => {
                    // we need to "catch" the promise rejection here
                    Logger.error("zapperApi::getTokensBalance: error", err);
                });
                if (error && Object.keys(error).length > 0) {
                    return {
                        error,
                        data: undefined,
                    };
                }
                return {
                    data,
                };
            },
        }),
        getNftBalanceForAddresses: builder.query<
            TNftBalanceForAddressesResponse,
            TGetNftBalanceForAddressesRequest
        >({
            query: ({ addresses }) => {
                const params: string = queryString.stringify({
                    "addresses[]": addresses,
                    limit: 50, // TODO: Pagination
                    api_key: API_KEY,
                });
                if (ROUTES_V2?.NFT_BALANCES == null) {
                    throw new Error(
                        "zapperApi::getNftBalanceForAddresses: invalid route"
                    );
                }
                Logger.debug(
                    "querying NFT tokens balance...",
                    `${ROUTES_V2.NFT_BALANCES}?${params}`
                );
                return `${API_BASE_URL_V2}${ROUTES_V2.NFT_BALANCES}?${params}`;
            },
        }),
        getGasPrices: builder.query<TGetGasPriceResponse, TGetGasPriceRequest>({
            query: () => {
                const params: string = queryString.stringify({
                    eip1559: true,
                    network: "ethereum",
                    api_key: API_KEY,
                });
                if (ROUTES?.GAS_PRICES == null) {
                    throw new Error("zapperApi::getGasPrice: invalid route");
                }
                Logger.debug(
                    "querying gas price...",
                    `${ROUTES.GAS_PRICES}?${params}`
                );
                return `${API_BASE_URL}${ROUTES.GAS_PRICES}?${params}`;
            },
            transformResponse: (
                r: TGetGasPriceRawResponse
            ): TGetGasPriceResponse => ({
                fast: r.instant.baseFeePerGas,
                standard: r.fast.baseFeePerGas,
                slow: r.standard.baseFeePerGas,
            }),
        }),
    }),
});

export const {
    useGetGasPricesQuery,
    useGetTokensBalanceForAddressesQuery,
    useGetNftBalanceForAddressesQuery,
} = zapperApi;
