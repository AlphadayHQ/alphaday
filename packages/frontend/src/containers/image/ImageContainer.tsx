import { type FC, Suspense, useMemo } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { useWindowSize } from "src/api/hooks";
import {
    getColType,
    TWO_COL_WIDGET_MAX_WIDTHS,
} from "src/api/utils/layoutUtils";
import CONFIG from "src/config";
import type { IModuleContainer } from "src/types";
import { ImageModule } from "../../components/image/ImageModule";

const ImageContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const windowSize = useWindowSize();

    // const imageUrl = useMemo(() => {
    //     try {
    //         // Try to get image URL from custom_data first
    //         const customData = moduleData.widget.custom_data;
    //         if (Array.isArray(customData) && customData.length > 0) {
    //             const firstData = customData[0];
    //             if (firstData?.source_url) {
    //                 return String(firstData.source_url);
    //             }
    //             if (firstData?.image_url) {
    //                 return String(firstData.image_url);
    //             }
    //             if (firstData?.url) {
    //                 return String(firstData.url);
    //             }
    //         }

    //         // Fallback to format_structure for legacy support
    //         const legacyData = moduleData.widget.format_structure?.data;
    //         if (Array.isArray(legacyData) && legacyData.length > 0) {
    //             Logger.warn(
    //                 `ImageContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
    //             );
    //             const legacyItem = legacyData[0];
    //             if (legacyItem?.source_url) {
    //                 return String(legacyItem.source_url);
    //             }
    //             if (legacyItem?.image_url) {
    //                 return String(legacyItem.image_url);
    //             }
    //             if (legacyItem?.url) {
    //                 return String(legacyItem.url);
    //             }
    //         }

    //         return "";
    //     } catch (error) {
    //         Logger.error("ImageContainer::error extracting image URL", error);
    //         return "";
    //     }
    // }, [moduleData]);

    const contentHeight = useMemo(() => {
        const { WIDGETS } = CONFIG;
        const imageConfig = WIDGETS.IMAGE;

        // Check if widget has aspect ratio for dynamic height calculation
        // @ts-ignore
        const aspectRatio = imageConfig.WIDGET_ASPECT_RATIO;

        if (aspectRatio && windowSize.width) {
            const colType = getColType(windowSize.width);
            const maxWidth = TWO_COL_WIDGET_MAX_WIDTHS[colType];

            const calculatedHeight = maxWidth / aspectRatio;
            return `${calculatedHeight}px`;
        }

        // Fallback to static height
        return `${imageConfig.WIDGET_HEIGHT || 500}px`;
    }, [windowSize.width]);

    const isLoading = !moduleData;
    // const isError = !imageUrl;

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <ImageModule
                // imageUrl={imageUrl}
                imageUrl="/eth.jpeg"
                title={moduleData.widget.name}
                isLoading={isLoading}
                // isError={isError}
                isError={false}
                contentHeight={contentHeight}
            />
        </Suspense>
    );
};

export default ImageContainer;
