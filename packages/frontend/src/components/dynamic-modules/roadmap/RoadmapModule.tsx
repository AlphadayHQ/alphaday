import { FC } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import CONFIG from "src/config/config";
import { TItem } from "src/types";
import { useDynamicWidgetHeight } from "../hooks/useDynamicWidgetHeight";
import { ERoadmapStatus } from "../types";
import RoadmapItem from "./RoadmapItem";

export interface IRoadmap {
    items: TItem[];
    widgetHeight: number;
    onAdjustWidgetHeight: React.Dispatch<React.SetStateAction<number>>;
}

const { WIDGET_HEIGHT } = CONFIG.WIDGETS.ROADMAP;

const sanitiseStatus: (s: number | string) => ERoadmapStatus = (s) => {
    const status = typeof s === "string" ? parseInt(s, 10) : s;
    if (status in ERoadmapStatus) return status;
    return ERoadmapStatus.Completed;
};

const RoadmapModule: FC<IRoadmap> = ({
    items,
    widgetHeight,
    onAdjustWidgetHeight,
}) => {
    const { initialItemsHeight, itemsHeight, setItemsHeight, setScrollRef } =
        useDynamicWidgetHeight({
            defaultHeight: WIDGET_HEIGHT,
            adjustHeightCallback: onAdjustWidgetHeight,
        });

    if (items.length < 1) {
        return <ModuleLoader $height={`${String(widgetHeight)}px`} />;
    }

    if (items.length > 0) {
        return (
            <div
                className="bg-background h-full flex flex-col flex-grow [&_scrollbar-container]:flex [&_scrollbar-container]:flex-col"
                style={{
                    height: `${Math.min(initialItemsHeight, widgetHeight)}px`,
                }}
            >
                <ScrollBar containerRef={setScrollRef}>
                    <div
                        className="overflow-hidden contents"
                        style={{
                            height: `${itemsHeight}px`,
                        }}
                    >
                        {items.map((item) => (
                            <RoadmapItem
                                key={item.id}
                                date={item.date}
                                title={item.name}
                                blockNo={parseInt(item.category, 10)}
                                desc={item.description}
                                status={sanitiseStatus(item.status)}
                                setItemsHeight={setItemsHeight}
                            />
                        ))}
                    </div>
                </ScrollBar>
            </div>
        );
    }

    return (
        <div className="flex w-full h-80 justify-center items-center">
            <p className="text-primary fontGroup-highlightSemi">
                No Data Found
            </p>
        </div>
    );
};

export default RoadmapModule;
