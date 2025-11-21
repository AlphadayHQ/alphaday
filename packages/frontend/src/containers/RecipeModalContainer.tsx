import { useRecipeModalHash } from "src/api/hooks";
import {
    useGetRecipesQuery,
    useGetRecipeTemplatesQuery,
    useCreateRecipeMutation,
    useUpdateRecipeMutation,
    useActivateRecipeMutation,
    useDeactivateRecipeMutation,
    useGetOutputFormatsQuery,
} from "src/api/services/recipes/recipeEndpoints";
import { toggleRecipeModal } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { TRecipeInput } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { RecipeModal } from "src/components/recipes/RecipeModal";
import CONFIG from "src/config/config";
import globalMessages from "src/globalMessages";

const useRecipeModalState = () => {
    const dispatch = useAppDispatch();
    const reduxShowModal = useAppSelector((state) => state.ui.showRecipeModal);
    const hashState = useRecipeModalHash();

    if (CONFIG.UI.USE_URL_HASH_FOR_RECIPE_MODAL) {
        return {
            showModal: hashState.showModal,
            onClose: hashState.closeModal,
        };
    }

    return {
        showModal: reduxShowModal,
        onClose: () => {
            if (reduxShowModal) {
                dispatch(toggleRecipeModal());
            }
        },
    };
};

export const RecipeModalContainer = () => {
    const { showModal, onClose } = useRecipeModalState();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const {
        data: recipesData,
        isLoading: recipesLoading,
        refetch: refetchRecipes,
    } = useGetRecipesQuery({});
    const { data: templatesData, isLoading: templatesLoading } =
        useGetRecipeTemplatesQuery({});
    const { data: outputFormatsData } = useGetOutputFormatsQuery({});

    const [createRecipe] = useCreateRecipeMutation();
    const [updateRecipe] = useUpdateRecipeMutation();
    const [activateRecipe] = useActivateRecipeMutation();
    const [deactivateRecipe] = useDeactivateRecipeMutation();

    const onCreateRecipe = async (recipe: TRecipeInput) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        try {
            await createRecipe({
                name: recipe.name,
                description: recipe.description,
                schedule: recipe.schedule,
                timezone: recipe.timezone,
                sources: recipe.sources,
                outputs: recipe.outputs,
            }).unwrap();
            refetchRecipes();
        } catch (error) {
            Logger.error("RecipeModalContainer::onCreateRecipe", error);
            toast("Failed to create recipe. Please try again.", {
                type: EToastRole.Error,
            });
        }
    };

    const onUpdateRecipe = async (recipe: TRecipeInput) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        try {
            await updateRecipe({
                id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                schedule: recipe.schedule,
                timezone: recipe.timezone,
                sources: recipe.sources,
                outputs: recipe.outputs,
            }).unwrap();
            refetchRecipes();
        } catch (error) {
            Logger.error("RecipeModalContainer::onUpdateRecipe", error);
            toast("Failed to update recipe. Please try again.", {
                type: EToastRole.Error,
            });
        }
    };

    const onActivateRecipe = async (recipeId: string) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        try {
            await activateRecipe({ id: recipeId }).unwrap();
            refetchRecipes();
        } catch (error) {
            Logger.error("RecipeModalContainer::onActivateRecipe", error);
            toast("Failed to activate recipe. Please try again.", {
                type: EToastRole.Error,
            });
        }
    };

    const onDeactivateRecipe = async (recipeId: string) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        try {
            await deactivateRecipe({ id: recipeId }).unwrap();
            refetchRecipes();
        } catch (error) {
            Logger.error("RecipeModalContainer::onDeactivateRecipe", error);
            toast("Failed to deactivate recipe. Please try again.", {
                type: EToastRole.Error,
            });
        }
    };

    return (
        <RecipeModal
            showModal={showModal}
            onClose={onClose}
            recipes={recipesData?.results}
            templates={templatesData?.results}
            outputFormats={outputFormatsData?.results}
            isLoading={recipesLoading || templatesLoading}
            onCreateRecipe={onCreateRecipe}
            onUpdateRecipe={onUpdateRecipe}
            onActivateRecipe={onActivateRecipe}
            onDeactivateRecipe={onDeactivateRecipe}
        />
    );
};
