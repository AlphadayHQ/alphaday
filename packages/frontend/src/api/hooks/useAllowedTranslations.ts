import { EFeaturesRegistry } from "src/constants";
import { ELanguageCode } from "../types/language";
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

    const { isLoading: isLoadingZh, enabled: isTranslationsAllowedZh } =
        useFeatureFlags(EFeaturesRegistry.TranslationZh);

    return {
        languages: {
            [ELanguageCode.EN]: true,
            [ELanguageCode.ES]: isTranslationsAllowedEs,
            [ELanguageCode.TR]: isTranslationsAllowedTr,
            [ELanguageCode.FR]: isTranslationsAllowedFr,
            [ELanguageCode.JA]: isTranslationsAllowedJa,
            [ELanguageCode.ZH]: isTranslationsAllowedZh,
        },
        isLoading:
            isLoadingEs ||
            isLoadingFr ||
            isLoadingJa ||
            isLoadingTr ||
            isLoadingZh,
    };
};
