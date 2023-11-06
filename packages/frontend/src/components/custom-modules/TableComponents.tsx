import { twMerge } from "@alphaday/ui-kit";
import {
    TRemoteCustomLayoutEntry,
    TRemoteCustomRowProps,
    TRemoteFormat,
} from "src/api/services";
import { TCustomItem } from "src/api/types";
import {
    formatCustomDataField,
    evaluateTemplate,
    getColumnJustification,
} from "src/api/utils/customDataUtils";
import { handleTableImgError } from "src/api/utils/errorHandling";
import { ReactComponent as LinkSVG } from "src/assets/icons/external-link.svg";

interface ITableCellProps {
    children?: React.ReactNode;
    format?: TRemoteFormat;
    isHeader?: boolean;
    width?: number;
    justify?: "left" | "center" | "right";
    href?: string;
    hasRowLink?: boolean;
}
export const TableCell: React.FC<ITableCellProps> = ({
    children,
    format,
    isHeader,
    width,
    justify,
    href,
    hasRowLink,
}) => {
    const handleOnClick = () => {
        if (href) window.open(href, "_blank");
    };
    return (
        <div
            className={twMerge(
                "flex mr-2.5 items-center",
                format && getColumnJustification(format, justify),
                href && "cursor-pointer",
                isHeader && "fontGroup-support"
            )}
            {...(width && { style: { display: "flex", flex: width } })}
            {...(href && { onClick: handleOnClick })}
        >
            {href && !hasRowLink && <LinkSVG className="w-2 h-2 mr-2" />}
            {children}
        </div>
    );
};

export const TableHeader: React.FC<{
    layout: TRemoteCustomLayoutEntry[];
    addExtraColumn?: boolean;
}> = ({ layout, addExtraColumn }) => {
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
            {addExtraColumn && <TableCell width={0.5} />}
        </div>
    );
};

interface ITableRowProps {
    columnsLayout: TRemoteCustomLayoutEntry[];
    rowData: TCustomItem;
    rowProps: TRemoteCustomRowProps | undefined;
}

export const TableRow: React.FC<ITableRowProps> = ({
    columnsLayout,
    rowData,
    rowProps,
}) => {
    let rowLink: string | undefined;
    if (rowProps?.uri_ref !== undefined) {
        const uriRef = rowData[rowProps.uri_ref];
        rowLink = typeof uriRef === "string" ? uriRef : undefined;
    }

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
                const href =
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
                        href={href}
                        hasRowLink={rowLink !== undefined}
                    >
                        {column.format === "image" && imageUri ? (
                            <img
                                src={imageUri}
                                alt=""
                                onError={handleTableImgError(imageUri)}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            formattedValue?.field
                        )}
                    </TableCell>
                );
            })}
            {rowLink && (
                <TableCell
                    width={0.5}
                    format="icon"
                    justify="right"
                    href={rowLink}
                    hasRowLink={rowLink !== undefined}
                >
                    <LinkSVG className="w-3" />
                </TableCell>
            )}
        </div>
    );
};
