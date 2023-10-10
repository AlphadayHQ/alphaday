import { FC, useEffect, useRef } from "react";
import { TBaseTag, useGetNewsSummaryQuery } from "src/api/services";
import { filteringListToStr } from "src/api/utils/filterUtils";
import { itemListsAreEqual } from "src/api/utils/itemUtils";
import SummaryModule from "src/components/summary/SummaryModule";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const SummaryContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const tagsSettings = moduleData.settings.filter(
        (s) => s.setting.slug === EWidgetSettingsRegistry.IncludedTags
    );

    const tagsRef = useRef<TBaseTag[]>();
    const tags = tagsSettings.find(String)?.tags; // tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined

    const { data, isFetching: isFetchingSummary } = useGetNewsSummaryQuery({
        tags: tags ? filteringListToStr(tags) : undefined,
    });

    // reset results when tags preferences changed
    useEffect(() => {
        /**
         * To ensure that the posts are not duplicated, we need to check if the
         * new tags are different from the previous ones. If they are, we need to
         * reset the posts and the current page.
         *
         * We use a ref to store the previous tags, because we don't want to
         * trigger a re-render when the tags change. And assigning a default
         * value when tagsRef.current is undefined ensures that the first
         * comparison will always be true.
         */
        if (tags && !itemListsAreEqual(tagsRef.current || [], tags)) {
            // setItems(undefined);
        }
        tagsRef.current = tags;
    }, [tags]);

    return (
        <SummaryModule isLoadingSummary={isFetchingSummary} summary={data} />
    );
};

export default SummaryContainer;
