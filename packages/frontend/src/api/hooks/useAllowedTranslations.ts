import { EFeaturesRegistry } from "src/constants";
import { EnumLanguageCode } from "../types/language";
import { useFeatureFlags } from "./useFeatureFlags";

export const useAllowedTranslations = () => {
    const { isLoading: isLoadingEs, enabled: isTranslationsAllowedEs } =
        useFeatureFlags(EFeaturesRegistry.TranslationEs);

    const { isLoading: isLoadingFr, enabled: isTranslationsAllowedFr } =
        useFeatureFlags(EFeaturesRegistry.TranslationFr);

    const { isLoading: isLoadingJa, enabled: isTranslationsAllowedJa } =
        useFeatureFlags(EFeaturesRegistry.TranslationJa);

    const { isLoading: isLoadingTr, enabled: isTranslationsAllowedTr } =
        useFeatureFlags(EFeaturesRegistry.TranslationTr);

    return {
        languages: {
            [EnumLanguageCode.EN]: true,
            [EnumLanguageCode.ES]: isTranslationsAllowedEs,
            [EnumLanguageCode.TR]: isTranslationsAllowedTr,
            [EnumLanguageCode.FR]: isTranslationsAllowedFr,
            [EnumLanguageCode.JA]: isTranslationsAllowedJa,
        },
        isLoading: isLoadingEs || isLoadingFr || isLoadingJa || isLoadingTr,
    };
};
