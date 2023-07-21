import { TFeature } from "src/api/types/features";
import { EFeatureStatus } from "src/constants";

/**
 * Query types
 */
export type TGetFeaturesRequest = void | {
    status?: EFeatureStatus;
};

export type TGetFeaturesResponse = TFeature[];
