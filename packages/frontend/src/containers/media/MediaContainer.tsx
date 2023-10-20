import { FC, useMemo } from "react";
import { useGetLatestVideoQuery } from "src/api/services/video/videoEndpoints";
import { TSourceData } from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import { entryEmbedUrl } from "src/api/utils/mediaUtils";
import MediaModule from "src/components/media/MediaModule";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const MediaContainer: FC<IModuleContainer<TSourceData[]>> = ({
    moduleData,
}) => {
    const tags = moduleData.settings.find(
        (s) => s.setting.slug === EWidgetSettingsRegistry.IncludedTags
    )?.tags;

    const { currentData: latestVideo } = useGetLatestVideoQuery(
        {
            tags: tags ? filteringListToStr(tags) : undefined,
        },
        {
            skip: moduleData.widget.slug !== "latest_video_widget",
        }
    );

    const entryUrl = useMemo(() => {
        if (moduleData.widget.slug === "latest_video_widget") {
            const sourceUrl = latestVideo?.url.split("?").reverse()[0];

            const feedParams = new URLSearchParams(sourceUrl);
            const entryId = feedParams.get("v");
            return entryId ? entryEmbedUrl(entryId, { rel: 0 }) : null;
        }
        const widgetData = moduleData.widget.format_structure.data || [];
        const feedData = widgetData[0];
        const sourceUrl = feedData.source_url.split("?").reverse()[0];

        const feedParams = new URLSearchParams(sourceUrl);
        const entryId = feedParams.get("v");
        return entryId ? entryEmbedUrl(entryId, { rel: 0 }) : null;
    }, [
        latestVideo?.url,
        moduleData.widget.format_structure.data,
        moduleData.widget.slug,
    ]);

    return (
        <MediaModule
            isLoading={!moduleData}
            entryUrl={entryUrl || ""}
            thumbnail=""
            title={moduleData.widget.name}
        />
    );
};

export default MediaContainer;
