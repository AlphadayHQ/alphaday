import { twMerge } from "@alphaday/ui-kit";
import {
    TRemoteCustomLayoutEntry,
    TRemoteCustomRowProps,
    TRemoteFormat,
} from "src/api/services";
import { TCustomItem, TCustomLayoutEntry } from "src/api/types";
import {
    formatCustomDataField,
    evaluateTemplate,
    getColumnJustification,
} from "src/api/utils/customDataUtils";
import { handleTableImgError } from "src/api/utils/errorHandling";
import { ReactComponent as LinkSVG } from "src/assets/icons/external-link.svg";

const getFieldDetails = (field: TCustomLayoutEntry, item: TCustomItem) => {
    const rawField =
        field.template !== undefined
            ? evaluateTemplate(field.template, item)
            : "Error: Missing template";
    const formattedField = formatCustomDataField({
        rawField,
        format: field.format,
    });
    const href =
        field.uri_ref && item[field.uri_ref] ? item[field.uri_ref] : undefined;
    const imageUri =
        field.image_uri_ref &&
        item[field.image_uri_ref] &&
        typeof item[field.image_uri_ref] === "string"
            ? item[field.image_uri_ref]
            : undefined;

    return { formattedField, href, imageUri };
};

interface ITableCellProps {
    children?: React.ReactNode;
    format?: TRemoteFormat;
    isHeader?: boolean;
    width?: number;
    justify?: "left" | "center" | "right";
    href?: string;
    hasRowLink?: boolean;
    isCompactMode?: boolean;
}
export const TableCell: React.FC<ITableCellProps> = ({
    children,
    format,
    isHeader,
    width,
    justify,
    href,
    hasRowLink,
    isCompactMode,
}) => {
    const handleOnClick = () => {
        if (href) window.open(href, "_blank");
    };
    return (
        <div
            className={twMerge(
                "flex flex-1 mr-2.5 items-center !mb-0",
                format && getColumnJustification(format, justify),
                href && "cursor-pointer",
                isHeader && "fontGroup-support"
            )}
            {...(width && { style: { display: "flex", flex: width } })}
            {...(href && { onClick: handleOnClick })}
        >
            {href && !isCompactMode && !hasRowLink && (
                <LinkSVG className="w-2 h-2 mr-2" />
            )}
            {children}
            {href && isCompactMode && !hasRowLink && (
                <LinkSVG className="w-2 h-2 ml-2 self-center" />
            )}
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

export const CompactTableRow: React.FC<ITableRowProps> = ({
    columnsLayout,
    rowData,
    rowProps,
}) => {
    const imageField = columnsLayout.find(
        (column) => column.image_uri_ref !== undefined
    );
    const imageFieldDetails = imageField
        ? getFieldDetails(imageField, rowData)
        : undefined;
    return (
        <div className="flex flex-row py-2 px-5">
            {imageFieldDetails !== undefined && (
                <div className="flex flex-col flex-[0.5_0.5_0%]">
                    <TableCell
                        format="image"
                        {...(imageFieldDetails.href && {
                            href: String(imageFieldDetails.href),
                        })}
                    >
                        <img
                            className="w-8 rounded-full self-center"
                            src={String(imageFieldDetails.imageUri)}
                            alt=""
                            onError={handleTableImgError(
                                String(imageFieldDetails.imageUri)
                            )}
                        />
                    </TableCell>
                </div>
            )}
            <div className="flex flex-col flex-[2_2_0%]">
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
                    // recall: in compact mode we only display one image,
                    // which is featured on the left side
                    if (imageFieldDetails && imageUri) {
                        return null;
                    }
                    return (
                        <div className="flex flex-1 items-center">
                            <TableCell
                                format={column.format}
                                justify="left"
                                isHeader
                            >
                                {column.title}
                            </TableCell>
                            <TableCell
                                format={column.format}
                                justify="left"
                                href={href}
                                isCompactMode
                            >
                                {formattedValue?.field}
                            </TableCell>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
