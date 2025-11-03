import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { useWidgetBreakpoints } from "src/api/hooks";
import {
    TCustomLayoutEntry,
    TCustomRowProps,
    TCustomItem,
} from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import CONFIG from "src/config";
import { CompactTableRow, TableHeader, TableRow } from "./TableComponents";

const { WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT } = CONFIG.WIDGETS.TABLE;
const HEADER_HEIGHT = 22;
// allow standard layout for tables of up to STD_LAYOUT_MAX_SIZE columns
const STD_LAYOUT_MAX_SIZE = 4;

interface ICustomTableProps {
    items: TCustomItem[];
    columns: TCustomLayoutEntry[];
    rowProps: TCustomRowProps | undefined;
    widgetHeight: number;
    isLoadingItems: boolean;
    isHeaderOnlyMode?: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    setWidgetHeight: (size: number) => void;
}

const CustomTableModule: FC<ICustomTableProps> = ({
    items,
    columns,
    rowProps,
    widgetHeight,
    isLoadingItems,
    handlePaginate,
    setWidgetHeight,
    isHeaderOnlyMode,
}) => {
    const { t } = useTranslation();
    const widgetSize = useWidgetBreakpoints([500]);
    const isCompactMode = isHeaderOnlyMode
        ? false
        : widgetSize === "sm" || columns.length > STD_LAYOUT_MAX_SIZE;
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

    const addLinkColumn = rowProps?.uri_ref !== undefined;

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

    return (
        <div className="h-25 overflow-x-auto overflow-y-hidden">
            {!isCompactMode && (
                <div className="min-w-fit">
                    <TableHeader
                        layout={columns}
                        addExtraColumn={addLinkColumn}
                    />
                </div>
            )}
            <ScrollBar
                onScroll={handleScroll}
                className="divide-y divide-solid divide-borderLine pl-2 pr-[3px] overflow-x-visible"
                containerRef={setScrollRef}
                style={{
                    height: widgetHeight - HEADER_HEIGHT,
                }}
            >
                <div className="min-w-fit">
                    {items.map((item) => {
                        return (
                            // return !isCompactMode ? (
                            //     <CompactTableRow
                            //         columnsLayout={columns}
                            //         rowData={item}
                            //         rowProps={rowProps}
                            //         key={item.id}
                            //     />
                            // ) : (
                            <TableRow
                                columnsLayout={columns}
                                rowData={item}
                                rowProps={rowProps}
                                key={item.id}
                            />
                        );
                    })}
                </div>
            </ScrollBar>
        </div>
    );
};

export default CustomTableModule;
