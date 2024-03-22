import { themeColors } from "@alphaday/ui-kit";
import {
    EFeedItemType,
    ESortFeedBy,
    ESupportedFilters,
    ETimeRange,
} from "src/api/types";

export type TOption = {
    id?: number;
    name: string;
    slug: string;
    selected: boolean;
    color?: string;
    disabled?: boolean;
};

type TMediaOption = TOption & { contentType: EFeedItemType };

export type TTimeRangeOption = TOption & {
    value: number | undefined;
    color: string;
};

export type TLocalFilterOptions = {
    media: {
        label: string;
        type: ESupportedFilters.MediaTypes;
        options: TMediaOption[];
    };
    timeRange: {
        label: string;
        type: ESupportedFilters.TimeRange;
        options: TTimeRangeOption[];
    };
    sortBy: {
        label: string;
        type: ESupportedFilters.SortBy;
        options: TOption[];
    };
};
export type TSyncedFilterOptions = {
    coins: {
        label: string;
        type: ESupportedFilters.Coins;
        options: TOption[];
    };
    chains: {
        label: string;
        type: ESupportedFilters.Chains;
        options: TOption[];
    };
    conceptTags: {
        label: string;
        type: ESupportedFilters.ConceptTags;
        options: TOption[];
    };
};

export type TFilterOptions = {
    localFilterOptions: TLocalFilterOptions;
    syncedFilterOptions: TSyncedFilterOptions;
};

export const STATIC_FILTER_OPTIONS: TLocalFilterOptions = {
    media: {
        label: "Media",
        type: ESupportedFilters.MediaTypes,
        options: [
            {
                id: 1,
                name: "News",
                slug: EFeedItemType.NEWS,
                selected: false,
                color: themeColors.categoryOne,
                contentType: EFeedItemType.NEWS,
            },
            {
                id: 2,
                slug: EFeedItemType.VIDEO,
                name: "Videos",
                selected: false,
                color: themeColors.categoryTwo,
                contentType: EFeedItemType.VIDEO,
            },
            {
                id: 3,
                slug: EFeedItemType.PODCAST,
                name: "Podcasts",
                selected: false,
                color: themeColors.categoryThree,
                contentType: EFeedItemType.PODCAST,
            },
            {
                id: 4,
                slug: EFeedItemType.IMAGE,
                name: "Images",
                selected: false,
                color: themeColors.categoryFour,
                contentType: EFeedItemType.IMAGE,
                disabled: true,
            },
            {
                id: 5,
                slug: EFeedItemType.EVENT,
                name: "Events",
                selected: false,
                color: themeColors.categoryFive,
                contentType: EFeedItemType.EVENT,
            },
            {
                id: 6,
                slug: EFeedItemType.MARKET,
                name: "Price action",
                selected: false,
                color: themeColors.categorySix,
                contentType: EFeedItemType.MARKET,
            },
            {
                id: 7,
                slug: EFeedItemType.REDDIT,
                name: "Reddit",
                selected: false,
                color: themeColors.categorySeven,
                contentType: EFeedItemType.REDDIT,
            },
            {
                id: 8,
                slug: EFeedItemType.FORUM,
                name: "Forums",
                selected: false,
                color: themeColors.categoryEight,
                contentType: EFeedItemType.FORUM,
            },
            {
                id: 9,
                slug: EFeedItemType.TVL,
                name: "TVL",
                selected: false,
                color: themeColors.categoryNine,
                contentType: EFeedItemType.TVL,
            },
            {
                id: 10,
                slug: EFeedItemType.BLOG,
                name: "Blogs",
                selected: false,
                color: themeColors.categoryTen,
                contentType: EFeedItemType.BLOG,
            },
            {
                id: 11,
                slug: EFeedItemType.PERSON,
                name: "Persons",
                selected: false,
                color: themeColors.categoryEleven,
                contentType: EFeedItemType.PERSON,
                disabled: true,
            },
            {
                id: 12,
                slug: EFeedItemType.MEME,
                name: "Memes",
                selected: false,
                color: themeColors.categoryTwelve,
                contentType: EFeedItemType.MEME,
                disabled: true,
            },
            {
                id: 13,
                slug: EFeedItemType.DISCORD,
                name: "Discord",
                selected: false,
                color: themeColors.categoryTwelve,
                contentType: EFeedItemType.DISCORD,
            },
            {
                id: 14,
                slug: EFeedItemType.GAS,
                name: "Gas",
                selected: false,
                color: themeColors.categoryEleven,
                contentType: EFeedItemType.GAS,
            },
        ],
    },
    timeRange: {
        label: "Time Range",
        type: ESupportedFilters.TimeRange,
        options: [
            {
                id: 1,
                slug: ETimeRange.Anytime,
                name: "Anytime",
                value: 0,
                selected: false,
                color: "transparent",
            },
            {
                id: 2,
                slug: ETimeRange.Last24,
                name: "Last 24 hours",
                value: 1,
                selected: false,
                color: "transparent",
            },
            {
                id: 3,
                slug: ETimeRange.Last7Days,
                name: "Last 7 days",
                value: 7,
                selected: false,
                color: "transparent",
            },
            {
                id: 4,
                slug: ETimeRange.Last30Days,
                name: "Last 30 days",
                value: 30,
                selected: false,
                color: "transparent",
            },
            {
                id: 5,
                slug: ETimeRange.Last90Days,
                name: "last 90 days",
                value: 90,
                selected: false,
                color: "transparent",
            },
            {
                id: 6,
                slug: ETimeRange.Last6Months,
                name: "last 6 months",
                value: 180,
                selected: false,
                color: "transparent",
            },
        ],
    },
    sortBy: {
        label: "Trending",
        type: ESupportedFilters.SortBy,
        options: [
            {
                slug: ESortFeedBy.Trendiness,
                name: "Trendiness",
                selected: true,
            },
            {
                slug: ESortFeedBy.Date,
                name: "Date",
                selected: false,
            },
        ],
    },
};
