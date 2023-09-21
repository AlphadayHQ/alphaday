import { FC, ChangeEvent } from "react";
import {
    Input,
    ModuleLoader,
    ModulePreview,
    ScrollBar,
} from "@alphaday/ui-kit";
import { EItemsSortBy, TRemoteWidgetCategory } from "src/api/services";
import { TWidget } from "src/api/types";
import { ReactComponent as ChartSVG } from "src/assets/alphadayAssets/icons/chart.svg";
import { ReactComponent as CloseSVG } from "src/assets/alphadayAssets/icons/close3.svg";
import { ReactComponent as DefiSVG } from "src/assets/alphadayAssets/icons/defi.svg";
import { ReactComponent as WidgetsSVG } from "src/assets/alphadayAssets/icons/grid.svg";
import { ReactComponent as InvestingSVG } from "src/assets/alphadayAssets/icons/investing.svg";
import { ReactComponent as L2SVG } from "src/assets/alphadayAssets/icons/l2.svg";
import { ReactComponent as OtherSVG } from "src/assets/alphadayAssets/icons/other.svg";
import { ReactComponent as UsersSVG } from "src/assets/alphadayAssets/icons/users.svg";
import market from "src/assets/img/preview/marketModule2x.png";
import CONFIG from "src/config/config";
import { AlphaTabButton } from "../widgets/tabButtons/AlphaTabButton";
import {
    StyledCatItem,
    StyledContainer,
    StyledInput,
    StyledModal,
} from "./WidgetLibrary.style";

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
    sortBy: EItemsSortBy;
    /**
     * Widgets to display in the library
     */
    widgets: ReadonlyArray<TWidget> | undefined;
    /**
     * Currently selected widget
     */
    selectedWidget: TWidget | undefined;
    cachedWidgets: ReadonlyArray<TWidget> | undefined;
    categories: ReadonlyArray<TRemoteWidgetCategory>;
    selectedCategory: string | undefined;
    isLoading: boolean;
    /**
     * Handler to select a widget and add it to the view
     *
     * @param w
     */
    handleSelectWidget: (w: TWidget) => void;
    onFilter(filter: string): void;
    /**
     * Handler to sort the widgets
     *
     * @param sort - sort by `EItemsSortBy`
     */
    onSortBy(sort: EItemsSortBy): void;
    toggleWidgetLib: () => void;
    handleSelectCategory: (c: string | undefined) => void;
}
const WidgetLibrary: FC<IWidgetLibProps> = ({
    widgets,
    selectedWidget,
    handleSelectWidget,
    onFilter,
    toggleWidgetLib,
    cachedWidgets,
    categories,
    selectedCategory,
    handleSelectCategory,
    sortBy,
    onSortBy,
    isLoading,
}) => {
    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        onFilter(e.target.value);
    };

    if (widgets) {
        return (
            <StyledModal show onClose={toggleWidgetLib}>
                <div className=" bg-backgroundVariant300 text-primaryVariant100 bg-blend-soft-light p-[4.5px_9px_4.5px_15px] border-b-[1.2px_solid] border-background rounded-[3px]">
                    <div className="w-full flex items-center justify-between">
                        <div>
                            <h6 className="m-0 inline-flex self-end fontGroup-highlight uppercase text-primaryVariant100">
                                Widgets Library
                            </h6>
                        </div>
                        <StyledInput>
                            <Input
                                onChange={handleFilterChange}
                                id="widgetlib-search"
                                name="widgetlib-search"
                                placeholder="Quick Search..."
                            />
                        </StyledInput>
                        <div
                            className="fill-primaryVariant100 cursor-pointer h-[30px] self-center flex items-center"
                            role="button"
                            title="Close Widgets Library"
                            tabIndex={0}
                            onClick={toggleWidgetLib}
                        >
                            <CloseSVG fill="currentColor" />
                        </div>
                    </div>
                </div>
                {categories.length > 0 ? (
                    <StyledContainer>
                        <div className="cat-wrap">
                            <ScrollBar>
                                <StyledCatItem
                                    active={!selectedCategory}
                                    onClick={() =>
                                        handleSelectCategory(undefined)
                                    }
                                >
                                    <WidgetsSVG />
                                    All Widgets
                                </StyledCatItem>
                                {categories.map((cat) => {
                                    const icon = cat.slug.split(
                                        "_widget_category"
                                    )[0] as keyof typeof CAT_ICONS;
                                    return (
                                        <StyledCatItem
                                            key={cat.slug}
                                            active={
                                                selectedCategory === cat.slug
                                            }
                                            onClick={() =>
                                                handleSelectCategory(cat.slug)
                                            }
                                        >
                                            {icon in CAT_ICONS
                                                ? CAT_ICONS[icon]
                                                : CAT_ICONS.default}
                                            {cat.name}
                                        </StyledCatItem>
                                    );
                                })}
                            </ScrollBar>
                        </div>
                        <div className="modules">
                            <div className="header">
                                <div className="tabs" />
                                <div className="tabs">
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
                                                    <AlphaTabButton
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
                                                    </AlphaTabButton>
                                                </span>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                            {!isLoading ? (
                                <>
                                    <div className="modules-count">
                                        {widgets.length} Widgets
                                    </div>
                                    <div className="modules-list">
                                        {widgets.length > 0 ? (
                                            <ScrollBar>
                                                <div className="modules-wrap">
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
                                                                className="thumbnail"
                                                            >
                                                                <ModulePreview
                                                                    previewImg={
                                                                        w.icon ||
                                                                        market
                                                                    }
                                                                    title={
                                                                        w.name
                                                                    }
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
                                            <div className="no-modules">
                                                No widgets found in this
                                                category &#34;
                                                {categories?.find(
                                                    (c) =>
                                                        c.slug ===
                                                        selectedCategory
                                                )?.name || "All"}
                                                &#34;
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <ModuleLoader $height="100%" />
                            )}
                        </div>
                    </StyledContainer>
                ) : (
                    <ModuleLoader $height="600px" />
                )}
            </StyledModal>
        );
    }
    return null;
};

export default WidgetLibrary;
