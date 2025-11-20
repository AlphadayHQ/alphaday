import { FC } from "react";

import { useGetRecipesQuery } from "src/api/services/recipes/recipeEndpoints";
import { toggleRecipeModal } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";

import RecipeModule from "src/components/recipes/RecipeModule";
import { WIDGETS_CONFIG } from "src/config/widgets";
import { ETemplateNameRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const RecipeContainer: FC<IModuleContainer> = () => {
    const dispatch = useAppDispatch();
    const toggleModal = () => dispatch(toggleRecipeModal());

    const { data: recipesData, isLoading: recipesLoading } = useGetRecipesQuery(
        {}
    );

    const handleOpenLibrary = () => {
        toggleModal();
    };

    return (
        <RecipeModule
            recipes={recipesData?.results}
            isLoadingRecipes={recipesLoading}
            widgetHeight={
                WIDGETS_CONFIG[ETemplateNameRegistry.Recipe].WIDGET_HEIGHT
            }
            onOpenLibrary={handleOpenLibrary}
        />
    );
};

export default RecipeContainer;
