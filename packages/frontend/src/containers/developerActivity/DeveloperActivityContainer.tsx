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
    // tags (the same tags the search bar applies to every widget). Since the
    // developer-activity endpoint accepts a single coin, we use the most
    // recently added tag as the target coin. The search bar appends tags to the
    // end of the list (see views::addKeywordToViewWidgets), so the last tag is
    // the one the user most recently searched for.
    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags = tagsSettings[0]?.tags;
    const coin = tags?.[tags.length - 1]?.slug;

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
