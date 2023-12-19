import { FC } from "react";
import { Logger } from "src/api/utils/logging";
import MapModule from "src/components/maps/MapModule";
import { IModuleContainer, TItem } from "src/types";

const MapContainer: FC<IModuleContainer<TItem[]>> = ({ moduleData }) => {
    const [data] = moduleData.widget.custom_data ?? [];

    // TODO(v-almonacid): remove this block when format_structure is removed from db model
    const legacyData = moduleData.widget.format_structure?.data;
    if (Array.isArray(legacyData) && legacyData.length > 0) {
        Logger.warn(
            `MapContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
        );
    }

    return <MapModule url={String(data?.url)} />;
};

export default MapContainer;
