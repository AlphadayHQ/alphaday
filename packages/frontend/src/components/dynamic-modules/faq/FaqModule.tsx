import React, { FC } from "react";
import { CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import { useDynamicWidgetHeight } from "src/components/dynamic-modules/hooks/useDynamicWidgetHeight";
import CONFIG from "src/config/config";
import globalMessages from "src/globalMessages";
import { TItem } from "src/types";
import FaqItem from "./FaqItem";

interface IAgenda {
    widgetHeight: number;
    items: TItem[];
    onAdjustWidgetHeight: React.Dispatch<React.SetStateAction<number>>;
}

const { WIDGET_HEIGHT } = CONFIG.WIDGETS.FAQ;

const FaqModule: FC<IAgenda> = ({
    widgetHeight,
    items,
    onAdjustWidgetHeight,
}) => {
    const { initialItemsHeight, itemsHeight, setItemsHeight, setScrollRef } =
        useDynamicWidgetHeight({
            defaultHeight: WIDGET_HEIGHT,
            adjustHeightCallback: onAdjustWidgetHeight,
        });

    return (
        <div
            className="border-none block relative min-h-[110px]"
            style={{
                // height of the table should not be greater than max-content
                height: `${Math.min(initialItemsHeight, widgetHeight)}px`,
            }}
        >
            {!items || items?.length < 1 ? (
                <CenteredBlock>
                    <p>{globalMessages.queries.noResults}</p>
                </CenteredBlock>
            ) : (
                <ScrollBar containerRef={setScrollRef}>
                    <div
                        className="contents overflow-hidden"
                        style={{
                            height: `${itemsHeight}px`,
                        }}
                    >
                        {items.map((e) => (
                            <FaqItem
                                key={e?.id || e.name}
                                item={e}
                                setItemsHeight={setItemsHeight}
                            />
                        ))}
                    </div>
                </ScrollBar>
            )}
        </div>
    );
};

export default FaqModule;
