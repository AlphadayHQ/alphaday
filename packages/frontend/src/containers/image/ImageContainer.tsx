import { type FC, Suspense, useMemo } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { useWindowSize } from "src/api/hooks";
import { TRemoteCustomData } from "src/api/services";
import { getColType } from "src/api/utils/layoutUtils";
import { twoColWidgetMaxWidths } from "src/globalStyles/breakpoints";
import CONFIG from "src/config";
import type { IModuleContainer } from "src/types";
import { ImageModule } from "../../components/image/ImageModule";

const validateCustomData = (
    customData: TRemoteCustomData | undefined
): { imageUrl: string | undefined } => {
    let imageUrl = customData?.[0]?.image_url;
    if (typeof imageUrl !== "string") {
        imageUrl = undefined;
    }
    return { imageUrl };
};

const ImageContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const windowSize = useWindowSize();

    const { imageUrl } = validateCustomData(moduleData.widget.custom_data);

    const contentHeight = useMemo(() => {
        const { WIDGETS } = CONFIG;
        const imageConfig = WIDGETS.IMAGE;

        // Check if widget has aspect ratio for dynamic height calculation
        // @ts-ignore
        const aspectRatio = imageConfig.WIDGET_ASPECT_RATIO;

        if (aspectRatio && windowSize.width) {
            const colType = getColType(windowSize.width);
            const maxWidth = twoColWidgetMaxWidths[colType];

            const calculatedHeight = maxWidth / aspectRatio;
            return `${calculatedHeight}px`;
        }

        // Fallback to static height
        return `${imageConfig.WIDGET_HEIGHT || 500}px`;
    }, [windowSize.width]);

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <ImageModule
                imageUrl={imageUrl}
                title={moduleData.widget.name}
                contentHeight={contentHeight}
                isLoading={!moduleData}
            />
        </Suspense>
    );
};

export default ImageContainer;
