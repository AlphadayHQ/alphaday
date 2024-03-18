import { FC, useMemo, useState } from "react";
import { ScrollBar, Toggle, themeColors } from "@alphaday/ui-kit";
import {
    ESortFeedBy,
    ESupportedFilters,
    TFilterKeyword,
    TGroupedFilterKeywords,
} from "src/api/types";
import FilterSearchBar from "../FilterSearchBar";
import { TFilterOptions } from "./filterOptions";
import { OptionsDisclosure, OptionButton } from "./OptionsDisclosure";

type TFilterKeywordOption = TFilterKeyword & {
    label: string;
    value: string;
};
type TFilterKeywordOptionGroup = {
    label: string;
    options: TFilterKeywordOption[];
};

const GROUP_NAME_MAP: Record<string, string> = {
    [ESupportedFilters.Chains]: "Chains",
    [ESupportedFilters.Coins]: "Coins",
    [ESupportedFilters.ConceptTags]: "Other",
};

interface IUserFiltersProps {
    filterOptions: TFilterOptions;
    isLoading: boolean;
    onSelectFilter: (slug: string, type: ESupportedFilters) => void;
    filterKeywords: TGroupedFilterKeywords | undefined;
    onSearchInputChange: (value: string) => void;
    isFetchingKeywordResults: boolean;
}

