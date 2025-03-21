import { TBaseItem } from "./primitives";

export type TKasandraItem = Omit<TBaseItem, "tags"> & {
    author: string;
    publishedAt: string;
    dataPoint: [number, number];
    expectedPercentChange: number;
    description: string;
};
