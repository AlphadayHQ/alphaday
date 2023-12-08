import { FC, ChangeEvent, FormEvent, useCallback } from "react";
import {
    Input,
    Modal,
    ModuleLoader,
    ModulePreview,
    ScrollBar,
    SortBy,
    twMerge,
} from "@alphaday/ui-kit";
import { EItemsSortBy, TRemoteWidgetCategory } from "src/api/services";
import { TWidget, TWidgetMini } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { getSortOptionsArray } from "src/api/utils/sortOptions";
import { ReactComponent as ChartSVG } from "src/assets/icons/chart.svg";
import { ReactComponent as CloseSVG } from "src/assets/icons/close3.svg";
import { ReactComponent as DefiSVG } from "src/assets/icons/defi.svg";
import { ReactComponent as WidgetsSVG } from "src/assets/icons/grid.svg";
import { ReactComponent as InvestingSVG } from "src/assets/icons/investing.svg";
import { ReactComponent as L2SVG } from "src/assets/icons/l2.svg";
import { ReactComponent as OtherSVG } from "src/assets/icons/other.svg";
import { ReactComponent as UsersSVG } from "src/assets/icons/users.svg";
import market from "src/assets/img/preview/marketModule2x.png";
import CONFIG from "src/config/config";

const CAT_ICONS = {
    defi: <DefiSVG />,
    trading: <ChartSVG />,
    investing: <InvestingSVG />,
    dao: <UsersSVG />,
    default: <OtherSVG />,
    layer_2: <L2SVG />,
};

interface IWidgetLibProps {
    showWidgetLib: boolean;
    sortBy: EItemsSortBy;
    /**
     * Widgets to display in the library
     */
    widgets: ReadonlyArray<TWidgetMini>;
    /**
     * Currently selected widget
     */
    selectedWidget: TWidgetMini | undefined;
    cachedWidgets: ReadonlyArray<TWidget> | undefined;
    categories: ReadonlyArray<TRemoteWidgetCategory>;
    selectedCategory: string | undefined;
    isLoading: boolean;
    /**
     * Handler to select a widget and add it to the view
     *
     * @param w
     */
    handleSelectWidget: (w: TWidgetMini) => void;
    onFilter(filter: string): void;
    /**
     * Handler to sort the widgets
     *
     * @param sort - sort by `EItemsSortBy`
     */
    onSortBy(sort: string): void;
    onCloseWidgetLib: () => void;
    handleSelectCategory: (c: string | undefined) => void;
    handlePaginate: (type: "next" | "previous") => void;
}

