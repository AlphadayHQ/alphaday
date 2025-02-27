import { useState, useEffect, FC, useRef, useCallback } from "react";
import { usePagination, useWidgetHeight } from "src/api/hooks";
import { TBaseTag, TSocialItem, useGetTweetsQuery } from "src/api/services";
import { TTweets } from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import {
    buildUniqueItemList,
    itemListsAreEqual,
} from "src/api/utils/itemUtils";
import TwitterFeedModule from "src/components/feeds/TwitterFeedModule";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

const TwitterFeedContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const [posts, setItems] = useState<TSocialItem<TTweets>[] | undefined>();
    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );

    const tagsRef = useRef<TBaseTag[]>();
    const tags = tagsSettings.find(String)?.tags;

    const { data, isLoading, isSuccess } = useGetTweetsQuery({
        page: currentPage,
        tags: tags ? filteringListToStr(tags) : undefined,
    });

    const { nextPage, handleNextPage } = usePagination(
        data?.links,
        10,
        isSuccess
    );

    const handlePaginate = useCallback(() => {
        handleNextPage("next");
    }, [handleNextPage]);

    useEffect(() => {
        if (nextPage === undefined) {
            return () => null;
        }
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    useEffect(() => {
        if (tags && !itemListsAreEqual(tagsRef.current || [], tags)) {
            setItems(undefined);
            setCurrentPage(undefined);
        }
        tagsRef.current = tags;
    }, [tags]);

    useEffect(() => {
        const newPosts = data?.results;
        if (newPosts) {
            setItems((prevPosts) => {
                if (prevPosts) {
                    return buildUniqueItemList<TSocialItem<TTweets>>([
                        ...prevPosts,
                        ...newPosts,
                    ]);
                }
                return newPosts;
            });
        }
    }, [data?.results]);

    return (
        <TwitterFeedModule
            posts={posts || []}
            isLoading={isLoading}
            handlePaginate={handlePaginate}
            widgetHeight={widgetHeight}
        />
    );
};

export default TwitterFeedContainer;
