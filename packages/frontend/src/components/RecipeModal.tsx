import { FC, useState, useMemo, ChangeEvent } from "react";
import {
    Input,
    Modal,
    ModuleLoader,
    ModulePreview,
    ScrollBar,
    twMerge,
} from "@alphaday/ui-kit";
import { TRecipe, TRecipeTemplate } from "src/api/services/recipes/types";
import { ReactComponent as CloseSVG } from "src/assets/icons/close3.svg";
import { ReactComponent as RecipeSVG } from "src/assets/icons/grid.svg";
import { ReactComponent as TemplateSVG } from "src/assets/icons/other.svg";

interface IProps {
    showModal: boolean;
    onClose: () => void;
    recipes?: TRecipe[];
    templates?: TRecipeTemplate[];
    isLoading?: boolean;
}

type CategoryType = "recipes" | "templates";

export const RecipeModal: FC<IProps> = ({
    showModal,
    onClose,
    recipes = [],
    templates = [],
    isLoading = false,
}) => {
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryType>("recipes");
    const [searchFilter, setSearchFilter] = useState("");

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(e.target.value);
    };

    const filteredRecipes = useMemo(() => {
        if (!searchFilter) return recipes;
        return recipes.filter(
            (r) =>
                r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                r.description
                    ?.toLowerCase()
                    .includes(searchFilter.toLowerCase())
        );
    }, [recipes, searchFilter]);

    const filteredTemplates = useMemo(() => {
        if (!searchFilter) return templates;
        return templates.filter(
            (t) =>
                t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                t.description
                    ?.toLowerCase()
                    .includes(searchFilter.toLowerCase())
        );
    }, [templates, searchFilter]);

    const displayItems = useMemo(() => {
        return selectedCategory === "recipes"
            ? filteredRecipes
            : filteredTemplates;
    }, [selectedCategory, filteredRecipes, filteredTemplates]);

    const getCategoryLabel = () => {
        return selectedCategory === "recipes" ? "Recipes" : "Templates";
    };

    const getEmptyMessage = () => {
        return selectedCategory === "recipes"
            ? "No recipes found"
            : "No templates found";
    };

    const handleSelectRecipe = (item: TRecipe | TRecipeTemplate) => {
        // TODO: Handle recipe/template selection
        console.log("Selected:", item);
    };

    const renderContent = () => {
        if (isLoading) {
            return <ModuleLoader $height="60vh" />;
        }

        if (displayItems.length > 0) {
            return (
                <ScrollBar>
                    <div className="grid grid-cols-3 gap-2.5 pl-3">
                        {displayItems.map((item) => (
                            <div key={item.id} className="w-min max-w-min">
                                <ModulePreview
                                    previewImg={
                                        (item as TRecipeTemplate)
                                            .previewImage || item.name
                                    }
                                    title={item.name}
                                    description={item.description || ""}
                                    onClick={() => handleSelectRecipe(item)}
                                    selected={false}
                                    count={0}
                                    isMaxed={false}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="w-full h-10" />
                </ScrollBar>
            );
        }

        return (
            <div className="flex items-center fontGroup-highlightSemi justify-center h-full">
                {getEmptyMessage()}
            </div>
        );
    };

    return (
        <Modal onClose={onClose} showModal={showModal}>
            <div className="flex flex-col w-full h-full">
                <div className="bg-background text-primaryVariant100 bg-blend-soft-light py-2 px-4 border-b border-solid border-b-background rounded-[3px]">
                    <div className="w-full flex items-center justify-between">
                        <div>
                            <h6 className="m-0 inline-flex self-end fontGroup-highlightSemi uppercase text-primaryVariant100">
                                Recipe Library
                            </h6>
                        </div>
                        <div className="fontGroup-normal max-w-[370px] w-[80%]">
                            <Input
                                onChange={handleFilterChange}
                                id="recipe-search"
                                name="recipe-search"
                                placeholder="Search recipes and templates..."
                                height="28px"
                                className="outline-none border-none focus:outline-none focus:border-none bg-backgroundVariant200"
                            />
                        </div>
                        <div
                            className="fill-primaryVariant100 cursor-pointer h-[30px] self-center flex items-center"
                            role="button"
                            title="Close Recipe Library"
                            tabIndex={0}
                            onClick={onClose}
                        >
                            <CloseSVG fill="currentColor" />
                        </div>
                    </div>
                </div>

                <div className="flex bg-background h-full">
                    <ScrollBar className="min-w-[250px] bg-background fontGroup-highlightSemi pt-1.5">
                        <div
                            role="button"
                            tabIndex={0}
                            className={twMerge(
                                "flex flex-row items-center p-4 pl-[25px] text-primaryVariant100 mx-2 rounded-lg hover:text-primary hover:bg-backgroundVariant100 cursor-pointer [&>svg]:mr-4 [&>svg]:w-[18px] [&>svg]:h-[18px]",
                                selectedCategory === "recipes" &&
                                    "bg-backgroundBlue text-primary fontGroup-highlightSemi"
                            )}
                            onClick={() => setSelectedCategory("recipes")}
                        >
                            <RecipeSVG />
                            My Recipes ({recipes.length})
                        </div>
                        <div
                            role="button"
                            tabIndex={0}
                            className={twMerge(
                                "flex flex-row items-center p-4 pl-[25px] text-primaryVariant100 mx-2 rounded-lg hover:text-primary hover:bg-backgroundVariant100 cursor-pointer [&>svg]:mr-4 [&>svg]:w-[18px] [&>svg]:h-[18px]",
                                selectedCategory === "templates" &&
                                    "bg-backgroundBlue text-primary fontGroup-highlightSemi"
                            )}
                            onClick={() => setSelectedCategory("templates")}
                        >
                            <TemplateSVG />
                            Templates ({templates.length})
                        </div>
                    </ScrollBar>

                    <div className="w-full overflow-hidden h-full">
                        <div className="flex justify-between items-center px-3 pt-3 pb-2 text-primary font-normal">
                            <div className="fontGroup-highlightSemi">
                                <span>
                                    {displayItems.length} {getCategoryLabel()}
                                </span>
                            </div>
                        </div>
                        <div className="w-full h-[550px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
