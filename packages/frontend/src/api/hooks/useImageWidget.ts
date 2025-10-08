import { useCallback, useState, useMemo } from "react";
import { TCachedView } from "../types";
import { useTwoColWidgets } from "../utils/layoutUtils";
import { useTwoColImageWidgetSize } from "./useWidgetSize";

interface IImageWidgetReturn {
    imageWidgetSize: { width: number; height: number } | undefined;
    aspectRatios: Record<string, number>;
    handleAspectRatioDetected: (
        widgetHash: string,
        aspectRatio: number
    ) => void;
}

/**
 * Custom hook to manage image widget sizing and aspect ratios
 * Consolidates image widget size tracking and aspect ratio state management
 *
 * @param selectedView - The currently selected view containing widget data
 * @returns Object containing imageWidgetSize, aspectRatios, and handleAspectRatioDetected callback
 */
export const useImageWidget = (
    selectedView: TCachedView | undefined
): IImageWidgetReturn => {
    const imageWidgetSize = useTwoColImageWidgetSize();
    const { widgets: twoColWidgets } = useTwoColWidgets(selectedView);

    // Track detected aspect ratios for two-column widgets
    const [aspectRatios, setAspectRatios] = useState<Record<string, number>>(
        {}
    );

    const handleAspectRatioDetected = useCallback(
        (widgetHash: string, aspectRatio: number) => {
            // Find which two-col widget this hash belongs to
            const widgetKey = Object.keys(twoColWidgets).find(
                (key) => twoColWidgets[key]?.hash === widgetHash
            );

            if (widgetKey && aspectRatio > 0) {
                setAspectRatios((prev) => ({
                    ...prev,
                    [widgetKey]: aspectRatio,
                }));
            }
        },
        [twoColWidgets]
    );

    return useMemo(
        () => ({
            imageWidgetSize,
            aspectRatios,
            handleAspectRatioDetected,
        }),
        [imageWidgetSize, aspectRatios, handleAspectRatioDetected]
    );
};
