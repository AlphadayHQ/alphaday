import { TBaseCoin, TBaseTag } from "../services/baseTypes";
import { TBaseItem, TBaseProject } from "./primitives";

export type TKasandraItem = Omit<TBaseItem, "tags"> & {
    author: string;
    publishedAt: string;
    dataPoint: [number, number];
    expectedPercentChange: number;
    description: string;
};

export type TPredictionCoin = Omit<TBaseCoin, "gecko_id"> & {
    project: TBaseProject;
    geckoId: string;
    tags: TBaseTag[];
};

export type TPredictionItem = {
    id: number;
    coin: TPredictionCoin;
    price: number;
    insight: string;
    verboseReferences: string;
    case: string;
    targetDate: string;
    created: string;
};
