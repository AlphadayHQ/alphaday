import { FC, useMemo } from "react";
import { EWidgetData, useGetCustomItemsQuery } from "src/api/services";
import { customDataAsSeries } from "src/api/utils/customDataUtils";
import { Logger } from "src/api/utils/logging";
import CustomChartModule from "src/components/custom-modules/CustomChartModule";
import { IModuleContainer } from "src/types";

const CustomChartContainer: FC<IModuleContainer> = ({ moduleData }) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const { id, name, custom_data, custom_meta, endpoint_url, data_type } =
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

    const series = useMemo(() => {
        if (data_type === EWidgetData.Static) {
            if (!custom_data) {
                Logger.error(
                    `CustomChartContainer: missing data for widget ${name}`
                );
                return [];
            }
            return customDataAsSeries(custom_data);
        }
        return customDataAsSeries(data?.results ?? []);
    }, [custom_data, data?.results, data_type, name]);

    const meta = useMemo(() => {
        if (custom_meta?.layout_type !== "chart") {
            Logger.warn(
                `CustomChartContainer: invalid layout type, expected chart in widget ${name}`
            );
            return undefined;
        }
        return custom_meta;
    }, [custom_meta, name]);

    return (
        <CustomChartModule id={id} series={series} meta={meta} name={name} />
    );
};

export default CustomChartContainer;
