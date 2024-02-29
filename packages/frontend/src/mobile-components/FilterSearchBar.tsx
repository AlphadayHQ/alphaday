import { FC } from "react";
import { SearchBar } from "@alphaday/ui-kit";
import { TBaseFilterItem } from "src/api/services";
import { Logger } from "src/api/utils/logging";

type TOption = TBaseFilterItem;

interface FilterSearchBarProps<T extends TBaseFilterItem = TOption> {
    tags?: string;
    tagsList: T[];
    setSearchState: (value: string) => void;
    onChange: (value: readonly T[]) => void;
}

const FilterSearchBar = <T extends TBaseFilterItem>({
    onChange,
    tags,
    setSearchState,
    tagsList,
}: FilterSearchBarProps<T>) => {
    const searchValues = tags
        ?.split(",")
        .map((tag) => {
            return tagsList.filter((t) => t.slug === tag)[0];
        })
        .filter((t) => t);

    return (
        <div
            className="two-col:mx-2.5 two-col:my-auto three-col:m-auto flex w-full justify-center"
            data-testid="header-search-container"
        >
            <span className="w-full max-w-[524px]">
                <SearchBar<T>
                    showBackdrop
                    onChange={(o) => {
                        Logger.debug("onChange called");
                        onChange(o);
                    }}
                    onInputChange={(searchString) => {
                        Logger.debug("onInputChange called");
                        setSearchState(searchString);
                    }}
                    placeholder="Search for assets, projects, events, etc."
                    initialSearchValues={searchValues ?? []}
                    options={tagsList}
                    isFetchingKeywordResults={false}
                    isFetchingTrendingKeywordResults={false}
                />
            </span>
        </div>
    );
};

export default FilterSearchBar;
