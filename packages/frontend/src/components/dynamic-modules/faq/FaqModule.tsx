import React, { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import ScrollBar from "react-perfect-scrollbar";
import { useDynamicWidgetHeight } from "src/components/dynamic-modules/hooks/useDynamicWidgetHeight";
import CONFIG from "src/config/config";
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
        <span
            className="border-none block relative min-h-[110px] [&:nth-of-type(1)]:pt-[30px] [&:nth-of-type(1)>.line]:-bottom-3 [&:nth-of-type(1)>.line]:h-full [&:nth-of-type(1)>.line]:top-auto"
            style={{
                // height of the table should not be greater than max-content
                height: `${Math.min(initialItemsHeight, widgetHeight)}px`,
            }}
        >
            {!items || items?.length < 1 ? (
                <ModuleLoader $height={`${String(widgetHeight)}px`} />
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
        </span>
    );
};

export default FaqModule;
