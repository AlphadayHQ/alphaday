import { FC, FormEvent } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { useWidgetSize } from "src/api/hooks";
import {
    TCustomLayoutEntry,
    TCustomRowProps,
    TCustomItem,
} from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { TableHeader, TableRow } from "./TableComponents";

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
    const widgetSize = useWidgetSize([450]);
    const isCompactMode = widgetSize === "sm" || columns.length > 5;

    const handleScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    const addLinkColumn = rowProps?.uri_ref !== undefined;

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
        <div className="h-25">
            <TableHeader layout={columns} addExtraColumn={addLinkColumn} />
            <ScrollBar onScroll={handleScroll}>
                {items.map((item) => {
                    return (
                        <TableRow
                            columnsLayout={columns}
                            rowData={item}
                            rowProps={rowProps}
                            key={item.id}
                        />
                    );
                })}
            </ScrollBar>
        </div>
    );
};

export default CustomTableModule;
