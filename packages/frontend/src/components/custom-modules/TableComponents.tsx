import { twMerge } from "@alphaday/ui-kit";
import {
    TRemoteCustomLayoutEntry,
    TRemoteCustomRowProps,
    TRemoteFormat,
} from "src/api/services";
import { TCustomItem, TCustomLayoutEntry } from "src/api/types";
import {
    formatCustomDataField,
    evaluateTranslationTemplate,
    getColumnJustification,
} from "src/api/utils/customDataUtils";
import { handleTableImgError } from "src/api/utils/errorHandling";
import { ReactComponent as LinkSVG } from "src/assets/icons/external-link.svg";

const getFieldDetails = (field: TCustomLayoutEntry, item: TCustomItem) => {
    const rawField =
        field.template !== undefined
            ? evaluateTranslationTemplate(field.template, item)
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
                "flex flex-1 mr-2.5 [&>p]:mb-0 min-w-[100px]",
                format && getColumnJustification(format, justify),
                href && "cursor-pointer",
                isHeader && "fontGroup-normal text-primaryVariant100",
                !isCompactMode && "items-center"
            )}
            {...(width && {
                style: { display: "flex", flex: width, minWidth: "100px" },
            })}
            {...(href && { onClick: handleOnClick })}
        >
            {href !== undefined && !hasRowLink && (
                <LinkSVG
                    className={twMerge(
                        "shrink-0 self-center w-2 h-2 mr-2",
                        href === "" && "invisible"
                    )}
                />
            )}
            {children}
        </div>
    );
};

