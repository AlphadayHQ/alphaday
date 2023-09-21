import { DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { TUserViewWidget } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { deviceBreakpoints } from "src/globalStyles/breakpoints";
import CONFIG from "src/config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

const { oneCol, twoCol, threeCol, fourCol } = deviceBreakpoints;

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
    singleCol: [TUserViewWidget[]];
    twoCol: [TUserViewWidget[], TUserViewWidget[]];
    threeCol: [TUserViewWidget[], TUserViewWidget[], TUserViewWidget[]];
    fourCol: [
        TUserViewWidget[],
        TUserViewWidget[],
        TUserViewWidget[],
        TUserViewWidget[],
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
    if (draggableStyle !== undefined)
        return {
            // styles we need to apply on draggables
            ...draggableStyle,

            // override z-index
            zIndex: isDraggingWidget
                ? Z_INDEX_REGISTRY.DRAGGING
                : Z_INDEX_REGISTRY.DRAGGABLE,
        };
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

const shortestCol = (grid: TUserViewWidget[][]) =>
    grid.map((a) => a.length).indexOf(Math.min(...grid.map((a) => a.length)));

export const computeLayoutGrid: (
    viewWidgets: TUserViewWidget[] | undefined
) => TLayoutGrid | undefined = (viewWidgets) => {
    if (viewWidgets === undefined) return undefined;
    const layout: TLayoutGrid = {
        singleCol: [[]],
        twoCol: [[], []],
        threeCol: [[], [], []],
        fourCol: [[], [], [], []],
    };
    const duplicatePositionWidgets: TduplicatePositionWidgets[] = [];

    viewWidgets.forEach((widget) => {
        const coords = getCoordinates(widget.sort_order);

        // sort_order already occupied in layout
        if (layout.singleCol[0][coords.singleCol] !== undefined) {
            Logger.warn(
                `computeLayoutState: widget ${String(
                    widget.widget.name
                )} has same sort_order as ${
                    layout.singleCol[0][coords.singleCol].widget.name
                } : ${String(coords.singleCol)}. Reassigning ${String(
                    widget.widget.name
                )} a new sort_order
            `
            );
            duplicatePositionWidgets.push([widget, EColumnType.SingleCol]);
            return;
        }
        // Mobile
        layout.singleCol[0][coords.singleCol] = { ...widget };
        // Tablet
        layout.twoCol[coords.twoCol.x][coords.twoCol.y] = {
            ...widget,
        };
        // Desktop
        layout.threeCol[coords.threeCol.x][coords.threeCol.y] = {
            ...widget,
        };
        // Wide
        layout.fourCol[coords.fourCol.x][coords.fourCol.y] = {
            ...widget,
        };
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

    // handle widgets with uplicated sort_ooder
    duplicatePositionWidgets.forEach((duplicate, i) => {
        layout.singleCol[0].push({
            ...duplicate[0],
            sort_order: layout.singleCol[0].length + i,
        });
        layout.twoCol[shortestCol(layout.twoCol)].push({
            ...duplicate[0],
            sort_order: layout.singleCol[0].length + i,
        });
        layout.threeCol[shortestCol(layout.threeCol)].push({
            ...duplicate[0],
            sort_order: layout.singleCol[0].length + i,
        });
        layout.fourCol[shortestCol(layout.fourCol)].push({
            ...duplicate[0],
            sort_order: layout.singleCol[0].length + i,
        });
    });

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
        viewWidgets.length !== layout.singleCol[0].length ||
        viewWidgets.length !== totalElementsInTabletLayout ||
        viewWidgets.length !== totalElementsInThreeColLayout ||
        viewWidgets.length !== totalElementsInFourColLayout
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
    if (windowWidth >= oneCol && windowWidth < threeCol) {
        return EColumnType.TwoCol;
    }
    if (windowWidth >= twoCol && windowWidth < fourCol)
        return EColumnType.ThreeCol;

    return EColumnType.FourCol;
};

export const getDraggedWidget = (
    layout: TUserViewWidget[][],
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
    return {
        ...layout[sourcePos.col][sourcePos.row],
        sort_order: destPos.col * multiplier[colType] + destPos.row,
    };
};

/**
 *
 * @param layout : TUserViewWidget[][]
 * Updates individual widget props to reflect their current position on the layout
 *
 * @returns  TUserViewWidget[]
 */
export const recomputeWidgetsPos = (
    layout: TUserViewWidget[][]
): TUserViewWidget[] => {
    const widgets: TUserViewWidget[] = [];
    for (let i = 0; i < layout.length; i += 1) {
        for (let j = 0; j < layout[i].length; j += 1) {
            widgets.push({
                ...layout[i][j],
                sort_order: j * layout.length + i,
            });
        }
    }

    return widgets;
};
