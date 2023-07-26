import { EFeatureStatus, EFeaturesRegistry } from "src/constants";

export type TFeature = {
    id: number;
    name: string;
    slug: EFeaturesRegistry;
    status: EFeatureStatus;
};
