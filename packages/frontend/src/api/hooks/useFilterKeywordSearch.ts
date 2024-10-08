import { useMemo, useState } from "react";
import { useGetFilterKeywordsQuery } from "src/api/services";
import { TGroupedFilterKeywords, ESupportedFilters } from "src/api/types";

interface IFilterKeywordSearch {
    searchState: string;
    keywordResults: TGroupedFilterKeywords | undefined;
    isFetchingKeywordResults: boolean;
    setSearchState: (s: string) => void;
}

/**
 * useFilterKeywordSearch.
 * Pretty similar to useKeywordSearch, but instead of consuming the keywords endpoint,
 * it queries the superfeed/filter_keywords endpoint.
 * The main difference is that the results are grouped in categories (concept tags, coins, projects, etc).
 * This hook is used in the UserFilter page.
 * It is used to search for keywords, display them and add them to the view.
 *
 * @returns - The search state and results.
 */
export const useFilterKeywordSearch: () => IFilterKeywordSearch = () => {
    const [searchState, setSearchState] = useState("");

    const { data: keywordsData, isFetching: isFetchingKeywordResults } =
        useGetFilterKeywordsQuery(
            {
                filter_text: searchState,
            },
            {
                skip: searchState === "",
            }
        );

    const keywordResults = useMemo(() => {
        if (!keywordsData) return undefined;
        return {
            [ESupportedFilters.ConceptTags]: keywordsData.conceptTags
                .slice(0, 6)
                .map((keyword) => ({
                    id: keyword.id,
                    name: keyword.name,
                    slug: keyword.tag.slug,
                    type: ESupportedFilters.ConceptTags,
                })),
            [ESupportedFilters.Chains]: keywordsData.chains
                .slice(0, 6)
                .map((keyword) => ({
                    id: keyword.id,
                    name: keyword.name,
                    slug: keyword.tag.slug,
                    type: ESupportedFilters.Chains,
                })),
            [ESupportedFilters.Coins]: keywordsData.coins
                .slice(0, 6)
                .map((keyword) => ({
                    id: keyword.id,
                    name: keyword.name,
                    slug: keyword.tag.slug,
                    type: ESupportedFilters.Coins,
                })),
        };
    }, [keywordsData]);

    return {
        searchState,
        setSearchState,
        keywordResults,
        isFetchingKeywordResults,
    };
};