export const TableHeader: React.FC<{
    layout: TRemoteCustomLayoutEntry[];
    addExtraColumn?: boolean;
}> = ({ layout, addExtraColumn }) => {
    return (
        <div className="flex flex-row pt-1 px-5 min-w-fit">
            {layout.map((columnLayout) => (
                <TableCell
                    key={columnLayout.id}
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

    const handleOnClick = () => {
        if (rowLink) window.open(rowLink, "_blank");
    };

    return (
        <div
            className={twMerge(
                "flex flex-row py-2 px-5 hover:bg-background min-w-fit overflow-x-auto",
                rowLink && "cursor-pointer"
            )}
            {...(rowLink && { onClick: handleOnClick })}
        >
            {columnsLayout.map((column) => {
                if (column.hidden) return null;
                const rawValue =
                    column.template !== undefined
                        ? evaluateTranslationTemplate(column.template, rowData)
                        : undefined;
                const formattedValue =
                    rawValue !== undefined
                        ? formatCustomDataField({
                              rawField: rawValue,
                              format: column.format,
                          })
                        : undefined;
                /**
                 * When uri_ref is defined but data[uri_ref]="", it is
                 * important to keep href="" and not href=undefined. This
                 * is because sometimes some entries do not have a url (eg.
                 * a team table with a team member that doesn't have a
                 * linkedin page). So when href="" we'll hide the link icon
                 * for those specific entries.
                 */
                const href =
                    column.uri_ref && rowData[column.uri_ref] !== undefined
                        ? String(rowData[column.uri_ref])
                        : undefined;

                const imageUri =
                    column.image_uri_ref && rowData[column.image_uri_ref]
                        ? String(rowData[column.image_uri_ref])
                        : undefined;
                return (
                    <TableCell
                        key={column.id}
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
            {rowLink !== undefined && (
                <TableCell
                    width={0.5}
                    format="icon"
                    justify="right"
                    href={rowLink}
                    hasRowLink={rowLink !== undefined}
                >
                    {rowLink && <LinkSVG className="w-3" />}
                </TableCell>
            )}
        </div>
    );
};

interface ITableColumnProps {
    columnLayout: TRemoteCustomLayoutEntry;
    items: TCustomItem[];
    rowProps: TRemoteCustomRowProps | undefined;
}

export const TableColumn: React.FC<ITableColumnProps> = ({
    columnLayout,
    items,
    rowProps,
}) => {
    if (columnLayout.hidden) return null;

    return (
        <div className="flex flex-col w-fit">
            {/* Column Header */}
            <div className="flex flex-row pt-1 px-5 pb-2">
                <div
                    className={twMerge(
                        "fontGroup-normal text-primaryVariant100 whitespace-nowrap",
                        columnLayout.format &&
                            getColumnJustification(
                                columnLayout.format,
                                columnLayout.justify
                            )
                    )}
                >
                    {columnLayout.title}
                </div>
            </div>

            {/* Column Cells */}
            {items.map((item) => {
                const rawValue =
                    columnLayout.template !== undefined
                        ? evaluateTranslationTemplate(
                              columnLayout.template,
                              item
                          )
                        : undefined;
                const formattedValue =
                    rawValue !== undefined
                        ? formatCustomDataField({
                              rawField: rawValue,
                              format: columnLayout.format,
                          })
                        : undefined;

                const href =
                    columnLayout.uri_ref && item[columnLayout.uri_ref] !== undefined
                        ? String(item[columnLayout.uri_ref])
                        : undefined;

                const imageUri =
                    columnLayout.image_uri_ref && item[columnLayout.image_uri_ref]
                        ? String(item[columnLayout.image_uri_ref])
                        : undefined;

                let rowLink: string | undefined;
                if (rowProps?.uri_ref !== undefined) {
                    const uriRef = item[rowProps.uri_ref];
                    rowLink = typeof uriRef === "string" ? uriRef : undefined;
                }

                return (
                    <div
                        key={item.id}
                        className={twMerge(
                            "flex px-5 py-2 hover:bg-background whitespace-nowrap border-b border-borderLine",
                            columnLayout.format &&
                                getColumnJustification(
                                    columnLayout.format,
                                    columnLayout.justify
                                )
                        )}
                    >
                        {columnLayout.format === "image" && imageUri ? (
                            <img
                                src={imageUri}
                                alt=""
                                onError={handleTableImgError(imageUri)}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="flex items-center">
                                {href !== undefined && (
                                    <LinkSVG
                                        className={twMerge(
                                            "shrink-0 w-2 h-2 mr-2",
                                            href === "" && "invisible"
                                        )}
                                    />
                                )}
                                {formattedValue?.field}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

interface IColumnBasedTableProps {
    columnsLayout: TRemoteCustomLayoutEntry[];
    items: TCustomItem[];
    rowProps: TRemoteCustomRowProps | undefined;
}

export const ColumnBasedTable: React.FC<IColumnBasedTableProps> = ({
    columnsLayout,
    items,
    rowProps,
}) => {
    return (
        <div className="flex flex-row overflow-x-auto">
            {columnsLayout.map((column) => (
                <TableColumn
                    key={column.id}
                    columnLayout={column}
                    items={items}
                    rowProps={rowProps}
                />
            ))}
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

    let rowLink: string | undefined;
    if (rowProps?.uri_ref !== undefined) {
        const uriRef = rowData[rowProps.uri_ref];
        rowLink = typeof uriRef === "string" ? uriRef : undefined;
    }

    const handleOnClick = () => {
        if (rowLink) window.open(rowLink, "_blank");
    };
    return (
        <div
            className={twMerge(
                "flex flex-row py-2 px-5 hover:bg-background",
                rowLink && "cursor-pointer"
            )}
            {...(rowLink && { onClick: handleOnClick })}
        >
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
                            ? evaluateTranslationTemplate(
                                  column.template,
                                  rowData
                              )
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
                        <div key={column.id} className="flex flex-1">
                            <TableCell
                                format={column.format}
                                justify="left"
                                isHeader
                                isCompactMode
                                width={1}
                            >
                                {column.title}
                            </TableCell>
                            <TableCell
                                format={column.format}
                                justify="left"
                                href={href}
                                isCompactMode
                                width={2}
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
