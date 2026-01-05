import {
    type FC,
    Suspense,
    useMemo,
    useState,
    useCallback,
    useRef,
} from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { useTwoColImageWidgetSize } from "src/api/hooks";
import { validateImageCustomData } from "src/api/utils/customDataUtils";
import CONFIG from "src/config";
import type { IModuleContainer } from "src/types";
import { ImageModule } from "../../components/image/ImageModule";

const TwoColImageContainer: FC<IModuleContainer> = ({
    moduleData,
    onAspectRatioDetected,
}) => {
    const imageWidgetSize = useTwoColImageWidgetSize();
    const [detectedAspectRatio, setDetectedAspectRatio] = useState<
        number | null
    >(null);

    const { imageUrl, imageLink } = validateImageCustomData(
        moduleData.widget.custom_data
    );
    const previousImageUrl = useRef<string | undefined>(imageUrl);

    if (previousImageUrl.current !== imageUrl) {
        setDetectedAspectRatio(null);
        previousImageUrl.current = imageUrl;
    }

    const handleAspectRatioDetected = useCallback(
        (aspectRatio: number) => {
            // Round aspect ratio to 1 decimal place
            const roundedAspectRatio = Math.round(aspectRatio * 10) / 10;
            setDetectedAspectRatio(roundedAspectRatio);
            // Report to parent for layout calculations
            if (onAspectRatioDetected && moduleData.hash) {
                onAspectRatioDetected(moduleData.hash, roundedAspectRatio);
            }
        },
        [onAspectRatioDetected, moduleData.hash]
    );

    const contentHeight = useMemo(() => {
        const { WIDGETS } = CONFIG;
        const imageConfig = WIDGETS.TWO_COL_IMAGE;

        // Use detected aspect ratio if available, otherwise use config
        // @ts-ignore
        const aspectRatio =
            detectedAspectRatio || imageConfig.WIDGET_ASPECT_RATIO;

        if (aspectRatio && imageWidgetSize?.width) {
            const calculatedHeight = imageWidgetSize.width / aspectRatio;
            return `${calculatedHeight}px`;
        }

        // Fallback to static height
        return `${imageConfig.WIDGET_HEIGHT || 500}px`;
    }, [imageWidgetSize?.width, detectedAspectRatio]);

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <ImageModule
                imageUrl={imageUrl}
                imageLink={imageLink}
                title={moduleData.widget.name}
                contentHeight={contentHeight}
                isLoading={!moduleData}
                showImage={detectedAspectRatio !== null}
                onAspectRatioDetected={handleAspectRatioDetected}
            />
        </Suspense>
    );
};

export default TwoColImageContainer;
