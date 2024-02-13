import { FC } from "react";
import { SearchBar } from "@alphaday/ui-kit";
import { TBaseFilterItem } from "src/api/services";
import { Logger } from "src/api/utils/logging";

type TOption = TBaseFilterItem;

// TODO(v-almonacid): This is just a placeholder for now

const FilterSearchBar: FC = () => {
    return (
        <div
            className="two-col:mx-2.5 two-col:my-auto three-col:m-auto flex w-full justify-center"
            data-testid="header-search-container"
        >
            <span className="w-full max-w-[524px]">
                <SearchBar<TOption>
                    showBackdrop
                    onChange={() => {
                        Logger.debug("onChange called");
                    }}
                    onInputChange={() => {
                        Logger.debug("onInputChange called");
                    }}
                    placeholder="Search for assets, projects, events, etc."
                    initialSearchValues={[]}
                    options={[]}
                    trendingOptions={[]}
                    isFetchingKeywordResults={false}
                    isFetchingTrendingKeywordResults={false}
                />
            </span>
        </div>
    );
};

export default FilterSearchBar;
