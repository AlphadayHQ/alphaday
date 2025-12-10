import { type FC, Suspense, useMemo } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { validateImageCustomData } from "src/api/utils/customDataUtils";
import CONFIG from "src/config";
import type { IModuleContainer } from "src/types";
import { ImageModule } from "../../components/image/ImageModule";

const OneColImageContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const { imageUrl, imageLink } = validateImageCustomData(
        moduleData.widget.custom_data
    );

    const contentHeight = useMemo(() => {
        return `${CONFIG.WIDGETS.ONE_COL_IMAGE.WIDGET_HEIGHT || 600}px`;
    }, []);

    return (
        <Suspense fallback={<ModuleLoader $height={contentHeight} />}>
            <ImageModule
                imageUrl={imageUrl}
                imageLink={imageLink}
                title={moduleData.widget.name}
                isLoading={!moduleData}
                type="one_col_image"
                showImage
            />
        </Suspense>
    );
};

export default OneColImageContainer;
