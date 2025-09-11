import type { FC } from "react";
import type { IModuleContainer } from "src/types";
import { MarketHeatmapModule } from "./MarketHeatmapModule";

const MarketHeatmapContainer: FC<IModuleContainer> = ({
    moduleData,
    showFullSize,
    toggleAdjustable,
}) => {
    return (
        <MarketHeatmapModule
            moduleData={moduleData}
            showFullSize={showFullSize}
            toggleAdjustable={toggleAdjustable}
        />
    );
};

export default MarketHeatmapContainer;
