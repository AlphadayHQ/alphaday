export type TGasConsumerMeta = {
    NAME: string;
    SWAP: number;
    SUPPLY_LIQUIDITY: number;
    REMOVE_LIQUIDITY: number;
    IMG: string;
};
export type TGasConsumptionDict = {
    [key: string]: TGasConsumerMeta;
};

export type TGasPrices = {
    fast: number;
    standard: number;
    slow: number;
};
