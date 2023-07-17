import { TBaseTag } from "../services";
import { TBaseItem } from "./primitives";

export type TVideoItem = TBaseItem & {
    image: string;
    publishedAt: string;
    shortDescription: string;
};

export type TVideoChannel = {
    id: number;
    name: string;
    slug: string;
    harvestor: {
        slug: "video"; // Should be only video
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
