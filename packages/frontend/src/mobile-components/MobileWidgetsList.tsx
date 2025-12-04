import { FC, FormEvent, useCallback, ChangeEvent } from "react";
import {
    ModuleLoader,
    ModulePreview,
    SortBy,
    TabsBar,
    Input,
} from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    EItemsSortBy,
    TRemoteWidgetCategory,
    TRemoteWidgetMini,
} from "src/api/services";
import { TWidget, TWidgetMini } from "src/api/types/views";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { generateSortOptions } from "src/api/utils/sortOptions";
import {
    ETranslationValues,
    translateLabels,
    TTranslationValues,
} from "src/api/utils/translationUtils";
import { ReactComponent as EmptySVG } from "src/assets/icons/empty.svg";
import market from "src/assets/img/preview/marketModule2x.png";

const DEFAULT_TAB_OPTION = {
    label: "All",
    value: "all",
};

const NoWidgets = ({ msg }: { msg: string }) => (
    <div className="w-full flex flex-col items-center pt-14">
        <div>
            <EmptySVG className="w-10 h-10 text-primaryVariant100" />
        </div>
        <p className="mt-4 font-normal text-primaryVariant100 text-center px-4">
            {msg}
        </p>
    </div>
);

interface IMobileWidgetsList {
    selectedCategory: string | undefined;
    widgets: ReadonlyArray<TRemoteWidgetMini> | undefined;
    categories: ReadonlyArray<TRemoteWidgetCategory> | undefined;
    sortBy: EItemsSortBy;
    onSortBy(sort: string): void;
    onSelectWidget: (widgetId: number) => void;
    onCategorySelect: (category: string | undefined) => void;
    handlePaginate: (type: "next" | "previous") => void;
    onFilter: (filter: string) => void;
    cachedWidgets: ReadonlyArray<TWidget> | undefined;
    selectedWidget: TWidgetMini | undefined;
}

const MobileWidgetsList: FC<IMobileWidgetsList> = ({
    sortBy,
    widgets,
    categories,
    selectedCategory,
    onSortBy,
    onSelectWidget,
    onCategorySelect,
    handlePaginate,
    onFilter,
    cachedWidgets,
    selectedWidget,
}) => {
    const sortOptions = generateSortOptions();
    const { t } = useTranslation();

    const tabOptions =
        categories?.map((cat) =>
            cat.slug === "default"
                ? DEFAULT_TAB_OPTION
                : {
                      label: cat.name,
                      value: cat.slug,
                  }
        ) || [];

    const handleScrollEvent = useCallback(
        ({ currentTarget }: FormEvent<HTMLElement>) => {
            if (shouldFetchMoreItems(currentTarget)) {
                handlePaginate("next");
            }
        },
        [handlePaginate]
    );

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        onFilter(e.target.value);
    };

    const sortByKey =
        Object.keys(EItemsSortBy)[Object.values(EItemsSortBy).indexOf(sortBy)];

    const selectedSortValue =
        Object.keys(ETranslationValues).indexOf(sortByKey.toLowerCase()) !== -1
            ? translateLabels(sortByKey.toLowerCase() as TTranslationValues, {
                  isKey: true,
              })
            : sortByKey;

    if (categories === undefined || widgets === undefined) {
        return <ModuleLoader $height="100%" />;
    }

    return (
        <div
            data-testid="mobile-widgets-list"
            className="w-full h-full overflow-y-auto overscroll-contain bg-background"
            onScroll={handleScrollEvent}
        >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b border-borderLine">
                <div className="px-4 py-3">
                    <div className="fontGroup-normal w-full">
                        <Input
                            onChange={handleFilterChange}
                            id="widgetlib-search"
                            name="widgetlib-search"
                            placeholder={t(
                                "navigation.widgetsLibrary.searchBarPlaceholder"
                            )}
                            height="36px"
                            className="outline-none border-none focus:outline-none focus:border-none bg-backgroundVariant200"
                        />
                    </div>
                </div>
            </div>

            {/* Categories and Widgets Section */}
            <div className="pb-4">
                <div className="flex flex-col gap-2 mb-2">
                    <TabsBar
                        options={tabOptions}
                        onChange={(name) => {
                            onCategorySelect(name);
                        }}
                        selectedOption={
                            selectedCategory
                                ? {
                                      label: selectedCategory,
                                      value: selectedCategory,
                                  }
                                : DEFAULT_TAB_OPTION
                        }
                    />
                    <div className="flex justify-between items-center px-1">
                        <div className="fontGroup-highlightSemi text-primary">
                            <span>
                                {widgets.length} {t("navigation.widgets")}
                            </span>
                        </div>
                        <SortBy
                            selected={selectedSortValue}
                            onSortBy={onSortBy}
                            options={sortOptions}
                            label={t("navigation.sortBy")}
                        />
                    </div>
                </div>

                {widgets.length === 0 ? (
                    <NoWidgets
                        msg={`No widgets found${
                            selectedCategory
                                ? ` in ${
                                      categories?.find(
                                          (c) => c.slug === selectedCategory
                                      )?.name || "this category"
                                  }`
                                : ""
                        }`}
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {widgets.map((widget) => {
                            const widgetCount =
                                cachedWidgets?.filter(
                                    (cw) => cw.slug === widget.slug
                                ).length || 0;
                            return (
                                <div
                                    title={widget.name}
                                    key={widget.id}
                                    className="w-full"
                                    tabIndex={0}
                                    role="button"
                                    onClick={() => onSelectWidget(widget.id)}
                                >
                                    <ModulePreview
                                        previewImg={widget.icon || market}
                                        title={widget.name}
                                        description={widget.short_description}
                                        count={widgetCount}
                                        onClick={() =>
                                            onSelectWidget(widget.id)
                                        }
                                        selected={
                                            widget.slug === selectedWidget?.slug
                                        }
                                        isMaxed={
                                            widget.max_per_view !== null &&
                                            widgetCount >= widget.max_per_view
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileWidgetsList;
