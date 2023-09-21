import { FC, useCallback, useState } from "react";
import {
    useGlobalSearch,
    useKeyPress,
    useView,
    useWidgetLib,
} from "src/api/hooks";
import { ETag, EItemsSortBy } from "src/api/services";
import {
    useGetWidgetsCategoryQuery,
    useGetWidgetsQuery,
} from "src/api/services/views/viewsEndpoints";
import { TUserViewWidget, TWidget } from "src/api/types";
import { recomputeWidgetsPos } from "src/api/utils/layoutUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import WidgetLibrary from "src/components/widget-library/WidgetLibrary";
import CONFIG from "src/config/config";
import { v4 as uuidv4 } from "uuid";

const { VIEWS } = CONFIG;

interface IWidgetLibContainerProps {
    layoutState: TUserViewWidget[][] | undefined;
}
const WidgetsLibContainer: FC<IWidgetLibContainerProps> = ({ layoutState }) => {
    const { selectedView, addWidgetsToCache } = useView();
    const { keywordSearchList } = useGlobalSearch();

    const { showWidgetLib, toggleWidgetLib } = useWidgetLib();

    const [filter, setFilter] = useState<string | undefined>();
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >();
    const [selectedWidget, setSelectedWidget] = useState<TWidget>();
    const [sortBy, setSortBy] = useState(EItemsSortBy.Name);

    const { currentData: widgets } = useGetWidgetsQuery(
        { sortBy },
        { refetchOnMountOrArgChange: true }
    );
    const { data: widgetsCategory } = useGetWidgetsCategoryQuery();

    const handleSelectWidget = useCallback(
        (widget: TWidget) => {
            setSelectedWidget(widget);
            if (selectedView && layoutState) {
                const widgetsCount = selectedView.data.widgets.length;
                const widgetCount = selectedView.data.widgets?.filter(
                    (cw) => cw.widget.slug === widget.slug
                ).length;
                const maxWidgets =
                    selectedView.data.max_widgets ?? VIEWS.MAX_WIDGETS;

                if (widget.max_per_view && widgetCount >= widget.max_per_view) {
                    toast(
                        `A maximum number of ${widget.max_per_view} ${widget.name} is allowed per board`,
                        {
                            type: EToastRole.Error,
                            status: "alert",
                        }
                    );
                    return;
                }

                if (widgetsCount >= maxWidgets) {
                    toast(
                        `A maximum of ${String(
                            maxWidgets
                        )} widgets is allowed per board`,
                        {
                            type: EToastRole.Error,
                            status: "alert",
                        }
                    );
                    return;
                }

                const shortestCol = layoutState
                    .map((a) => a.length)
                    .indexOf(Math.min(...layoutState.map((a) => a.length)));

                const newWidget: TUserViewWidget = {
                    id: 990, // will be replaced on save view - doesn't have to be unique on the frontend
                    hash: uuidv4(), // will be replaced on save view - needs to be unique
                    name: widget.name,
                    widget,
                    settings: widget.settings.map(({ setting }, id) => ({
                        setting: {
                            id: Number(id) + 1,
                            slug: setting.slug,
                            name: setting.slug,
                            setting_type: "tags",
                        },
                        tags: keywordSearchList?.map((k) => ({
                            ...k.tag,
                            tag_type: ETag.Global, // this is a new widget which should not persist any tags
                        })),
                        toggle_value: false,
                    })),
                    sort_order: selectedView.data.widgets.length,
                };
                // clone previous layout state
                const newLayoutState: TUserViewWidget[][] = [[]];
                for (let i = 0; i < layoutState.length; i += 1) {
                    newLayoutState[i] = [...layoutState[i]];
                }
                newLayoutState[shortestCol].push(newWidget);
                addWidgetsToCache(recomputeWidgetsPos(newLayoutState));
                scrollTo(0, document.body.scrollHeight);
            }
        },
        [addWidgetsToCache, keywordSearchList, layoutState, selectedView]
    );

    const handleFilter = (value: string) => {
        setFilter(value.toLowerCase());
    };

    const handleToggleWidgetLib = useCallback(() => {
        toggleWidgetLib();
        setFilter(undefined);
        setSelectedCategory(undefined);
    }, [toggleWidgetLib]);

    useKeyPress({
        targetKey: "Escape",
        callback: handleToggleWidgetLib,
        skip: !showWidgetLib,
    });

    if (showWidgetLib)
        return (
            <WidgetLibrary
                widgets={[...(widgets ?? [])]
                    .filter((w) => !w.hide_in_library)
                    .filter((w) => {
                        // filter by category. If no category is selected, show all widgets
                        return (
                            !selectedCategory ||
                            w.categories.some((c) => {
                                return c.slug === selectedCategory;
                            })
                        );
                    })
                    .filter((w) =>
                        filter
                            ? w.name.toLowerCase().includes(filter) ||
                              w.description.toLowerCase().includes(filter)
                            : true
                    )}
                categories={[...(widgetsCategory?.results || [])].sort(
                    (a, d) => a.sort_order - d.sort_order
                )}
                cachedWidgets={selectedView?.data.widgets?.map(
                    (sw) => sw.widget as TWidget
                )}
                sortBy={sortBy}
                onSortBy={setSortBy}
                onFilter={handleFilter}
                isLoading={widgets === undefined}
                toggleWidgetLib={handleToggleWidgetLib}
                selectedWidget={selectedWidget}
                selectedCategory={selectedCategory}
                handleSelectWidget={handleSelectWidget}
                handleSelectCategory={setSelectedCategory}
            />
        );
    return null;
};
export default WidgetsLibContainer;
