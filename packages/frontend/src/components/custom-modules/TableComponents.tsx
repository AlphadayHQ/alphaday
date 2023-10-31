import { TRemoteCustomLayoutEntry, TRemoteFormat } from "src/api/services";
import { TCustomItem } from "src/api/types";
import {
    formatCustomDataField,
    evaluateTemplate,
} from "src/api/utils/customDataUtils";

interface ITableCellProps {
    children?: React.ReactNode;
}
export const TableCell: React.FC<ITableCellProps> = ({ children }) => (
    <div>{children}</div>
);

export const TableHeader: React.FC<{
    layout: TRemoteCustomLayoutEntry[];
}> = ({ layout }) => {
    return (
        <>
            {layout.map((columnLayout) => (
                <TableCell>{columnLayout.title}</TableCell>
            ))}
        </>
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
        <>
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
                return <div>{formattedValue?.field}</div>;
            })}
        </>
    );
};
