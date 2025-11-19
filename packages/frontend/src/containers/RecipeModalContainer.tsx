import {
    useGetRecipesQuery,
    useGetRecipeTemplatesQuery,
} from "src/api/services/recipes/recipeEndpoints";
import { toggleRecipeModal } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";

import { RecipeModal } from "src/components/recipes/RecipeModal";

export const RecipeModalContainer = () => {
    const dispatch = useAppDispatch();
    const showModal = useAppSelector((state) => state.ui.showRecipeModal);
    const toggleModal = () => dispatch(toggleRecipeModal());

    const { data: recipesData, isLoading: recipesLoading } = useGetRecipesQuery(
        {}
    );
    const { data: templatesData, isLoading: templatesLoading } =
        useGetRecipeTemplatesQuery({});

    const onClose = () => {
        if (showModal) {
            toggleModal();
        }
    };

    console.log("recipesData", recipesData);
    console.log("templatesData", templatesData);

    return (
        <RecipeModal
            showModal={showModal}
            onClose={onClose}
            recipes={recipesData?.results}
            templates={templatesData?.results}
            isLoading={recipesLoading || templatesLoading}
        />
    );
};
