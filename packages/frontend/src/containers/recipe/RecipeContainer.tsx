import { FC } from "react";

import {
    useGetRecipesQuery,
    useGetRecipeTemplatesQuery,
    useUpdateRecipeMutation,
    useActivateRecipeMutation,
    useDeactivateRecipeMutation,
} from "src/api/services/recipes/recipeEndpoints";
import { toggleRecipeModal } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";

import RecipeModule from "src/components/recipes/RecipeModule";
import { WIDGETS_CONFIG } from "src/config/widgets";
import { ETemplateNameRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";

const RecipeContainer: FC<IModuleContainer> = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const toggleModal = () => dispatch(toggleRecipeModal());

    const {
        data: recipesData,
        isLoading: recipesLoading,
        refetch: refetchRecipes,
    } = useGetRecipesQuery({});
    const { data: templatesData, isLoading: templatesLoading } =
        useGetRecipeTemplatesQuery({});

    const [updateRecipe] = useUpdateRecipeMutation();
    const [activateRecipe] = useActivateRecipeMutation();
    const [deactivateRecipe] = useDeactivateRecipeMutation();

    const handleOpenLibrary = () => {
        toggleModal();
    };

    const handleUpdateRecipe = async (recipeData: {
        id: string;
        name: string;
        description?: string;
        schedule: string;
        timezone?: string;
    }) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        try {
            // Get the existing recipe to preserve sources and outputs
            const existingRecipe = recipesData?.results.find(
                (r) => r.id === recipeData.id
            );
            if (!existingRecipe) return;

            await updateRecipe({
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
                    existingRecipe.recipeOutputs?.map((output) => ({
                        outputFormat: output.outputFormat,
                        promptTemplate: output.promptTemplate,
                        userPromptOverride: output.userPromptOverride,
                        deliveryChannels: output.deliveryChannels,
                    })) || [],
            }).unwrap();
            refetchRecipes();
        } catch (error) {
            Logger.error(
                "RecipeContainer::handleUpdateRecipe::Failed to update recipe:",
                error
            );
            toast("Failed to update recipe. Please try again.", {
                type: EToastRole.Error,
            });
        }
    };

    const handleToggleActivation = async (
        recipeId: string,
        isActive: boolean
    ) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        try {
            if (isActive) {
                await deactivateRecipe({ id: recipeId }).unwrap();
            } else {
                await activateRecipe({ id: recipeId }).unwrap();
            }
            refetchRecipes();
        } catch (error) {
            Logger.error(
                "RecipeContainer::handleToggleActivation::Failed to toggle recipe activation:",
                error
            );
            toast("Failed to toggle recipe activation. Please try again.", {
                type: EToastRole.Error,
            });
        }
    };

    return (
        <RecipeModule
            recipes={recipesData?.results}
            templates={templatesData?.results}
            isLoadingRecipes={recipesLoading || templatesLoading}
            widgetHeight={
                WIDGETS_CONFIG[ETemplateNameRegistry.Recipe].WIDGET_HEIGHT
            }
            onOpenLibrary={handleOpenLibrary}
            onUpdateRecipe={handleUpdateRecipe}
            onToggleActivation={handleToggleActivation}
        />
    );
};

export default RecipeContainer;
