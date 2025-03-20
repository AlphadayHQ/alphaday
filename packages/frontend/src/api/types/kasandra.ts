import { TBaseItem } from "./primitives";

export type TKasandraItem = Omit<TBaseItem, "tags"> & {
    author: string;
    publishedAt: string;
    dataPoint: [number, number];
    direction: "up" | "down";
};
