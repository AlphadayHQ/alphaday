import CONFIG from "src/config/config";
import { selectWidgetHeight } from "../store";
import { useAppSelector } from "../store/hooks";
import { TUserViewWidget } from "../types";
import { getWidgetName } from "../utils/viewUtils";

/**
 * Returns the height of a widget from the store, if it is adjustable, or the default height
 *
 * @param moduleData
 */
export const useWidgetHeight = (moduleData: TUserViewWidget) => {
    const widgetName = getWidgetName(moduleData.widget.template.slug);
    const defaultHeight = widgetName
        ? CONFIG.WIDGETS[widgetName].WIDGET_HEIGHT
        : CONFIG.WIDGETS.COMMON.DEFAULT_WIDGET_HEIGHT;
    return useAppSelector(selectWidgetHeight(moduleData.hash)) ?? defaultHeight;
};
