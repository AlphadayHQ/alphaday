import { FC, useMemo, useState } from "react";
import { ScrollBar, Toggle, themeColors } from "@alphaday/ui-kit";
import {
    ESortFeedBy,
    ESupportedFilters,
    TFilterKeyword,
    TGroupedFilterKeywords,
} from "src/api/types";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";
import FilterSearchBar from "../FilterSearchBar";
import { TFilterOptions, TSyncedFilterOptions } from "./filterOptions";
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

const flattenGroupedKeywords = <T extends object>(
    obj: Record<string, T[]>
): T[] => {
    return Object.values(obj).reduce((acc, curr) => [...acc, ...curr], []);
};

function reduceToArrayOfSlugs(data: TSyncedFilterOptions) {
    const result: string[] = [];
    Object.values(data).forEach((value) => {
        value.options.forEach((option) => {
            if (option.selected) {
                result.push(option.slug);
            }
        });
    });
    return result;
}
interface IUserFiltersModalProps {
    onToggleFeedFilters: () => void;
    filterOptions: TFilterOptions;
    isLoading: boolean;
    onSelectFilter: (slug: string, type: ESupportedFilters) => void;
    filterKeywords: TGroupedFilterKeywords | undefined;
    onSearchInputChange: (value: string) => void;
    isFetchingKeywordResults: boolean;
}

const UserFilters: FC<IUserFiltersModalProps> = ({
    onToggleFeedFilters,
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

    const selectedSycnedFilters = reduceToArrayOfSlugs(
        filterOptions.syncedFilterOptions
    );

    let timer: NodeJS.Timeout;
    const handleSelectFilter = (
        slug: string,
        filterType: ESupportedFilters
    ) => {
        onSelectFilter(slug, filterType);
        const keyword = flattenGroupedKeywords(filterKeywords ?? {}).find(
            (k) => k.slug === slug && k.type === filterType
        );
        if (
            (filterType === ESupportedFilters.Chains ||
                filterType === ESupportedFilters.Coins ||
                filterType === ESupportedFilters.ConceptTags) &&
            keyword
        ) {
            const isSelected = selectedSycnedFilters.some(
                (selectedSlug) => selectedSlug === keyword.slug
            );
            const filterLabel =
                filterOptions.syncedFilterOptions[filterType].label;

            setMessage(
                `${!isSelected ? "Added" : "Removed"} ${keyword.name} ${!isSelected ? "to" : "from"} ${filterLabel} filters`
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
        <div className="px-5 w-full">
            <ScrollBar className="p-4">
                <div className="flex flex-start w-full items-center mb-4">
                    <ChevronSVG
                        onClick={onToggleFeedFilters}
                        tabIndex={0}
                        role="button"
                        className="w-6 h-6 mr-2 rotate-180 self-center -ml-1.5"
                    />
                    <h1 className="uppercase fontGroup-major !text-lg flex-grow text-center mb-0 focus:outline-transparent">
                        Superfeed filters
                    </h1>
                </div>
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
                                    handleSelectFilter(kw.slug, kw.type)
                                )
                            }
                            isFetchingKeywordResults={isFetchingKeywordResults}
                            selectedFilters={selectedSycnedFilters}
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
