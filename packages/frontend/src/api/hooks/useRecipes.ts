import { EFeaturesRegistry } from "src/constants";
import { useFeatureFlags } from "./useFeatureFlags";

/**
 * Hook to check if the Recipes feature is enabled for the current user.
 *
 * The Recipes feature allows users to create scheduled, automated tasks
 * that fetch data from sources, process it through templates, and deliver
 * it in various formats.
 *
 * @returns {Object} Object containing:
 *   - enabled: boolean - true if recipes feature is allowed for current user/guest
 *   - isLoading: boolean - true while feature flags are being fetched
 *
 * @example
 * ```tsx
 * const RecipeButton = () => {
 *   const { enabled: isRecipesAllowed, isLoading } = useRecipes();
 *
 *   if (isLoading) return <Loader />;
 *   if (!isRecipesAllowed) return null;
 *
 *   return <button>Open Recipes</button>;
 * };
 * ```
 */
export const useRecipes = () => {
    const { enabled, isLoading } = useFeatureFlags(EFeaturesRegistry.Recipes);

    return {
        enabled,
        isLoading,
    };
};
