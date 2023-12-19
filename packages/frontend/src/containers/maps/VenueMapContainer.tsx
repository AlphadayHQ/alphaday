import { FC, useMemo } from "react";
import { TSourceData } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import VenueMapModule from "src/components/maps/VenueMapModule";
import { IModuleContainer } from "src/types";

const VenueMapContainer: FC<IModuleContainer<TSourceData[]>> = ({
    moduleData,
}) => {
    const data = useMemo(() => {
        try {
            const rawData = moduleData.widget.custom_data ?? [];
            rawData.forEach((item) => {
                assert(item.name !== undefined, "item must have a name");
                assert(
                    item.source_url !== undefined,
                    "item must have a source url"
                );
            });
            // @ts-expect-error
            return rawData as TSourceData[];
        } catch (error) {
            return [];
        }
    }, [moduleData.widget.custom_data]);

    // TODO(v-almonacid): remove this block when format_structure is removed from db model
    const legacyData = moduleData.widget.format_structure?.data;
    if (Array.isArray(legacyData) && legacyData.length > 0) {
        Logger.warn(
            `VenueMapContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
        );
    }

    return <VenueMapModule sources={data} isLoading={data === undefined} />;
};

export default VenueMapContainer;
