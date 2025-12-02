import { FC } from "react";

import { useRecipeLibraryHash, useRecipes } from "src/api/hooks";
import {
    useGetRecipesQuery,
    useGetRecipeTemplatesQuery,
    useUpdateRecipeMutation,
    useActivateRecipeMutation,
    useDeactivateRecipeMutation,
    useTriggerRecipeMutation,
    useGetOutputFormatsQuery,
} from "src/api/services/recipes/recipeEndpoints";
import { toggleRecipeLibrary } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";

import RecipeModule from "src/components/recipes/RecipeModule";
import CONFIG from "src/config/config";
import { WIDGETS_CONFIG } from "src/config/widgets";
import { ETemplateNameRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";

const RecipeContainer: FC<IModuleContainer> = () => {
    const { enabled: isRecipesEnabled } = useRecipes();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { openModal: hashOpenModal } = useRecipeLibraryHash();
    const toggleModal = CONFIG.UI.USE_URL_HASH_FOR_RECIPE_MODAL
        ? hashOpenModal
        : () => dispatch(toggleRecipeLibrary());

    // Don't render if recipes feature is disabled
    if (!isRecipesEnabled) {
        return null;
    }

    const {
        data: recipesData,
        isLoading: recipesLoading,
        refetch: refetchRecipes,
    } = useGetRecipesQuery({});
    const { data: templatesData, isLoading: templatesLoading } =
        useGetRecipeTemplatesQuery({});
    const { data: outputFormatsData } = useGetOutputFormatsQuery({});

    const [updateRecipe] = useUpdateRecipeMutation();
    const [activateRecipe] = useActivateRecipeMutation();
    const [deactivateRecipe] = useDeactivateRecipeMutation();
    const [triggerRecipe] = useTriggerRecipeMutation();

    const handleOpenLibrary = () => {
        toggleModal();
    };

    const handleUpdateRecipe = (recipeData: {
        id: string;
        name: string;
        description?: string;
        schedule: string;
        timezone?: string;
        outputFormat?: string;
    }) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        // Get the existing recipe to preserve sources and outputs
        const existingRecipe = recipesData?.results.find(
            (r) => r.id === recipeData.id
        );
        if (!existingRecipe) return;

        updateRecipe({
            id: recipeData.id,
            name: recipeData.name,
            description: recipeData.description,
            schedule: recipeData.schedule,
            timezone: recipeData.timezone,
            isActive: existingRecipe.isActive,
            sources:
                existingRecipe.recipeSources?.map((source) => ({
                    sourceCategory: source.sourceCategory,
                    filters: source.filters,
                    maxItems: source.maxItems,
                    priorityScoreThreshold: source.priorityScoreThreshold,
                })) || [],
            outputs:
                existingRecipe.recipeOutputs?.map((output, index) => ({
                    outputFormat:
                        index === 0 && recipeData.outputFormat
                            ? recipeData.outputFormat
                            : output.outputFormat,
                    promptTemplate: output.promptTemplate,
                    userPromptOverride: output.userPromptOverride,
                    deliveryChannels: output.deliveryChannels,
                })) || [],
        })
            .unwrap()
            .then(() => {
                refetchRecipes();
            })
            .catch((error) => {
                Logger.error(
                    "RecipeContainer::handleUpdateRecipe::Failed to update recipe:",
                    error
                );
                toast("Failed to update recipe. Please try again.", {
                    type: EToastRole.Error,
                });
            });
    };

    const handleToggleActivation = (recipeId: string, isActive: boolean) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        const action = isActive
            ? deactivateRecipe({ id: recipeId })
            : activateRecipe({ id: recipeId });

        action
            .unwrap()
            .then(() => {
                refetchRecipes();
            })
            .catch((error) => {
                Logger.error(
                    "RecipeContainer::handleToggleActivation::Failed to toggle recipe activation:",
                    error
                );
                toast("Failed to toggle recipe activation. Please try again.", {
                    type: EToastRole.Error,
                });
            });
    };

    const handleTrigger = (recipeId: string) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        triggerRecipe({ id: recipeId })
            .unwrap()
            .then(() => {
                toast("Recipe triggered successfully!", {
                    type: EToastRole.Success,
                });
            })
            .catch((error) => {
                Logger.error(
                    "RecipeContainer::handleTrigger::Failed to trigger recipe:",
                    error
                );
                toast("Failed to trigger recipe. Please try again.", {
                    type: EToastRole.Error,
                });
            });
    };

    return (
        <RecipeModule
            recipes={recipesData?.results}
            templates={templatesData?.results}
            outputFormats={outputFormatsData?.results}
            isLoadingRecipes={recipesLoading || templatesLoading}
            widgetHeight={
                WIDGETS_CONFIG[ETemplateNameRegistry.Recipe].WIDGET_HEIGHT
            }
            onOpenLibrary={handleOpenLibrary}
            onUpdateRecipe={handleUpdateRecipe}
            onToggleActivation={handleToggleActivation}
            onTrigger={handleTrigger}
        />
    );
};

export default RecipeContainer;
