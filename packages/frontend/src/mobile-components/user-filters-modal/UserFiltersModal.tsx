import { FC, useState } from "react";
import {
    FullPageModal,
    ScrollBar,
    Toggle,
    themeColors,
} from "@alphaday/ui-kit";
import { ESortFeedBy, ESupportedFilters, TFilterKeyword } from "src/api/types";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";
import FilterSearchBar from "../FilterSearchBar";
import { TFilterOptions } from "./filterOptions";
import { OptionsDisclosure, OptionButton } from "./OptionsDisclosure";

interface IUserFiltersModalProps {
    onToggleFeedFilters: () => void;
    show: boolean;
    filterOptions: TFilterOptions;
    isLoading: boolean;
    onSelectFilter: (slug: string, type: ESupportedFilters) => void;
    filterKeywords: TFilterKeyword[];
    onSearchInputChange: (value: string) => void;
    isFetchingKeywordResults: boolean;
}

const UserFiltersModal: FC<IUserFiltersModalProps> = ({
    onToggleFeedFilters,
    show,
    filterOptions,
    isLoading,
    onSelectFilter,
    filterKeywords,
    onSearchInputChange,
    isFetchingKeywordResults,
}) => {
    const [isOpen, setIsOpen] = useState(true);

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

    if (show) {
        return (
            <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
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
                            Craft your ideal superfeed by customizing the
                            filters below.
                        </p>
                        <div className="flex relative z-10 justify-center [&>div]:w-full">
                            <FilterSearchBar<TFilterKeyword>
                                setSearchState={onSearchInputChange}
                                tagsList={filterKeywords.map((kw) => ({
                                    ...kw,
                                    label: kw.name,
                                    value: kw.slug,
                                }))}
                                onChange={(values) =>
                                    values.forEach((kw) =>
                                        onSelectFilter(kw.slug, kw.type)
                                    )
                                }
                                isFetchingKeywordResults={
                                    isFetchingKeywordResults
                                }
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-between py-6 border-b border-borderLine">
                        <p className="fontGroup-highlight uppercase mb-0 self-center">
                            trending
                        </p>
                        <Toggle
                            enabled={
                                sortByState?.slug === ESortFeedBy.Trendiness
                            }
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
                                            onSelectFilter(
                                                option.slug,
                                                media.type
                                            )
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
                                            bgColor={
                                                themeColors.accentVariant100
                                            }
                                            selected={
                                                selectedTimeRange.selected
                                            }
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
            </FullPageModal>
        );
    }
    return null;
};

export default UserFiltersModal;
