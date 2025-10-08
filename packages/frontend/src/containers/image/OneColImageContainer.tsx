import { type FC, Suspense, useMemo } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { TRemoteCustomData } from "src/api/services";
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

const OneColImageContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const { imageUrl } = validateCustomData(moduleData.widget.custom_data);

    const contentHeight = useMemo(() => {
        return `${CONFIG.WIDGETS.ONE_COL_IMAGE.WIDGET_HEIGHT || 600}px`;
    }, []);

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <ImageModule
                imageUrl={imageUrl}
                title={moduleData.widget.name}
                isLoading={!moduleData}
            />
        </Suspense>
    );
};

export default OneColImageContainer;
