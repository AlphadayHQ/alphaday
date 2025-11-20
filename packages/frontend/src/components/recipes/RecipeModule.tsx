import { FC, memo } from "react";
import { ModuleLoader, Button } from "@alphaday/ui-kit";
import { TRecipe } from "src/api/services/recipes/types";
import { ReactComponent as RecipeSVG } from "src/assets/icons/grid.svg";

interface IRecipeModule {
    recipes: TRecipe[] | undefined;
    isLoadingRecipes: boolean;
    widgetHeight: number;
    onOpenLibrary: () => void;
}

const RecipeModule: FC<IRecipeModule> = memo(function RecipeModule({
    recipes,
    isLoadingRecipes,
    widgetHeight,
    onOpenLibrary,
}) {
    if (isLoadingRecipes || recipes === undefined) {
        return <ModuleLoader $height={`${widgetHeight}px`} />;
    }

    const activeRecipes = recipes.filter((recipe) => recipe.isActive);
    const totalRecipes = recipes.length;

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-1 flex flex-col justify-center gap-6">
                <div className="bg-backgroundVariant100 rounded-lg p-6 border border-borderLine">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="fontGroup-normal text-primaryVariant100 m-0 mb-1">
                                Total Recipes
                            </p>
                            <p className="fontGroup-highlightSemi text-primary text-3xl m-0">
                                {totalRecipes}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-backgroundVariant100 rounded-lg p-6 border border-borderLine">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="fontGroup-normal text-primaryVariant100 m-0 mb-1">
                                Active Recipes
                            </p>
                            <p className="fontGroup-highlightSemi text-primary text-3xl m-0">
                                {activeRecipes.length}
                            </p>
                        </div>
                    </div>
                </div>

                {totalRecipes > 0 && (
                    <div className="bg-backgroundVariant100 rounded-lg p-4 border border-borderLine">
                        <p className="fontGroup-normal text-primaryVariant100 m-0 mb-2">
                            Recent Recipes
                        </p>
                        <div className="space-y-2">
                            {recipes.slice(0, 3).map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="flex justify-between items-center py-2"
                                >
                                    <span className="fontGroup-normal text-primary truncate">
                                        {recipe.name}
                                    </span>
                                    <span
                                        className={`fontGroup-mini px-2 py-1 rounded ${
                                            recipe.isActive
                                                ? "bg-accentVariant100 text-accentVariant400"
                                                : "bg-backgroundVariant200 text-primaryVariant100"
                                        }`}
                                    >
                                        {recipe.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <Button
                    onClick={onOpenLibrary}
                    className="w-full"
                    variant="primary"
                >
                    Open Recipe Library
                </Button>
            </div>
        </div>
    );
});

export default RecipeModule;
