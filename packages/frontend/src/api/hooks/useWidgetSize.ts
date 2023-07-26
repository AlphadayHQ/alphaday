import { useContext } from "react";
import { DimensionsContext } from "../store/providers/dimensions-context";

export type TWidgetSize = "lg" | "sm" | "xs";

type TBreakpoints = [number, number] | [number];

const getWidgetSize = (
    width: number | undefined,
    breakpoints: TBreakpoints
): TWidgetSize | undefined => {
    if (!width) return undefined;
    if (width > breakpoints[0]) return "lg";
    if (breakpoints[1] !== undefined && width <= breakpoints[1]) return "xs";
    return "sm";
};

/**
 * @description
 * Accepts a breakpoints definition array to determine the widget's current size category (i.e lg|sm|xs)
 * The breakpoints definition array is an array of numbers that defines the boundaries of the widget's size.
 *
 * This hook is useful when you want to adapt some components
 * within a widget to the current width of the widget container.
 *
 * @param breakpoints [lg, sm] or [lg, sm, xs]
 *
 *  @example
 *  const widgetSize = useWidgetSize([800, 600]);
 *  If widgets width is 900, widgetSize will be 'lg'
 *  If widgets width is 700, widgetSize will be 'sm'
 *  If widgets width is 500, widgetSize will be 'xs'
 *
 * @returns widgetSize lg|sm|xs
 */

export const useWidgetSize: (
    breakpoints: TBreakpoints
) => TWidgetSize | undefined = (breakpoints) => {
    const { widgetsSize } = useContext(DimensionsContext);

    return getWidgetSize(widgetsSize?.width, breakpoints);
};
