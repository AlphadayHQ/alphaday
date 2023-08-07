import { TZapperNftAsset } from "src/api/services";
import { TPortfolio } from "src/api/types";

export type TPortfolioDataForAddress = {
    assets: TPortfolio[];
    totalValue: number;
};

export type TPortfolioNFTDataForAddress = {
    items: TZapperNftAsset[];
};

export type PoolTotalItem = {
    poolName: string;
    poolBalance: number;
};

export type ChartItem = {
    label: string;
    balanceUSD: number;
};

export type PoolChartItem = {
    poolName: string;
    poolItems: ChartItem[];
};

export interface IDonut {
    options: { [x: string]: unknown };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    series: number[] | { name?: string | undefined; data: any[] }[];
}

export type TPortfolioTabAccount = {
    address: string;
    ens?: string | null;
};

export enum EPortfolioType {
    Nft = "nft",
    Ft = "ft",
} // non-fungible & fungible tokens
