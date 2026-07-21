import { FC } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { useGetDeveloperActivityQuery } from "src/api/services";
import DeveloperActivityModule from "src/components/developerActivity/DeveloperActivityModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const { SNAPSHOT_LIMIT, POLLING_INTERVAL } = CONFIG.WIDGETS.DEVELOPER_ACTIVITY;

const DeveloperActivityContainer: FC<IModuleContainer> = ({
    moduleData,
    mobileViewWidgetHeight,
}) => {
    const widgetHeight = useWidgetHeight(moduleData);

    // This widget is coin-scoped: the coin is taken from the widget's included
    // tags. We use the first pinned tag as the target coin.
    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags = tagsSettings[0]?.tags;
    const coin = tags?.[0]?.slug;

    const pollingInterval =
        (moduleData.widget.refresh_interval || POLLING_INTERVAL) * 1000;

    const { currentData: developerActivity, isLoading } =
        useGetDeveloperActivityQuery(
            {
                coin: coin ?? "",
                limit: SNAPSHOT_LIMIT,
            },
            {
                pollingInterval,
                skip: coin === undefined,
            }
        );

    return (
        <DeveloperActivityModule
            snapshots={developerActivity?.snapshots}
            coin={coin}
            isLoading={isLoading && coin !== undefined}
            widgetHeight={mobileViewWidgetHeight ?? widgetHeight}
        />
    );
};

export default DeveloperActivityContainer;
