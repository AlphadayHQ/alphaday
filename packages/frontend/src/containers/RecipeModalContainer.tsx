import {
    useGetRecipesQuery,
    useGetRecipeTemplatesQuery,
    useCreateRecipeMutation,
    useUpdateRecipeMutation,
    useActivateRecipeMutation,
    useDeactivateRecipeMutation,
} from "src/api/services/recipes/recipeEndpoints";
import { toggleRecipeModal } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { toast } from "src/api/utils/toastUtils";
import { RecipeModal } from "src/components/recipes/RecipeModal";
import globalMessages from "src/globalMessages";

export const RecipeModalContainer = () => {
    const dispatch = useAppDispatch();
    const showModal = useAppSelector((state) => state.ui.showRecipeModal);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const toggleModal = () => dispatch(toggleRecipeModal());

    const {
        data: recipesData,
        isLoading: recipesLoading,
        refetch: refetchRecipes,
    } = useGetRecipesQuery({});
    const { data: templatesData, isLoading: templatesLoading } =
        useGetRecipeTemplatesQuery({});

    const [createRecipe] = useCreateRecipeMutation();
    const [updateRecipe] = useUpdateRecipeMutation();
    const [activateRecipe] = useActivateRecipeMutation();
    const [deactivateRecipe] = useDeactivateRecipeMutation();

    const onClose = () => {
        if (showModal) {
            toggleModal();
        }
    };

    const onCreateRecipe = async (recipe: {
        name: string;
        description?: string;
        schedule: string;
        timezone?: string;
        sources: Array<{
            sourceCategory: string;
            filters?: Record<string, unknown>;
            maxItems?: number;
        }>;
        outputs: Array<{
            outputFormat: number;
            promptTemplate: number;
            deliveryChannels?: Record<string, unknown>;
        }>;
    }) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        await createRecipe({
            name: recipe.name,
            description: recipe.description,
            schedule: recipe.schedule,
            timezone: recipe.timezone,
            sources: recipe.sources,
            outputs: recipe.outputs,
        });
        refetchRecipes();
    };

    const onUpdateRecipe = async (recipe: {
        id: string;
        name: string;
        description?: string;
        schedule: string;
        timezone?: string;
        sources: Array<{
            sourceCategory: string;
            filters?: Record<string, unknown>;
            maxItems?: number;
        }>;
        outputs: Array<{
            outputFormat: number;
            promptTemplate: number;
            deliveryChannels?: Record<string, unknown>;
        }>;
    }) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        await updateRecipe({
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            schedule: recipe.schedule,
            timezone: recipe.timezone,
            sources: recipe.sources,
            outputs: recipe.outputs,
        });
        refetchRecipes();
    };

    const onActivateRecipe = async (recipeId: string) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        await activateRecipe({ id: recipeId });
        refetchRecipes();
    };

    const onDeactivateRecipe = async (recipeId: string) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        await deactivateRecipe({ id: recipeId });
        refetchRecipes();
    };

    return (
        <RecipeModal
            showModal={showModal}
            onClose={onClose}
            recipes={recipesData?.results}
            templates={templatesData?.results}
            isLoading={recipesLoading || templatesLoading}
            onCreateRecipe={onCreateRecipe}
            onUpdateRecipe={onUpdateRecipe}
            onActivateRecipe={onActivateRecipe}
            onDeactivateRecipe={onDeactivateRecipe}
        />
    );
};
