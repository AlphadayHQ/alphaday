import { useState, useEffect, FC, useRef, useCallback } from "react";
import { useWidgetHeight } from "src/api/hooks";
import { TBaseTag, useGetLensItemsQuery } from "src/api/services";
import { TLensPost } from "src/api/types";
import { filteringListToStr } from "src/api/utils/filterUtils";
import {
    buildUniqueItemList,
    itemListsAreEqual,
} from "src/api/utils/itemUtils";
import { extractPaginationNumbers } from "src/api/utils/pagination";
import LensFeedModule from "src/components/feeds/LensFeedModule";
import { EWidgetSettingsRegistry } from "src/constants";
import { IModuleContainer } from "src/types";

// create function to debounce the paginate function
const debounce = (func: () => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
};

const LensFeedContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const [posts, setItems] = useState<TLensPost[] | undefined>();
    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );

    const tagsSettings = moduleData.settings.filter(
        (s) => s.setting.slug === EWidgetSettingsRegistry.IncludedTags
    );

    const tagsRef = useRef<TBaseTag[]>();
    const tags = tagsSettings.find(String)?.tags; // tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined

    const { data, isLoading } = useGetLensItemsQuery({
        page: currentPage,
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
                    return buildUniqueItemList<TLensPost>([
                        ...prevPosts,
                        ...newPosts,
                    ]);
                }
                return newPosts;
            });
        }
    }, [data?.results]);

    const pagination = extractPaginationNumbers(data?.links);

    /**
     * Create a debounced version of the paginate function to avoid calling it
     * multiple times when the user scrolls. Only call it when the user has
     * stopped scrolling for 500ms. Ensure repeated calls to the debounced
     * function will not reset the timer.
     */

    return (
        <LensFeedModule
            posts={posts || []}
            isLoading={isLoading}
            handlePaginate={() => {}}
            widgetHeight={widgetHeight}
        />
    );
};

export default LensFeedContainer;
