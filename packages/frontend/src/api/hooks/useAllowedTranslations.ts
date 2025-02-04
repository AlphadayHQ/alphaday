import { EFeaturesRegistry } from "src/constants";
import { EnumLanguageCode } from "../types/language";
import { useFeatureFlags } from "./useFeatureFlags";

export const useAllowedTranslations = () => {
    const { enabled: isTranslationsAllowedEs } = useFeatureFlags(
        EFeaturesRegistry.TranslationEs
    );
    const { enabled: isTranslationsAllowedFr } = useFeatureFlags(
        EFeaturesRegistry.TranslationFr
    );
    const { enabled: isTranslationsAllowedJa } = useFeatureFlags(
        EFeaturesRegistry.TranslationJa
    );
    const { enabled: isTranslationsAllowedTr } = useFeatureFlags(
        EFeaturesRegistry.TranslationTr
    );

    return {
        [EnumLanguageCode.EN]: true,
        [EnumLanguageCode.ES]: isTranslationsAllowedEs,
        [EnumLanguageCode.TR]: isTranslationsAllowedTr,
        [EnumLanguageCode.FR]: isTranslationsAllowedFr,
        [EnumLanguageCode.JA]: isTranslationsAllowedJa,
    };
};