const UserFilters: FC<IUserFiltersProps> = ({
    filterOptions,
    isLoading,
    onSelectFilter,
    filterKeywords,
    onSearchInputChange,
    isFetchingKeywordResults,
}) => {
    const [message, setMessage] = useState<string | null>(null);
    const { media, timeRange, sortBy } = filterOptions.localFilterOptions;

    const selectedTimeRange = timeRange.options.find(
        (option) => option.selected
    );

    const handleDateSelect = (slug: string) => {
        if (slug !== selectedTimeRange?.slug) {
            onSelectFilter(slug, ESupportedFilters.TimeRange);
        }
    };

    const sortByState = sortBy.options.find((option) => option.selected);
    const toggleTrending = () => {
        onSelectFilter(
            sortByState?.slug === ESortFeedBy.Trendiness
                ? ESortFeedBy.Date
                : ESortFeedBy.Trendiness,
            ESupportedFilters.SortBy
        );
    };

    const isFilterSelected = (type: ESupportedFilters, slug: string) => {
        if (
            type === ESupportedFilters.Chains ||
            type === ESupportedFilters.Coins ||
            type === ESupportedFilters.ConceptTags
        ) {
            return !!filterOptions.syncedFilterOptions[type].options.find(
                (option) => option.slug === slug
            )?.selected;
        }
        return false;
    };

    let timer: NodeJS.Timeout;
    const handleSelectFilter = (
        name: string,
        slug: string,
        filterType: ESupportedFilters
    ) => {
        onSelectFilter(slug, filterType);
        if (
            filterType === ESupportedFilters.Chains ||
            filterType === ESupportedFilters.Coins ||
            filterType === ESupportedFilters.ConceptTags
        ) {
            const isSelected = isFilterSelected(filterType, slug);

            const filterLabel =
                filterOptions.syncedFilterOptions[filterType].label;

            setMessage(
                `${!isSelected ? "Added" : "Removed"} ${name} ${!isSelected ? "to" : "from"} ${filterLabel} filters`
            );
            clearTimeout(timer);
            timer = setTimeout(() => setMessage(null), 3000);
        }
    };

    const filterKeywordOptions = useMemo(() => {
        if (!filterKeywords) return [];
        return Object.entries(filterKeywords)
            .reduce(
                (acc, [currKey, currVal]) => [
                    ...acc,
                    {
                        label: GROUP_NAME_MAP[currKey] ?? currKey,
                        options: currVal.map((kw) => ({
                            ...kw,
                            label: kw.name,
                            value: kw.slug,
                        })),
                    },
                ],
                [] as TFilterKeywordOptionGroup[]
            )
            .sort((a, d) => a.label.localeCompare(d.label));
    }, [filterKeywords]);

    return (
        <div className="w-full">
            <ScrollBar className="p-4">
                <div className="w-full">
                    <p className="fontGroup-highlight">
                        Craft your ideal superfeed by customizing the filters
                        below.
                    </p>
                    <div className="flex relative z-10 justify-center [&>div]:w-full">
                        <FilterSearchBar<TFilterKeywordOption>
                            setSearchState={onSearchInputChange}
                            keywords={filterKeywordOptions}
                            onChange={(values) =>
                                values.forEach((kw) =>
                                    handleSelectFilter(
                                        kw.name,
                                        kw.slug,
                                        kw.type
                                    )
                                )
                            }
                            isFetchingKeywordResults={isFetchingKeywordResults}
                            IsOptionSelected={(op) =>
                                isFilterSelected(op.type, op.slug)
                            }
                            message={message}
                        />
                    </div>
                </div>
                <div className="w-full flex justify-between py-6 border-b border-borderLine">
                    <p className="fontGroup-highlight uppercase mb-0 self-center">
                        trending
                    </p>
                    <Toggle
                        enabled={sortByState?.slug === ESortFeedBy.Trendiness}
                        onChange={() => toggleTrending()}
                    />
                </div>
                <div className="w-full flex flex-col justify-between py-6 border-b border-borderLine">
                    <OptionsDisclosure
                        title={media.label}
                        options={media.options}
                        onSelect={(slug: string) =>
                            onSelectFilter(slug, media.type)
                        }
                        pillType
                    >
                        <div className="w-full flex flex-wrap -ml-1">
                            {media.options.map((option) => (
                                <OptionButton
                                    key={`${option.id}- ${option.name}`}
                                    name={option.name}
                                    bgColor={
                                        option.color ??
                                        themeColors.accentVariant100
                                    }
                                    selected={option.selected}
                                    onClick={() =>
                                        onSelectFilter(option.slug, media.type)
                                    }
                                />
                            ))}
                        </div>
                    </OptionsDisclosure>
                </div>
                {Object.values(filterOptions.syncedFilterOptions).map(
                    (filter) => (
                        <div
                            key={filter.type}
                            className="w-full flex flex-col justify-between py-6 border-b border-borderLine"
                        >
                            <OptionsDisclosure
                                title={filter.label}
                                options={filter.options}
                                onSelect={(slug: string) =>
                                    onSelectFilter(slug, filter.type)
                                }
                                pillType
                                isLoading={isLoading}
                            >
                                <div className="w-full flex flex-wrap -ml-1">
                                    {filter.options.map((option) => (
                                        <OptionButton
                                            key={option.slug}
                                            name={option.name}
                                            bgColor={
                                                option.color ??
                                                themeColors.accentVariant100
                                            }
                                            selected={option.selected}
                                            onClick={() =>
                                                onSelectFilter(
                                                    option.slug,
                                                    filter.type
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </OptionsDisclosure>
                        </div>
                    )
                )}
                <div className="w-full flex flex-col justify-between py-6 border-b border-borderLine">
                    <OptionsDisclosure
                        title={timeRange.label}
                        subtext="Filter based on publication date."
                        options={timeRange.options}
                        onSelect={(slug: string) => handleDateSelect(slug)}
                    >
                        <fieldset>
                            <div className="w-full flex flex-wrap pb-2 -ml-1">
                                {selectedTimeRange && (
                                    <OptionButton
                                        key={selectedTimeRange.id}
                                        name={selectedTimeRange.name}
                                        bgColor={themeColors.accentVariant100}
                                        selected={selectedTimeRange.selected}
                                        onClick={() => {}}
                                    />
                                )}
                            </div>
                            <div className="space-y-4">
                                {timeRange.options.map((option) => (
                                    <div
                                        key={option.slug}
                                        className="flex items-center cursor-pointer"
                                        role="radio"
                                        tabIndex={0}
                                        aria-checked={option.selected}
                                        onClick={() =>
                                            handleDateSelect(option.slug)
                                        }
                                    >
                                        <input
                                            id={option.slug}
                                            name="notification-method"
                                            type="radio"
                                            className="h-4 w-4 border-borderLine text-accentBlue100 focus:ring-accentBlue100 cursor-pointer"
                                            checked={
                                                option.slug ===
                                                selectedTimeRange?.slug
                                            }
                                        />
                                        <label
                                            htmlFor={option.slug}
                                            className="ml-3 block text-sm font-medium leading-6 text-primary cursor-pointer"
                                        >
                                            {option.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </OptionsDisclosure>
                </div>
            </ScrollBar>
        </div>
    );
};

export default UserFilters;
