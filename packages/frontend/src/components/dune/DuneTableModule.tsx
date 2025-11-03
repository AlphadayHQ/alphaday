import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    TCustomLayoutEntry,
    TCustomRowProps,
    TCustomItem,
} from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import CONFIG from "src/config";
import { GridBasedTable } from "../custom-modules/TableComponents";

const { WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT } = CONFIG.WIDGETS.TABLE;
const HEADER_HEIGHT = 22;

interface IDuneTableProps {
    items: TCustomItem[];
    columns: TCustomLayoutEntry[];
    rowProps: TCustomRowProps | undefined;
    widgetHeight: number;
    isLoadingItems: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    setWidgetHeight: (size: number) => void;
}

const DuneTableModule: FC<IDuneTableProps> = ({
    items,
    columns,
    rowProps,
    widgetHeight,
    isLoadingItems,
    handlePaginate,
    setWidgetHeight,
}) => {
    const { t } = useTranslation();
    const [scrollRef, setScrollRef] = useState<HTMLElement | undefined>();
    const prevScrollRef = useRef<HTMLElement | undefined>();

    useEffect(() => {
        if (scrollRef !== prevScrollRef.current) {
            if (scrollRef) {
                const height =
                    Array.from(scrollRef.children).reduce(
                        (partialSum, child) => partialSum + child.clientHeight,
                        0
                    ) + HEADER_HEIGHT;
                // there seems to be a weird case where the scrollRef is valid,
                // but the height of the items is 0, so we end up with
                // height = HEADER_HEIGHT;
                if (height > HEADER_HEIGHT) {
                    setWidgetHeight(Math.min(height, DEFAULT_WIDGET_HEIGHT));
                }
            }
            prevScrollRef.current = scrollRef;
        }
    }, [scrollRef, prevScrollRef, setWidgetHeight]);

    const handleScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    if (isLoadingItems) {
        return <ModuleLoader $height={`${widgetHeight}px`} />;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-auto h-300 justify-center items-center">
                <p>{t("others.noItemsFound")}</p>
            </div>
        );
    }

    // if (useColumnLayout) {
    return (
        <div className="h-25 overflow-x-auto overflow-y-hidden">
            <ScrollBar
                onScroll={handleScroll}
                className="pl-2 pr-[3px]"
                containerRef={setScrollRef}
                style={{
                    height: widgetHeight,
                }}
            >
                <GridBasedTable
                    columnsLayout={columns}
                    items={items}
                    rowProps={rowProps}
                />
            </ScrollBar>
        </div>
    );
};

export default DuneTableModule;
