import { FC } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { useGetTvlFeesQuery } from "src/api/services";
import { selectFeesMetric, setSelectedFeesMetric } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import FeesModule, {
    EFeesItemPreference,
} from "src/components/fees/FeesModule";
import CONFIG from "src/config";
import { IModuleContainer } from "src/types";

const FeesContainer: FC<IModuleContainer> = ({
    moduleData,
    mobileViewWidgetHeight,
}) => {
    const dispatch = useAppDispatch();

    const widgetHeight = useWidgetHeight(moduleData);

    const selectedMetric =
        useAppSelector(selectFeesMetric(moduleData.hash)) ??
        EFeesItemPreference.Revenue;

    const pollingInterval =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.TVL_FEES.POLLING_INTERVAL) * 1000;

    const { currentData: feesResponse, isLoading } = useGetTvlFeesQuery(
        {
            metric: selectedMetric,
            timeframe: "24h",
        },
        {
            pollingInterval,
        }
    );

    const handleChangeMetric = (metric: EFeesItemPreference) => {
        dispatch(
            setSelectedFeesMetric({
                widgetHash: moduleData.hash,
                metric,
            })
        );
    };

    return (
        <FeesModule
            items={feesResponse?.items}
            attribution={feesResponse?.config.attribution}
            isLoading={isLoading}
            widgetHeight={mobileViewWidgetHeight ?? widgetHeight}
            selectedMetric={selectedMetric}
            onChangeMetric={handleChangeMetric}
        />
    );
};

export default FeesContainer;
