import { FC, memo } from "react";
import { ModuleLoader, Button } from "@alphaday/ui-kit";
import { TRecipe, TRecipeTemplate } from "src/api/services/recipes/types";

interface IRecipeModule {
    recipes: TRecipe[] | undefined;
    templates: TRecipeTemplate[] | undefined;
    isLoadingRecipes: boolean;
    widgetHeight: number;
    onOpenLibrary: () => void;
}

const RecipeModule: FC<IRecipeModule> = memo(function RecipeModule({
    recipes,
    templates,
    isLoadingRecipes,
    widgetHeight,
    onOpenLibrary,
}) {
    if (isLoadingRecipes || recipes === undefined) {
        return <ModuleLoader $height={`${widgetHeight}px`} />;
    }

    const activeRecipes = recipes.filter((recipe) => recipe.isActive);
    const totalRecipes = recipes.length;
    const totalTemplates = templates?.length || 0;

    return (
        <div className="flex flex-col h-full p-4 pt-2">
            <div className="flex-1 flex flex-col justify-center gap-6">
                <div className="flex gap-4">
                    <div className="flex flex-col justify-center items-center border border-borderLine box-border rounded-lg min-w-[90px] w-full p-0 h-[91px]">
                        <h6 className="fontGroup-support text-center uppercase mb-2 text-secondaryOrange">
                            Your Recipes
                        </h6>
                        <div className="whitespace-nowrap text-center">
                            <p className="fontGroup-major text-primary mb-0 text-center">
                                {totalRecipes}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center border border-borderLine box-border rounded-lg min-w-[90px] w-full p-0 h-[91px]">
                        <h6 className="fontGroup-support text-center uppercase mb-2 text-success">
                            Active Recipes
                        </h6>
                        <div className="whitespace-nowrap text-center">
                            <p className="fontGroup-major text-primary mb-0 text-center">
                                {activeRecipes.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center border border-borderLine box-border rounded-lg min-w-[90px] w-full p-0 h-[91px]">
                        <h6 className="fontGroup-support text-center uppercase mb-2 text-primaryVariant100">
                            Templates
                        </h6>
                        <div className="whitespace-nowrap text-center">
                            <p className="fontGroup-major text-primary mb-0 text-center">
                                {totalTemplates}
                            </p>
                        </div>
                    </div>
                </div>

                {totalRecipes > 0 && (
                    <div className="">
                        <p className="fontGroup-normal text-primaryVariant200 m-0 mb-2">
                            Recent Recipes
                        </p>
                        <div className="space-y-2">
                            {recipes.slice(0, 3).map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="bg-backgroundVariant100 rounded-lg p-4 border border-borderLine"
                                >
                                    <div
                                        key={recipe.id}
                                        className="flex justify-between items-center pb-2"
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
                                    <p className="fontGroup-normal text-primaryVariant200">
                                        {recipe.description}
                                    </p>
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
                    Add A Recipe
                </Button>
            </div>
        </div>
    );
});

export default RecipeModule;
