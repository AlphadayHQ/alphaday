import { TCoin } from "./primitives";

export type TPortfolioToken = {
    id: string;
    networkId: number;
    address: string;
    label: string;
    name: string;
    symbol: string;
    decimals: number;
    coingeckoId: string;
    status: string;
    hide: boolean;
    canExchange: boolean;
    verified: boolean;
    externallyVerified: boolean;
    priceUpdatedAt: string;
    updatedAt: string;
    createdAt: string;
    price: number;
    dailyVolume: number;
    totalSupply: string;
    holdersEnabled: boolean;
    marketCap: number;
    balance: number;
    balanceUSD: number;
    balanceRaw: string;
    tokenImage: string | null;
};

export type TPortfolio = {
    key: string;
    address: string;
    network: string;
    updatedAt: string;
    token: TPortfolioToken;
};

// TODO: Update this type to match the API response
export type THolding = {
    coin: TCoin;
    amount: number;
    date: Date;
};
