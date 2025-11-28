import { useEffect, useState } from "react";
import { useRecipeLibraryHash, useView } from "src/api/hooks";
import {
    useGetRecipesQuery,
    useGetRecipeTemplatesQuery,
    useCreateRecipeMutation,
    useUpdateRecipeMutation,
    useActivateRecipeMutation,
    useDeactivateRecipeMutation,
    useGetOutputFormatsQuery,
} from "src/api/services/recipes/recipeEndpoints";
import {
    useGetWidgetsQuery,
    useGetWidgetByIdQuery,
} from "src/api/services/views/viewsEndpoints";
import { toggleRecipeLibrary } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { TRecipeInput, TUserViewWidget } from "src/api/types";
import { recomputeWidgetsPos } from "src/api/utils/layoutUtils";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { RecipeLibrary } from "src/components/recipes/RecipeLibrary";
import CONFIG from "src/config/config";
import { v4 as uuidv4 } from "uuid";
import globalMessages from "src/globalMessages";

const useRecipeLibraryState = () => {
    const dispatch = useAppDispatch();
    const reduxShowModal = useAppSelector(
        (state) => state.ui.showRecipeLibrary
    );
    const hashState = useRecipeLibraryHash();

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
                dispatch(toggleRecipeLibrary());
            }
        },
    };
};

const useAddRecipeWidget = () => {
    const { selectedView, addWidgetsToCache } = useView();

    // Fetch recipe widget to add to board when first recipe is created
    const { data: recipeWidgetsData } = useGetWidgetsQuery({
        search: "recipe",
        limit: 1,
    });

    // Fetch full recipe widget details when needed
    const { currentData: resolvedRecipeWidget } = useGetWidgetByIdQuery(
        { id: recipeWidgetsData?.results?.[0]?.id ?? 0 },
        {
            skip: recipeWidgetsData?.results?.[0] === undefined,
        }
    );

    // Track if we should add the recipe widget (set to true after first recipe is created)
    const [shouldAddRecipeWidget, setShouldAddRecipeWidget] = useState(false);
    // Track if we've already added the widget to prevent duplicates
    const [hasAddedRecipeWidget, setHasAddedRecipeWidget] = useState(false);

    // Effect to add recipe widget when resolved and flagged to be added
    useEffect(() => {
        if (
            shouldAddRecipeWidget &&
            !hasAddedRecipeWidget &&
            selectedView &&
            resolvedRecipeWidget
        ) {
            const recipeWidget = resolvedRecipeWidget;

            // Check if recipe widget already exists on the board
            const hasRecipeWidget = selectedView.data.widgets.some(
                (w) => w.widget.slug === recipeWidget.slug
            );

            if (hasRecipeWidget) {
                Logger.debug(
                    "RecipeLibraryContainer: Recipe widget already exists on board, skipping addition"
                );
                setHasAddedRecipeWidget(true);
                setShouldAddRecipeWidget(false);
                return;
            }

            const widgetsCount = selectedView.data.widgets.length;
            const maxWidgets =
                selectedView.data.max_widgets ?? CONFIG.VIEWS.MAX_WIDGETS;

            if (widgetsCount >= maxWidgets) {
                Logger.debug(
                    "RecipeLibraryContainer: Board is at max widgets, not adding recipe widget"
                );
                setShouldAddRecipeWidget(false);
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
                "RecipeLibraryContainer: Recipe widget added to board"
            );

            // Mark as added and reset flag
            setHasAddedRecipeWidget(true);
            setShouldAddRecipeWidget(false);
        }
    }, [
        shouldAddRecipeWidget,
        hasAddedRecipeWidget,
        selectedView,
        resolvedRecipeWidget,
        addWidgetsToCache,
    ]);

    return {
        triggerAddRecipeWidget: () => setShouldAddRecipeWidget(true),
    };
};

export const RecipeLibraryContainer = () => {
    const { showModal, onClose } = useRecipeLibraryState();
    const { triggerAddRecipeWidget } = useAddRecipeWidget();
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
                    // Trigger widget addition via useEffect
                    triggerAddRecipeWidget();
                    toast("Recipe created and added to your board!", {
                        type: EToastRole.Success,
                    });
                }
            })
            .catch((error) => {
                Logger.error("RecipeLibraryContainer::onCreateRecipe", error);
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
                Logger.error("RecipeLibraryContainer::onUpdateRecipe", error);
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
                Logger.error("RecipeLibraryContainer::onActivateRecipe", error);
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
                Logger.error(
                    "RecipeLibraryContainer::onDeactivateRecipe",
                    error
                );
                toast("Failed to deactivate recipe. Please try again.", {
                    type: EToastRole.Error,
                });
            });
    };

    return (
        <RecipeLibrary
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
