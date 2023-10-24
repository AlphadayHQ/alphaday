import { FC } from "react";
import { TSourceData } from "src/api/types";
import VenueMapModule from "src/components/maps/VenueMapModule";
import { IModuleContainer } from "src/types";

const VenueMapContainer: FC<IModuleContainer<TSourceData[]>> = ({
    moduleData,
}) => {
    const widgetData = moduleData.widget.format_structure.data;

    return (
        <VenueMapModule sources={widgetData || []} isLoading={!widgetData} />
    );
};

export default VenueMapContainer;
