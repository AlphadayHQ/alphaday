import { FC, Dispatch, SetStateAction } from "react";
import { TRemoteFormatStructureColumns } from "src/api/services";
import { TDynamicItem } from "src/api/types";

export type TTableColumn = "image" | "text" | "link";

export interface ITableRow {
    id: number;
    columns: TRemoteFormatStructureColumns[];
    item: TDynamicItem<string>;
    isMobile?: boolean;
}

export interface ITableColumn {
    type: TTableColumn;
    column: TRemoteFormatStructureColumns;
    value: string | undefined;
    href: string | undefined;
    showLinkIcon: boolean;
    bold: boolean;
}

export interface ITable<T> {
    items: TDynamicItem<T>[];
    columns: TRemoteFormatStructureColumns[];
    isLoadingItems: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    widgetHeight: number;
    onAdjustWidgetHeight: Dispatch<SetStateAction<number>>;
}

export type IReports = Omit<ITable<string>, "onAdjustWidgetHeight">;

export interface IDynamicTable<TItem> {
    endpointUrl: string;
    columns: TRemoteFormatStructureColumns[];
    transformItems(items: TItem[]): TDynamicItem<string>[];
    Module: FC<ITable<string>>;
}

/**
 * Roadmap
 */
export enum ERoadmapStatus {
    Upcoming = 0,
    Completed = 1,
    InProgress = 2,
}