const WidgetLibrary: FC<IWidgetLibProps> = ({
    showWidgetLib,
    widgets,
    selectedWidget,
    handleSelectWidget,
    onFilter,
    onCloseWidgetLib,
    cachedWidgets,
    categories,
    selectedCategory,
    handleSelectCategory,
    sortBy,
    onSortBy,
    isLoading,
    handlePaginate,
}) => {
    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        onFilter(e.target.value);
    };

    const handleScrollEvent = useCallback(
        ({ currentTarget }: FormEvent<HTMLElement>) => {
            if (shouldFetchMoreItems(currentTarget)) {
                handlePaginate("next");
            }
        },
        [handlePaginate]
    );

    const sortByKey =
        Object.keys(EItemsSortBy)[Object.values(EItemsSortBy).indexOf(sortBy)];

    const renderModulePreview = useCallback(
        (widget: TWidgetMini) => {
            const widgetCount =
                cachedWidgets?.filter((cw) => cw.slug === widget.slug).length ||
                0;
            return (
                <div
                    key={`${String(widget.id)}${
                        CONFIG.UI.NEW_WIDGET_IDENTIFIER
                    }`}
                    className="w-min max-w-min"
                >
                    <ModulePreview
                        previewImg={widget.icon || market}
                        title={widget.name}
                        description={widget.short_description}
                        count={widgetCount}
                        isMaxed={
                            widget.max_per_view !== null &&
                            widgetCount >= widget.max_per_view
                        }
                        onClick={() => handleSelectWidget(widget)}
                        selected={widget.slug === selectedWidget?.slug}
                    />
                </div>
            );
        },
        [cachedWidgets, handleSelectWidget, selectedWidget]
    );

    const renderContent = useCallback(() => {
        if (isLoading) {
            return <ModuleLoader $height="60vh" />;
        }

        if (widgets.length > 0) {
            return (
                <ScrollBar onScroll={handleScrollEvent}>
                    <div className="grid grid-cols-3 gap-2.5 pl-3">
                        {widgets.map(renderModulePreview)}
                    </div>
                    <div className="w-full h-10" />
                </ScrollBar>
            );
        }

        return (
            <div className="flex items-center fontGroup-highlightSemi justify-center h-full">
                No widgets found in this category
                {` (${
                    categories?.find((c) => c.slug === selectedCategory)
                        ?.name || "All"
                })`}
            </div>
        );
    }, [
        categories,
        handleScrollEvent,
        isLoading,
        renderModulePreview,
        selectedCategory,
        widgets,
    ]);

    return (
        <Modal onClose={onCloseWidgetLib} showModal={showWidgetLib}>
            <div className="flex flex-col w-full h-full">
                <div className="bg-background text-primaryVariant100 bg-blend-soft-light py-2 px-4 border-b border-solid border-b-background rounded-[3px]">
                    <div className="w-full flex items-center justify-between">
                        <div>
                            <h6 className="m-0 inline-flex self-end fontGroup-highlight uppercase text-primaryVariant100">
                                Widgets Library
                            </h6>
                        </div>
                        <div className="fontGroup-normal max-w-[370px] w-[80%]">
                            <Input
                                onChange={handleFilterChange}
                                id="widgetlib-search"
                                name="widgetlib-search"
                                placeholder="Quick Search..."
                                height="28px"
                                className="outline-none border-none focus:outline-none focus:border-none bg-backgroundVariant200"
                            />
                        </div>
                        <div
                            className="fill-primaryVariant100 cursor-pointer h-[30px] self-center flex items-center"
                            role="button"
                            title="Close Widgets Library"
                            tabIndex={0}
                            onClick={onCloseWidgetLib}
                        >
                            <CloseSVG fill="currentColor" />
                        </div>
                    </div>
                </div>
                {categories.length > 0 ? (
                    <div className="flex bg-background h-full">
                        <ScrollBar className="min-w-[250px] bg-background fontGroup-highlight pt-1.5">
                            <div
                                role="button"
                                tabIndex={0}
                                className={twMerge(
                                    "flex flex-row items-center p-[16px_15px_16px_25px] text-primaryVariant100 mx-2 rounded-lg",
                                    !selectedCategory &&
                                        "bg-btnBackgroundVariant1400 text-primary fontGroup-highlightSemi",
                                    "hover:text-primary cursor-pointer [&>svg]:mr-[15px] [&>svg]:w-[18px] [&>svg]:h-[18px]"
                                )}
                                onClick={() => handleSelectCategory(undefined)}
                            >
                                <WidgetsSVG />
                                All Widgets
                            </div>
                            {categories.map((cat) => {
                                const icon = cat.slug.split(
                                    "_widget_category"
                                )[0] as keyof typeof CAT_ICONS;
                                return (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className={twMerge(
                                            "flex flex-row items-center p-[16px_15px_16px_25px] text-primaryVariant100 mx-2 rounded-lg hover:text-primary hover:bg-backgroundVariant100 cursor-pointer [&>svg]:mr-[15px] [&>svg]:w-[18px] [&>svg]:h-[18px]",
                                            selectedCategory === cat.slug &&
                                                "bg-btnBackgroundVariant1400 text-primary fontGroup-highlightSemi"
                                        )}
                                        key={cat.slug}
                                        onClick={() =>
                                            handleSelectCategory(cat.slug)
                                        }
                                    >
                                        {icon in CAT_ICONS
                                            ? CAT_ICONS[icon]
                                            : CAT_ICONS.default}
                                        {cat.name}
                                    </div>
                                );
                            })}
                        </ScrollBar>

                        <div className="w-full overflow-hidden h-full">
                            <div className="flex justify-between items-center px-3 pt-3 pb-2 text-primary font-normal">
                                <div className="fontGroup-highlightSemi">
                                    <span>{widgets.length} Widgets</span>
                                </div>
                                <SortBy
                                    selected={sortByKey}
                                    onSortBy={onSortBy}
                                    options={getSortOptionsArray()}
                                />
                            </div>
                            <div className="w-full h-[550px]">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <ModuleLoader $height="calc(85vh - 100px)" />
                )}
            </div>
        </Modal>
    );
};

export default WidgetLibrary;
