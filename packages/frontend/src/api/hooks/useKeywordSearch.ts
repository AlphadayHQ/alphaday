import { useState } from "react";
import {
    useGetKeywordsListQuery,
    useGetTrendingKeywordsListQuery,
} from "src/api/services";
import { TKeyword } from "src/api/types";
import { EFeaturesRegistry } from "src/constants";
import { useFeatureFlags } from "./useFeatureFlags";

interface IKeywordSearch {
    searchState: string;
    keywordResults: TKeyword[] | undefined;
    trendingKeywordResults: TKeyword[] | undefined;
    isFetchingKeywordResults: boolean;
    isFetchingTrendingKeywordResults: boolean;
    setSearchState: (s: string) => void;
}

/**
 * useKeywordSearch.
 * This hook is used in the global search bar and in module settings.
 * It is used to search for keywords, display them and add them to the view.
 *
 * @returns - The search state and results.
 */
export const useKeywordSearch: () => IKeywordSearch = () => {
    const isTrendingKeywordsAllowed = useFeatureFlags(
        EFeaturesRegistry.TrendingKeywords
    );
    const [searchState, setSearchState] = useState("");

    const {
        data: keywordsData,
        isFetching: isFetchingKeywordResults,
    } = useGetKeywordsListQuery(
        {
            search: searchState,
        },
        {
            skip: searchState === "",
        }
    );
    const {
        data: trendingKeywordsData,
        isFetching: isFetchingTrendingKeywordResults,
    } = useGetTrendingKeywordsListQuery(undefined, {
        skip: !isTrendingKeywordsAllowed,
    });

    const keywordResults = keywordsData?.results?.map((kw) => ({
        ...kw,
        tag: {
            ...kw.tag,
            tagType: kw.tag.tag_type,
        },
    }));

    const trendingKeywordResults = trendingKeywordsData?.results?.map((kw) => ({
        ...kw,
        tag: {
            ...kw.tag,
            tagType: kw.tag?.tag_type,
        },
    }));

    return {
        searchState,
        setSearchState,
        keywordResults,
        trendingKeywordResults,
        isFetchingKeywordResults,
        isFetchingTrendingKeywordResults,
    };
};
