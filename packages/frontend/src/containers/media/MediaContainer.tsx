import { FC, useMemo } from "react";
import { useGetLatestVideoQuery } from "src/api/services/video/videoEndpoints";
import { TSourceData } from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import { Logger } from "src/api/utils/logging";
import {
    entryEmbedUrl,
    getYoutubeVideoId,
    isYoutubeShortUrl,
    resolveVideoAspect,
} from "src/api/utils/mediaUtils";
import MediaModule from "src/components/media/MediaModule";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const MediaContainer: FC<IModuleContainer<TSourceData[]>> = ({
    moduleData,
}) => {
    const tags = moduleData.settings.find(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    )?.tags;

    const { currentData: latestVideo, isFetching } = useGetLatestVideoQuery(
        {
            tags: tags ? filteringListToStr(tags) : undefined,
        },
        {
            skip: moduleData.widget.slug !== "latest_video_widget",
        }
    );

    // TODO(v-almonacid): remove this block when format_structure is removed from db model
    const legacyData = moduleData.widget.format_structure?.data;
    if (Array.isArray(legacyData) && legacyData.length > 0) {
        Logger.warn(
            `MediaContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
        );
    }

    const { entryUrl, isVertical } = useMemo(() => {
        try {
            if (moduleData.widget.slug === "latest_video_widget") {
                const sourceUrl = latestVideo?.url ?? "";
                const entryId = getYoutubeVideoId(sourceUrl);
                return {
                    entryUrl: entryId
                        ? entryEmbedUrl(entryId, { rel: 0 })
                        : null,
                    isVertical: latestVideo
                        ? resolveVideoAspect(latestVideo).isVertical
                        : false,
                };
            }
            const widgetData = moduleData.widget.custom_data ?? [];
            const feedData = widgetData[0]?.source_url;
            if (feedData == null) {
                throw new Error("data must contain source_url");
            }
            const sourceUrl = String(feedData);
            const entryId = getYoutubeVideoId(sourceUrl);
            return {
                entryUrl: entryId ? entryEmbedUrl(entryId, { rel: 0 }) : null,
                // custom embeds give us only a URL, so fall back to the
                // `/shorts/` heuristic to detect vertical content
                isVertical: isYoutubeShortUrl(sourceUrl),
            };
        } catch (error) {
            Logger.error("MediaContainer::error", error);
            return { entryUrl: null, isVertical: false };
        }
    }, [latestVideo, moduleData.widget.custom_data, moduleData.widget.slug]);

    return (
        <MediaModule
            isLoading={!moduleData || isFetching}
            entryUrl={entryUrl || ""}
            isVertical={isVertical}
            title={moduleData.widget.name}
        />
    );
};

export default MediaContainer;
