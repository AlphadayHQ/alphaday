import { DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { TUserViewWidget } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { deviceBreakpoints } from "src/globalStyles/breakpoints";
import CONFIG from "src/config";
import { TTemplateSlug } from "src/types";
import { getWidgetName } from "./viewUtils";

export type TTwoColPlaceholder = {
    type: "TWO_COL_PLACEHOLDER";
    twoColWidget: TUserViewWidget;
    sort_order: number;
    hash: string; // For drag-drop compatibility
};

export type TWidgetOrPlaceholder = TUserViewWidget | TTwoColPlaceholder;

// Type guard to check if an item is a placeholder
export const isTwoColPlaceholder = (
    item: TWidgetOrPlaceholder
): item is TTwoColPlaceholder => {
    return (item as TTwoColPlaceholder).type === "TWO_COL_PLACEHOLDER";
};

const { Z_INDEX_REGISTRY } = CONFIG.UI;

const { singleCol, twoCol, threeCol, fourCol } = deviceBreakpoints;

/**
 * Heads up: layout is in the form (col #, row #) or (x, y), starting from the
 * top left. That is, if:
 * L = | w00 w01 w02 |
 *     | w10 w11 w12 |
 *     | w20 w21 w22 |
 * then to access widget located in the 3rd row (y=2) of the center column (x=1)
 * we do:
 * w21 = L[1][2]
 */
export type TLayoutGrid = {
    singleCol: [TWidgetOrPlaceholder[]];
    twoCol: [TWidgetOrPlaceholder[], TWidgetOrPlaceholder[]];
    threeCol: [
        TWidgetOrPlaceholder[],
        TWidgetOrPlaceholder[],
        TWidgetOrPlaceholder[],
    ];
    fourCol: [
        TWidgetOrPlaceholder[],
        TWidgetOrPlaceholder[],
        TWidgetOrPlaceholder[],
        TWidgetOrPlaceholder[],
    ];
};

export enum EColumnType {
    SingleCol = "singleCol",
    TwoCol = "twoCol",
    ThreeCol = "threeCol",
    FourCol = "fourCol",
}

type TduplicatePositionWidgets = [TUserViewWidget, EColumnType];

export const getItemStyle = (
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
    isDraggingWidget: boolean
): DraggingStyle | { zIndex: number } => {
    if (draggableStyle !== undefined) {
        return {
            // styles we need to apply on draggables
            ...draggableStyle,

            // override z-index
            zIndex: isDraggingWidget
                ? Z_INDEX_REGISTRY.DRAGGING
                : Z_INDEX_REGISTRY.DRAGGABLE,
        };
    }
    return {
        zIndex: Z_INDEX_REGISTRY.DRAGGABLE,
    };
};

/**
 * This function calculates the x,y coordinates needed to position a widget
 * from a sort_order for the 4-supported layout systems
 *
 * @param sortOrder
 */
const getCoordinates = (sortOrder: number) => {
    return {
        [EColumnType.SingleCol]: sortOrder,
        [EColumnType.TwoCol]: {
            x: sortOrder % 2,
            y: Math.floor(sortOrder / 2),
        },
        [EColumnType.ThreeCol]: {
            x: sortOrder % 3,
            y: Math.floor(sortOrder / 3),
        },
        [EColumnType.FourCol]: {
            x: sortOrder % 4,
            y: Math.floor(sortOrder / 4),
        },
    };
};

const shortestCol = (grid: TWidgetOrPlaceholder[][]) =>
    grid.map((a) => a.length).indexOf(Math.min(...grid.map((a) => a.length)));

export const computeLayoutGrid: (
    viewWidgets: TUserViewWidget[] | undefined,
    twoColWidgets?: TUserViewWidget[]
) => TLayoutGrid | undefined = (viewWidgets, twoColWidgets = []) => {
    if (viewWidgets === undefined) return undefined;
    const layout: TLayoutGrid = {
        singleCol: [[]],
        twoCol: [[], []],
        threeCol: [[], [], []],
        fourCol: [[], [], [], []],
    };
    const duplicatePositionWidgets: TduplicatePositionWidgets[] = [];

    // Combine all widgets and sort by sort_order
    const allWidgets = [...viewWidgets, ...twoColWidgets].sort(
        (a, b) => a.sort_order - b.sort_order
    );

    allWidgets.forEach((widget) => {
        const coords = getCoordinates(widget.sort_order);

        // Check if this is a two-column widget
        const isTwoCol = twoColWidgets.some((tw) => tw.hash === widget.hash);

        let widgetOrPlaceholder: TWidgetOrPlaceholder;

        if (isTwoCol) {
            // Create placeholder for two-column widget
            widgetOrPlaceholder = {
                type: "TWO_COL_PLACEHOLDER",
                twoColWidget: widget,
                sort_order: widget.sort_order,
                hash: `placeholder-${widget.hash}`,
            };
        } else {
            widgetOrPlaceholder = { ...widget };
        }

        // sort_order already occupied in layout
        if (layout.singleCol[0][coords.singleCol] !== undefined) {
            Logger.warn(
                `computeLayoutState: widget ${String(
                    widget.widget.name
                )} has same sort_order as existing widget : ${String(coords.singleCol)}. Reassigning ${String(
                    widget.widget.name
                )} a new sort_order
            `
            );
            duplicatePositionWidgets.push([widget, EColumnType.SingleCol]);
            return;
        }

        // Mobile
        layout.singleCol[0][coords.singleCol] = widgetOrPlaceholder;
        // Tablet
        layout.twoCol[coords.twoCol.x][coords.twoCol.y] = widgetOrPlaceholder;
        // Desktop
        layout.threeCol[coords.threeCol.x][coords.threeCol.y] =
            widgetOrPlaceholder;
        // Wide
        layout.fourCol[coords.fourCol.x][coords.fourCol.y] =
            widgetOrPlaceholder;
    });

    // filter off undefined elements from columns
    layout.singleCol[0] = layout.singleCol[0].filter((w) => w !== undefined);
    for (let i = 0; i < 2; i += 1) {
        layout.twoCol[i] = layout.twoCol[i].filter((w) => w !== undefined);
    }
    for (let i = 0; i < 3; i += 1) {
        layout.threeCol[i] = layout.threeCol[i].filter((w) => w !== undefined);
    }
    for (let i = 0; i < 4; i += 1) {
        layout.fourCol[i] = layout.fourCol[i].filter((w) => w !== undefined);
    }

    // handle widgets with duplicate sort_order
    duplicatePositionWidgets.forEach((duplicate, i) => {
        const isTwoCol = twoColWidgets.some(
            (tw) => tw.hash === duplicate[0].hash
        );

        let widgetOrPlaceholder: TWidgetOrPlaceholder;
        if (isTwoCol) {
            widgetOrPlaceholder = {
                type: "TWO_COL_PLACEHOLDER",
                twoColWidget: duplicate[0],
                sort_order: layout.singleCol[0].length + i,
                hash: `placeholder-${duplicate[0].hash}`,
            };
        } else {
            widgetOrPlaceholder = {
                ...duplicate[0],
                sort_order: layout.singleCol[0].length + i,
            };
        }

        layout.singleCol[0].push(widgetOrPlaceholder);
        layout.twoCol[shortestCol(layout.twoCol)].push(widgetOrPlaceholder);
        layout.threeCol[shortestCol(layout.threeCol)].push(widgetOrPlaceholder);
        layout.fourCol[shortestCol(layout.fourCol)].push(widgetOrPlaceholder);
    });

    const totalWidgets = viewWidgets.length + twoColWidgets.length;
    const totalElementsInTabletLayout =
        layout.twoCol[0].length + layout.twoCol[1].length;
    const totalElementsInThreeColLayout =
        layout.threeCol[0].length +
        layout.threeCol[1].length +
        layout.threeCol[2].length;
    const totalElementsInFourColLayout =
        layout.fourCol[0].length +
        layout.fourCol[1].length +
        layout.fourCol[2].length +
        layout.fourCol[3].length;
    if (
        totalWidgets !== layout.singleCol[0].length ||
        totalWidgets !== totalElementsInTabletLayout ||
        totalWidgets !== totalElementsInThreeColLayout ||
        totalWidgets !== totalElementsInFourColLayout
    ) {
        Logger.error(
            "layoutUtils::computeLayoutGrid: expected same amount of input elements"
        );
    }

    return layout;
};

export const getColType = (windowWidth: number): EColumnType => {
    if (windowWidth < twoCol) {
        return EColumnType.SingleCol;
    }
    if (windowWidth >= singleCol && windowWidth < threeCol) {
        return EColumnType.TwoCol;
    }
    if (windowWidth >= twoCol && windowWidth < fourCol) {
        return EColumnType.ThreeCol;
    }

    return EColumnType.FourCol;
};

export const getDraggedWidget = (
    layout: TWidgetOrPlaceholder[][],
    sourcePos: { col: number; row: number },
    destPos: { col: number; row: number },
    colType: EColumnType
): TUserViewWidget => {
    const multiplier = {
        [EColumnType.SingleCol]: 1,
        [EColumnType.TwoCol]: 2,
        [EColumnType.ThreeCol]: 3,
        [EColumnType.FourCol]: 4,
    };

    const sourceItem = layout[sourcePos.col][sourcePos.row];
    const widget = isTwoColPlaceholder(sourceItem)
        ? sourceItem.twoColWidget
        : sourceItem;

    return {
        ...widget,
        sort_order: destPos.col * multiplier[colType] + destPos.row,
    };
};

/**
 *
 * @param layout : TWidgetOrPlaceholder[][]
 * Updates individual widget props to reflect their current position on the layout
 *
 * @returns  TUserViewWidget[]
 */
export const recomputeWidgetsPos = (
    layout: TWidgetOrPlaceholder[][]
): TUserViewWidget[] => {
    const widgets: TUserViewWidget[] = [];
    for (let i = 0; i < layout.length; i += 1) {
        for (let j = 0; j < layout[i].length; j += 1) {
            const item = layout[i][j];
            const widget = isTwoColPlaceholder(item) ? item.twoColWidget : item;
            widgets.push({
                ...widget,
                sort_order: j * layout.length + i,
            });
        }
    }

    return widgets;
};

/**
 * Retrieves hardcoded widget settings from CONFIG.WIDGETS based on widget object data
 */
export const getWidgetSettings = (
    templateSlug: TTemplateSlug
): (typeof CONFIG.WIDGETS)[keyof typeof CONFIG.WIDGETS] | undefined => {
    const widgetName = getWidgetName(templateSlug);
    if (!widgetName) return undefined;

    return CONFIG.WIDGETS[widgetName];
};
