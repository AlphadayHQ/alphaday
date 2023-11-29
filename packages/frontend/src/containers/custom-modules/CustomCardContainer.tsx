import { FC, useMemo } from "react";
import { EWidgetData, useGetCustomItemsQuery } from "src/api/services";
import { customDataAsCardData } from "src/api/utils/customDataUtils";
import { Logger } from "src/api/utils/logging";
import CustomCardModule from "src/components/custom-modules/CustomCardModule";
import { IModuleContainer } from "src/types";

const CustomChartContainer: FC<IModuleContainer> = ({ moduleData }) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const { name, custom_data, custom_meta, endpoint_url, data_type } =
        moduleData.widget;
    /* eslint-enable @typescript-eslint/naming-convention */

    const { data } = useGetCustomItemsQuery(
        {
            endpointUrl: endpoint_url || "",
        },
        {
            skip: data_type === EWidgetData.Static,
        }
    );

    const cardData = useMemo(() => {
        let dataToUse;
        if (data_type === EWidgetData.Static) {
            if (!custom_data) {
                Logger.error(
                    `CustomCardContainer: missing data for widget ${name}`
                );
                return undefined;
            }
            dataToUse = custom_data;
        } else {
            dataToUse = data?.results ?? [];
        }
        if (dataToUse) {
            if (custom_meta != null) {
                if (custom_meta.layout_type !== "card") {
                    Logger.error(
                        `CustomCardContainer: invalid layout type, expected "card" in widget ${name}`
                    );
                    return customDataAsCardData(dataToUse, undefined, name);
                }
                return customDataAsCardData(dataToUse, custom_meta, name);
            }
        }
        return customDataAsCardData(dataToUse, undefined, name);
    }, [custom_data, custom_meta, data?.results, data_type, name]);

    return <CustomCardModule title={cardData?.title} value={cardData?.value} />;
};

export default CustomChartContainer;
