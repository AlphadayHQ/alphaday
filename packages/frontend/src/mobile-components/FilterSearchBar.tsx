import { SearchBar } from "@alphaday/ui-kit";
import { OptionsOrGroups, GroupBase } from "react-select";
import { TBaseFilterItem } from "src/api/services";
import { debounce } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";

type TOption = TBaseFilterItem & { label: string; value: string };

interface FilterSearchBarProps<T extends TOption> {
    keywords: OptionsOrGroups<T, GroupBase<T>>;
    initialSearchValues?: T[];
    setSearchState: (value: string) => void;
    onChange: (value: readonly T[]) => void;
    isFetchingKeywordResults: boolean;
    isOptionSelected?: (option: T) => boolean;
    message?: string | null;
    debounceTime?: number | undefined;
}

const FilterSearchBar = <T extends TOption>({
    onChange,
    setSearchState,
    keywords,
    initialSearchValues,
    isFetchingKeywordResults,
    isOptionSelected,
    message,
    debounceTime,
}: FilterSearchBarProps<T>) => {
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
                    initialSearchValues={initialSearchValues ?? []}
                    options={keywords}
                    isFetchingKeywordResults={isFetchingKeywordResults}
                    isFetchingTrendingKeywordResults={false}
                    updateSearch={false}
                    isOptionSelected={isOptionSelected}
                    message={message}
                />
            </span>
        </div>
    );
};

export default FilterSearchBar;
