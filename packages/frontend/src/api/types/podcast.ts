import { TBaseTag } from "../services";
import { TBaseItem } from "./primitives";

export type TPodcastItem = Omit<TBaseItem, "tags"> & {
    image: string;
    publishedAt: string;
    shortDescription: string;
    duration: string;
    fileUrl: string;
};

export type TPodcastChannel = {
    id: number;
    name: string;
    slug: string;
    harvestor: {
        slug: "podcast"; // Should be only podcast
    };
    icon: string | undefined;
    status: number;
    engine: string;
    engine_url: string;
    engine_params: Record<string, unknown>;
    tags: TBaseTag[];
    mappings: Record<string, unknown>;
    fallback_source: string | null;
};
