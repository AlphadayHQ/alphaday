import { FC } from "react";
import MapModule from "src/components/maps/MapModule";
import { IModuleContainer, TItem } from "src/types";

const MapContainer: FC<IModuleContainer<TItem[]>> = ({ moduleData }) => {
    const [widgetData] = moduleData.widget.format_structure.data || [];

    return <MapModule url={widgetData?.url} />;
};

export default MapContainer;
