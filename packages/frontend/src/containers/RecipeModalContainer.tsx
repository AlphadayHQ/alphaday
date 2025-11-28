import { useRecipeModalHash, useView } from "src/api/hooks";
import {
    useGetRecipesQuery,
    useGetRecipeTemplatesQuery,
    useCreateRecipeMutation,
    useUpdateRecipeMutation,
    useActivateRecipeMutation,
    useDeactivateRecipeMutation,
    useGetOutputFormatsQuery,
} from "src/api/services/recipes/recipeEndpoints";
import { useGetWidgetsQuery } from "src/api/services/views/viewsEndpoints";
import { toggleRecipeModal } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { TRecipeInput, TUserViewWidget } from "src/api/types";
import { recomputeWidgetsPos } from "src/api/utils/layoutUtils";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { RecipeModal } from "src/components/recipes/RecipeModal";
import CONFIG from "src/config/config";
import { v4 as uuidv4 } from "uuid";
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
    const { selectedView, addWidgetsToCache } = useView();

    const {
        data: recipesData,
        isLoading: recipesLoading,
        refetch: refetchRecipes,
    } = useGetRecipesQuery({});
    const { data: templatesData, isLoading: templatesLoading } =
        useGetRecipeTemplatesQuery({});
    const { data: outputFormatsData } = useGetOutputFormatsQuery({});

    // Fetch recipe widget to add to board when first recipe is created
    const { data: recipeWidgetsData } = useGetWidgetsQuery({
        search: "recipe",
        limit: 1,
    });

    const [createRecipe] = useCreateRecipeMutation();
    const [updateRecipe] = useUpdateRecipeMutation();
    const [activateRecipe] = useActivateRecipeMutation();
    const [deactivateRecipe] = useDeactivateRecipeMutation();

    const addRecipeWidgetToBoard = () => {
        if (!selectedView || !recipeWidgetsData?.results?.[0]) {
            Logger.warn(
                "RecipeModalContainer::addRecipeWidgetToBoard: Cannot add widget - no selected view or recipe widget not found"
            );
            return;
        }

        const recipeWidget = recipeWidgetsData.results[0];
        const widgetsCount = selectedView.data.widgets.length;
        const maxWidgets =
            selectedView.data.max_widgets ?? CONFIG.VIEWS.MAX_WIDGETS;

        if (widgetsCount >= maxWidgets) {
            Logger.debug(
                "RecipeModalContainer::addRecipeWidgetToBoard: Board is at max widgets, not adding recipe widget"
            );
            return;
        }

        const newWidget: TUserViewWidget = {
            id: 990,
            hash: uuidv4(),
            name: recipeWidget.name,
            widget: recipeWidget,
            settings: recipeWidget.settings.map(({ setting }, id) => ({
                widget_setting: {
                    setting: {
                        id: Number(id) + 1,
                        slug: setting.slug,
                        name: setting.slug,
                        setting_type: "tags",
                    },
                    default_toggle_value: null,
                    sort_order: 0,
                },
                tags: [],
                toggle_value: false,
            })),
            sort_order: selectedView.data.widgets.length,
        };

        // Create a simple layout with 3 columns and add to the shortest
        const layoutState: TUserViewWidget[][] = [[], [], []];
        selectedView.data.widgets.forEach((widget, index) => {
            layoutState[index % 3].push(widget);
        });

        const shortestCol = layoutState
            .map((a) => a.length)
            .indexOf(Math.min(...layoutState.map((a) => a.length)));

        layoutState[shortestCol].push(newWidget);
        addWidgetsToCache(recomputeWidgetsPos(layoutState));

        Logger.debug(
            "RecipeModalContainer::addRecipeWidgetToBoard: Recipe widget added to board"
        );
    };

    const onCreateRecipe = (recipe: TRecipeInput) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }

        const isFirstRecipe =
            !recipesData?.results || recipesData.results.length === 0;

        createRecipe({
            name: recipe.name,
            description: recipe.description,
            schedule: recipe.schedule,
            timezone: recipe.timezone,
            sources: recipe.sources,
            outputs: recipe.outputs,
        })
            .unwrap()
            .then(() => {
                refetchRecipes();
                if (isFirstRecipe) {
                    addRecipeWidgetToBoard();
                    toast("Recipe created and added to your board!", {
                        type: EToastRole.Success,
                    });
                }
            })
            .catch((error) => {
                Logger.error("RecipeModalContainer::onCreateRecipe", error);
                toast("Failed to create recipe. Please try again.", {
                    type: EToastRole.Error,
                });
            });
    };

    const onUpdateRecipe = (recipe: TRecipeInput) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        updateRecipe({
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            schedule: recipe.schedule,
            timezone: recipe.timezone,
            sources: recipe.sources,
            outputs: recipe.outputs,
        })
            .unwrap()
            .then(() => {
                refetchRecipes();
            })
            .catch((error) => {
                Logger.error("RecipeModalContainer::onUpdateRecipe", error);
                toast("Failed to update recipe. Please try again.", {
                    type: EToastRole.Error,
                });
            });
    };

    const onActivateRecipe = (recipeId: string) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        activateRecipe({ id: recipeId })
            .unwrap()
            .then(() => {
                refetchRecipes();
            })
            .catch((error) => {
                Logger.error("RecipeModalContainer::onActivateRecipe", error);
                toast("Failed to activate recipe. Please try again.", {
                    type: EToastRole.Error,
                });
            });
    };

    const onDeactivateRecipe = (recipeId: string) => {
        if (!isAuthenticated) {
            toast(globalMessages.callToAction.signUpToBookmark("recipes"));
            return;
        }
        deactivateRecipe({ id: recipeId })
            .unwrap()
            .then(() => {
                refetchRecipes();
            })
            .catch((error) => {
                Logger.error("RecipeModalContainer::onDeactivateRecipe", error);
                toast("Failed to deactivate recipe. Please try again.", {
                    type: EToastRole.Error,
                });
            });
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
