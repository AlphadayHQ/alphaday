import React, { FC } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { TAgendaItem } from "src/api/types/agenda";
import { makeRepeated } from "src/api/utils/itemUtils";
import { useDynamicWidgetHeight } from "src/components/dynamic-modules/hooks/useDynamicWidgetHeight";
import { ITEM_COLORS } from "src/components/item-colors";
import CONFIG from "src/config/config";
import AgendaItem from "./AgendaItem";

interface IAgenda {
    widgetHeight: number;
    items: TAgendaItem[];
    isLoadingItems: boolean;
    onAdjustWidgetHeight: React.Dispatch<React.SetStateAction<number>>;
}

const { WIDGET_HEIGHT } = CONFIG.WIDGETS.TABLE;

const AgendaModule: FC<IAgenda> = ({
    widgetHeight,
    items,
    isLoadingItems,
    onAdjustWidgetHeight,
}) => {
    const { initialItemsHeight, itemsHeight, setItemsHeight, setScrollRef } =
        useDynamicWidgetHeight({
            defaultHeight: WIDGET_HEIGHT,
            adjustHeightCallback: onAdjustWidgetHeight,
        });

    const uniqueCategories = [...new Set(items.map((item) => item.category))];
    const categoryColors = makeRepeated(ITEM_COLORS, uniqueCategories.length);
    return (
        <div
            className="block border-none min-h-[110px] relative"
            style={{
                height: `${String(
                    // height of the table should not be greater than max content: ;
                    Math.min(initialItemsHeight, widgetHeight) ?? WIDGET_HEIGHT
                )}px`,
            }}
        >
            {isLoadingItems ? (
                <ModuleLoader $height={`${String(widgetHeight)}px`} />
            ) : (
                <ScrollBar
                    className="ml-2 mr-[3px]"
                    containerRef={setScrollRef}
                >
                    <div
                        className="contents overflow-hidden [&>*:first-child]:pt-3"
                        style={{
                            height: `${String(itemsHeight)}px`,
                        }}
                    >
                        {items.map((item) => (
                            <AgendaItem
                                key={item.id}
                                item={item}
                                setItemsHeight={setItemsHeight}
                                catColor={
                                    categoryColors[
                                        uniqueCategories.indexOf(item.category)
                                    ]
                                }
                            />
                        ))}
                    </div>
                </ScrollBar>
            )}
        </div>
    );
};

export default AgendaModule;
