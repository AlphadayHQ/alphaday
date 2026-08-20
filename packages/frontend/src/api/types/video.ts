import { TBaseTag } from "../services";
import { TBaseItem } from "./primitives";

export type TVideoItem = TBaseItem & {
    image: string;
    publishedAt: string;
    shortDescription: string;
    /**
     * Aspect ratio of the video, when known by the backend.
     * May be a float (width / height, e.g. 0.5625) or a "W:H" string
     * (e.g. "9:16"). Not all videos provide this.
     */
    aspectRatio?: number | string;
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
