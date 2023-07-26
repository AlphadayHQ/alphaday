import { TBaseItem } from "./primitives";

export type TNewsItem = Omit<TBaseItem, "tags"> & {
    author: string;
    publishedAt: string;
};

export type TNewsSummary = {
    tags: string[];
    summary: string;
    updated_at: string;
};
