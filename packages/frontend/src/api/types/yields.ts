export type TYieldPool = {
    id: number;
    poolId: string;
    project: string;
    chain: string;
    symbol: string;
    apy: number;
    apyBase: number | null;
    apyReward: number | null;
    tvlUsd: number;
    ilRisk: string;
    date: string;
};
