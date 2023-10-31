import { FC, useState, FormEvent, useMemo, useRef } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { useWidgetSize } from "src/api/hooks";
import {
    TCustomLayoutEntry,
    TCustomRowProps,
    TCustomItem,
} from "src/api/types";
import { getColumnJustification } from "src/api/utils/customDataUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import CONFIG from "src/config/config";
import { TableHeader, TableRow } from "./TableComponents";

const { WIDGET_HEIGHT } = CONFIG.WIDGETS.TABLE;
const HEADER_HEIGHT = 37;

interface ICustomTableProps {
    items: TCustomItem[];
    columns: TCustomLayoutEntry[];
    rowProps: TCustomRowProps | undefined;
    widgetHeight: number;
    isLoadingItems: boolean;
    handlePaginate: (type: "next" | "previous") => void;
}

const CustomTableModule: FC<ICustomTableProps> = ({
    items,
    columns,
    rowProps,
    widgetHeight,
    isLoadingItems,
    handlePaginate,
}) => {
    const headerRef = useRef<HTMLDivElement>(null);
    const [scrollRef, setScrollRef] = useState<HTMLElement | null>(null);
    const widgetSize = useWidgetSize([450]);
    const isCompactMode = widgetSize === "sm" || columns.length > 5;

    const maxHeight = useMemo(
        () =>
            scrollRef
                ? Array.from(scrollRef.children).reduce(
                      (partialSum, child) => partialSum + child.clientHeight,
                      0
                  ) + 7 // 7px added to hide scrollbar, [second])
                : WIDGET_HEIGHT,
        [scrollRef]
    );

    const handleScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    const addLinkColumn = rowProps?.uri_ref !== undefined;

    const headerHeight = headerRef.current?.clientHeight || HEADER_HEIGHT;

    if (isLoadingItems) {
        return <ModuleLoader $height={`${String(widgetHeight)}px`} />;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-auto h-300 justify-center items-center">
                <p>No Items Found</p>
            </div>
        );
    }

    return (
        <>
            <TableHeader layout={columns} />
            <div>
                <ScrollBar onScroll={handleScroll} containerRef={setScrollRef}>
                    {items.map((item) => {
                        return (
                            <TableRow
                                columnsLayout={columns}
                                rowData={item}
                                key={item.id}
                            />
                        );
                    })}
                </ScrollBar>
            </div>
        </>
    );
};

export default CustomTableModule;
