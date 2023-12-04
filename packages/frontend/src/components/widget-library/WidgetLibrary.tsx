import { FC, ChangeEvent, FormEvent } from "react";
import {
    Input,
    Modal,
    ModuleLoader,
    ModulePreview,
    ScrollBar,
    TabButton,
    twMerge,
} from "@alphaday/ui-kit";
import { EItemsSortBy, TRemoteWidgetCategory } from "src/api/services";
import { TWidget, TWidgetMini } from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
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

const SORT_BUTTONS: {
    label: string;
    value: EItemsSortBy;
}[] = [
    {
        label: "(A-Z)",
        value: EItemsSortBy.Name,
    },
    {
        label: "Popular",
        value: EItemsSortBy.Popular,
    },
    {
        label: "New",
        value: EItemsSortBy.New,
    },
];

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
    onSortBy(sort: EItemsSortBy): void;
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

    const handleScrollEvent = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    return (
        <Modal onClose={onCloseWidgetLib} showModal={showWidgetLib}>
            <div className="flex flex-col w-full h-full">
                <div className="bg-background text-primaryVariant100 bg-blend-soft-light p-[4.5px_15px_4.5px_15px] border-b-[1.2px] border-solid border-b-background rounded-[3px]">
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
                                className="outline-none border-none focus:outline-none focus:border-none"
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
                    <div className="flex bg-backgroundVariant1500 h-full">
                        <ScrollBar className="min-w-[250px] bg-background fontGroup-highlight">
                            <div
                                role="button"
                                tabIndex={0}
                                className={twMerge(
                                    "flex flex-row items-center p-[16px_15px_16px_25px] text-primaryVariant100",
                                    !selectedCategory &&
                                        "bg-btnBackgroundVariant1400 text-primary",
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
                                            "flex flex-row items-center p-[16px_15px_16px_25px] text-primaryVariant100",
                                            selectedCategory === cat.slug &&
                                                "bg-btnBackgroundVariant1400 text-primary",
                                            "hover:text-primary cursor-pointer [&>svg]:mr-[15px] [&>svg]:w-[18px] [&>svg]:h-[18px]"
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

                        <div className="w-full overflow-hidden h-full pb-[120px]">
                            <div className="flex justify-between items-center p-[17px_25px] border-b border-borderLine text-primaryVariant100 font-normal">
                                <div className="flex justify-around items-center [&>span]:mr-[7px]" />
                                <div className="flex justify-around items-center [&>span]:mr-[7px] fontGroup-normal">
                                    {SORT_BUTTONS.length > 0 && (
                                        <>
                                            <span className="title">
                                                Sort by
                                            </span>
                                            {SORT_BUTTONS.map((nav) => (
                                                <span
                                                    key={String(nav.value)}
                                                    className="wrap"
                                                >
                                                    <TabButton
                                                        variant="small"
                                                        uppercase={false}
                                                        open={
                                                            nav.value === sortBy
                                                        }
                                                        onClick={() =>
                                                            onSortBy(nav.value)
                                                        }
                                                    >
                                                        {nav.label}
                                                    </TabButton>
                                                </span>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                            {!isLoading ? (
                                <>
                                    <div className="m-[25px_25px_10px] fontGroup-highlightSemi">
                                        {widgets.length} Widgets
                                    </div>
                                    {widgets.length > 0 ? (
                                        <ScrollBar onScroll={handleScrollEvent}>
                                            <div className="grid grid-cols-3 gap-2.5 pl-[15px] h-[60vh]">
                                                {widgets.map((w) => {
                                                    const widgetCount =
                                                        cachedWidgets?.filter(
                                                            (cw) =>
                                                                cw.slug ===
                                                                w.slug
                                                        ).length || 0;
                                                    return (
                                                        <div
                                                            key={`${String(
                                                                w.id
                                                            )}${
                                                                CONFIG.UI
                                                                    .NEW_WIDGET_IDENTIFIER
                                                            }`}
                                                            className="w-min max-w-min"
                                                        >
                                                            <ModulePreview
                                                                previewImg={
                                                                    w.icon ||
                                                                    market
                                                                }
                                                                title={w.name}
                                                                description={
                                                                    w.short_description
                                                                }
                                                                count={
                                                                    widgetCount
                                                                }
                                                                isMaxed={
                                                                    w.max_per_view !==
                                                                        null &&
                                                                    widgetCount >=
                                                                        w.max_per_view
                                                                }
                                                                onClick={() =>
                                                                    handleSelectWidget(
                                                                        w
                                                                    )
                                                                }
                                                                selected={
                                                                    w.slug ===
                                                                    selectedWidget?.slug
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </ScrollBar>
                                    ) : (
                                        <div className="flex items-center justify-center h-[60vh]">
                                            No widgets found in this category
                                            {` (${
                                                categories?.find(
                                                    (c) =>
                                                        c.slug ===
                                                        selectedCategory
                                                )?.name || "All"
                                            })`}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <ModuleLoader $height="60vh" />
                            )}
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
