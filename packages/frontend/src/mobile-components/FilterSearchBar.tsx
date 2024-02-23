import { FC, useEffect } from "react";
import { SearchBar } from "@alphaday/ui-kit";
import { useKeywordSearch } from "src/api/hooks/useKeywordSearch";
import { TBaseFilterItem } from "src/api/services";
import { Logger } from "src/api/utils/logging";

type TOption = TBaseFilterItem;

interface FilterSearchBarProps {
    tags?: string;
    onChange?: (value: readonly TOption[]) => void;
}

const FilterSearchBar: FC<FilterSearchBarProps> = ({ onChange, tags }) => {
    const { setSearchState, keywordResults } = useKeywordSearch();

    useEffect(() => {
        /**
         * If tags have been passed in, but keywordResults have not been fetched yet,
         * It means the tags are being passed in from the URL or some other source.
         *
         * In this case, we want to set the search state to the tags.
         */
        if (tags && !keywordResults) {
            setSearchState(tags);
        }
    }, [tags, keywordResults, setSearchState]);

    const tagList =
        keywordResults?.map((kw) => ({
            name: kw.tag.name,
            slug: kw.tag.slug,
            id: kw.tag.id,
            label: kw.tag.name,
            value: kw.tag.slug,
        })) ?? [];

    const searchValues = tags
        ?.split(",")
        .map((tag) => {
            return tagList.filter((t) => t.slug === tag)[0];
        })
        .filter((t) => t);

    return (
        <div
            className="two-col:mx-2.5 two-col:my-auto three-col:m-auto flex w-full justify-center"
            data-testid="header-search-container"
        >
            <span className="w-full max-w-[524px]">
                <SearchBar<TOption>
                    showBackdrop
                    onChange={(o) => {
                        Logger.debug("onChange called");
                        onChange?.(o);
                    }}
                    onInputChange={(e) => {
                        Logger.debug("onInputChange called");
                        setSearchState(e);
                    }}
                    placeholder="Search for assets, projects, events, etc."
                    initialSearchValues={searchValues ?? []}
                    options={tagList}
                    isFetchingKeywordResults={false}
                    isFetchingTrendingKeywordResults={false}
                />
            </span>
        </div>
    );
};

export default FilterSearchBar;
