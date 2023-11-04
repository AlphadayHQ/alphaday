import { twMerge } from "@alphaday/ui-kit";
import { TRemoteCustomLayoutEntry, TRemoteFormat } from "src/api/services";
import { TCustomItem } from "src/api/types";
import {
    formatCustomDataField,
    evaluateTemplate,
    getColumnJustification,
} from "src/api/utils/customDataUtils";

interface ITableCellProps {
    children?: React.ReactNode;
    format?: TRemoteFormat;
    isHeader?: boolean;
    width?: number;
    justify?: "left" | "center" | "right";
}
export const TableCell: React.FC<ITableCellProps> = ({
    children,
    format,
    isHeader,
    width,
    justify,
}) => (
    <div
        className={twMerge(
            "flex flex-1",
            format && getColumnJustification(format, justify),
            width ? `flex-${width}-${width}-0%` : "flex-1",
            isHeader && "uppercase"
        )}
    >
        {children}
    </div>
);

export const TableHeader: React.FC<{
    layout: TRemoteCustomLayoutEntry[];
}> = ({ layout }) => {
    return (
        <div className="flex flex-row py-2 px-5">
            {layout.map((columnLayout) => (
                <TableCell
                    format={columnLayout.format}
                    justify={columnLayout.justify}
                    isHeader
                    width={columnLayout.width}
                >
                    {columnLayout.title}
                </TableCell>
            ))}
        </div>
    );
};

interface ITableRowProps {
    columnsLayout: TRemoteCustomLayoutEntry[];
    rowData: TCustomItem;
}

export const TableRow: React.FC<ITableRowProps> = ({
    columnsLayout,
    rowData,
}) => {
    return (
        <div className="flex flex-row py-2 px-5">
            {columnsLayout.map((column) => {
                if (column.hidden) return null;
                const rawValue =
                    column.template !== undefined
                        ? evaluateTemplate(column.template, rowData)
                        : undefined;
                const formattedValue =
                    rawValue !== undefined
                        ? formatCustomDataField({
                              rawField: rawValue,
                              format: column.format,
                          })
                        : undefined;
                const cellLink =
                    column.uri_ref && rowData[column.uri_ref]
                        ? String(rowData[column.uri_ref])
                        : undefined;
                const imageUri =
                    column.image_uri_ref && rowData[column.image_uri_ref]
                        ? String(rowData[column.image_uri_ref])
                        : undefined;
                return (
                    <TableCell
                        width={column.width}
                        format={column.format}
                        justify={column.justify}
                    >
                        {formattedValue?.field}
                    </TableCell>
                );
            })}
        </div>
    );
};
