import { SearchBar } from "@alphaday/ui-kit";
import { TBaseFilterItem } from "src/api/services";
import { debounce } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";

type TOption = TBaseFilterItem;

interface FilterSearchBarProps<T extends TBaseFilterItem = TOption> {
    tags?: string;
    tagsList: T[];
    setSearchState: (value: string) => void;
    onChange: (value: readonly T[]) => void;
    isFetchingKeywordResults: boolean;
    selectedFilters?: string[];
    message?: string | null;
    debounceTime?: number | undefined;
}

const FilterSearchBar = <T extends TBaseFilterItem>({
    onChange,
    tags,
    setSearchState,
    tagsList,
    isFetchingKeywordResults,
    selectedFilters,
    message,
    debounceTime,
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
            <span className="w-full max-w-[524px] mt-2">
                <SearchBar<T>
                    showBackdrop
                    onChange={(o) => {
                        Logger.debug("onChange called", o);
                        onChange(o);
                    }}
                    onInputChange={debounce((searchString: string) => {
                        Logger.debug("onInputChange called", searchString);
                        setSearchState(searchString);
                    }, debounceTime ?? 500)}
                    placeholder="Search for assets, projects, events, etc."
                    initialSearchValues={searchValues ?? []}
                    options={tagsList}
                    isFetchingKeywordResults={isFetchingKeywordResults}
                    isFetchingTrendingKeywordResults={false}
                    updateSearch={false}
                    selectedOptionValues={selectedFilters}
                    message={message}
                />
            </span>
        </div>
    );
};

export default FilterSearchBar;
