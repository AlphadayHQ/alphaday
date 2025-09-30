import { type FC, Suspense, useMemo } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { useWidgetHeight } from "src/api/hooks";
import { Logger } from "src/api/utils/logging";
import type { IModuleContainer } from "src/types";
import { ImageModule } from "../../components/image/ImageModule";
import BaseContainer from "../base/BaseContainer";

const ImageContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const widgetHeight = useWidgetHeight(moduleData);

    const imageUrl = useMemo(() => {
        try {
            // Try to get image URL from custom_data first
            const customData = moduleData.widget.custom_data;
            if (Array.isArray(customData) && customData.length > 0) {
                const firstData = customData[0];
                if (firstData?.source_url) {
                    return String(firstData.source_url);
                }
                if (firstData?.image_url) {
                    return String(firstData.image_url);
                }
                if (firstData?.url) {
                    return String(firstData.url);
                }
            }

            // Fallback to format_structure for legacy support
            const legacyData = moduleData.widget.format_structure?.data;
            if (Array.isArray(legacyData) && legacyData.length > 0) {
                Logger.warn(
                    `ImageContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
                );
                const legacyItem = legacyData[0];
                if (legacyItem?.source_url) {
                    return String(legacyItem.source_url);
                }
                if (legacyItem?.image_url) {
                    return String(legacyItem.image_url);
                }
                if (legacyItem?.url) {
                    return String(legacyItem.url);
                }
            }

            return "";
        } catch (error) {
            Logger.error("ImageContainer::error extracting image URL", error);
            return "";
        }
    }, [moduleData]);

    const contentHeight = useMemo(() => {
        return `${widgetHeight - 40}px`;
    }, [widgetHeight]);

    const isError = !imageUrl;
    const isLoading = !moduleData;

    return (
        // <BaseContainer
        //     uiProps={{
        //         dragProps: undefined,
        //         isDragging: false,
        //         onToggleShowFullSize: undefined,
        //         allowFullSize: false,
        //         showFullSize: false,
        //         setTutFocusElemRef: undefined,
        //     }}
        //     moduleData={moduleData}
        // >
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <ImageModule
                // imageUrl={imageUrl}
                imageUrl="/eth.jpeg"
                title={moduleData.widget.name}
                isLoading={isLoading}
                // isError={isError}
                isError={false}
            />
        </Suspense>
        // </BaseContainer>
    );
};

export default ImageContainer;
