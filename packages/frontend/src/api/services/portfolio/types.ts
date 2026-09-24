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

export type TNftMedia = {
    type: string; // e.g "image", "audio"
    originalUrl: string; // e.g ipfs://Qma3dgNvmqabeVchAfG95KyESXCDojo4b1Fc8U5xiZ89hf
};

export type TNftAsset = {
    balance: string; // number in string format
    address: string; // owner wallet address
    network: string;
    networkSlug: string;
    description: string | null;
    tokenUri: string | null;
    lastUpdatedAt: string | null;
    token: {
        name: string;
        tokenId: string; // number in string format
        lastSaleEth: number | null;
        rarityRank: number | null;
        estimatedValueEth: string | null; // number in string format
        medias: TNftMedia[];
        collection: {
            address?: string | null;
            name?: string;
            nftStandard?: string; // e.g erc721
            floorPriceEth?: string | null; // number in string format
            logoImageUrl?: string | null;
            openseaId?: string | null;
        };
    };
};

export type TGetNftBalancesRequest = {
    addresses: string[];
};

export type TGetNftBalancesResponse = {
    items: TNftAsset[];
    totalValue: number;
};
