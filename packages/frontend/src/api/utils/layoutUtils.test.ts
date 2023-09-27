import "src/mocks/libraryMocks";
import { TUserViewWidget } from "src/api/types";
import { EWidgetSettingsRegistry } from "src/constants";
import { ERemoteWidgetStatus, ETag, EWidgetData } from "../services";
import { computeLayoutGrid } from "./layoutUtils";

export const widgetsList: TUserViewWidget<unknown>[] = [
    {
        id: 160,
        hash: "2ea7861b6cac1f030f0ad74de6da6c95",
        name: "Market",
        widget: {
            id: 9,
            name: "Market",
            short_description: "Market Prices",
            description:
                "The market widget displays the price chart and the various token metrics for your favorite projects.",
            slug: "market_widget",
            icon: "",
            status: ERemoteWidgetStatus.Production,
            template: {
                id: 6,
                name: "Market Template",
                slug: "market_template",
                icon: "",
                status: 1,
            },
            data_type: EWidgetData.Static,
            endpoint_url: null,
            endpoint_header: {},
            custom_data: {},
            custom_meta: {},
            format_structure: {},
            max_per_view: 4,
            refresh_interval: 60,
            categories: [
                {
                    id: 1,
                    name: "Trading",
                    slug: "trading_widget_category",
                    featured: false,
                    sort_order: 0,
                },
            ],
            featured: false,
            hide_in_library: false,

            settings: [
                {
                    setting: {
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    sort_order: 0,
                },
            ],
            sort_order: 0,
        },

        settings: [
            {
                setting: {
                    name: "Included Tags",
                    slug: EWidgetSettingsRegistry.IncludedTags,
                    setting_type: "tags",
                },
                tags: [
                    {
                        id: 136,
                        slug: "bitcoin",
                        name: "bitcoin",
                        tag_type: ETag.Global,
                    },
                ],
                toggle_value: false,
            },
        ],
        sort_order: 0,
    },
    {
        id: 160,
        hash: "1eb7861b6cac1f030f0ad74de6da6c95",
        name: "Market3",
        widget: {
            id: 9,
            name: "Market3",
            short_description: "Market3 Prices",
            description:
                "The market widget displays the price chart and the various token metrics for your favorite projects.",
            slug: "market_widget",
            icon: "",
            status: ERemoteWidgetStatus.Production,
            template: {
                id: 6,
                name: "Market3 Template",
                slug: "market_template",
                icon: "",
                status: 1,
            },
            data_type: EWidgetData.Static,
            endpoint_url: null,
            endpoint_header: {},
            custom_data: {},
            custom_meta: {},
            format_structure: {},
            max_per_view: 4,
            refresh_interval: 60,
            categories: [
                {
                    id: 1,
                    name: "Trading",
                    slug: "trading_widget_category",
                    featured: false,
                    sort_order: 0,
                },
            ],
            featured: false,
            hide_in_library: false,

            settings: [
                {
                    setting: {
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    sort_order: 0,
                },
            ],
            sort_order: 0,
        },

        settings: [
            {
                setting: {
                    name: "Included Tags",
                    slug: EWidgetSettingsRegistry.IncludedTags,
                    setting_type: "tags",
                },
                tags: [
                    {
                        id: 136,
                        slug: "bitcoin",
                        name: "bitcoin",
                        tag_type: ETag.Global,
                    },
                ],
                toggle_value: false,
            },
        ],
        sort_order: 0,
    },
    {
        id: 160,
        hash: "2ea7861b6cac1f030f0ad74de6da6c95",
        name: "Market4",
        widget: {
            id: 9,
            name: "Market4",
            short_description: "Market4 Prices",
            description:
                "The market widget displays the price chart and the various token metrics for your favorite projects.",
            slug: "market_widget",
            icon: "",
            status: ERemoteWidgetStatus.Production,
            template: {
                id: 6,
                name: "Market4 Template",
                slug: "market_template",
                icon: "",
                status: 1,
            },
            data_type: EWidgetData.Static,
            endpoint_url: null,
            endpoint_header: {},
            custom_data: {},
            custom_meta: {},
            format_structure: {},
            max_per_view: 4,
            refresh_interval: 60,
            categories: [
                {
                    id: 1,
                    name: "Trading",
                    slug: "trading_widget_category",
                    featured: false,
                    sort_order: 0,
                },
            ],
            featured: false,
            hide_in_library: false,

            settings: [
                {
                    setting: {
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    sort_order: 0,
                },
            ],
            sort_order: 1,
        },

        settings: [
            {
                setting: {
                    name: "Included Tags",
                    slug: EWidgetSettingsRegistry.IncludedTags,
                    setting_type: "tags",
                },
                tags: [
                    {
                        id: 136,
                        slug: "bitcoin",
                        name: "bitcoin",
                        tag_type: ETag.Global,
                    },
                ],
                toggle_value: false,
            },
        ],
        sort_order: 1,
    },
    {
        id: 160,
        hash: "2ea7861b6cac1f030f0ad74de6da6c95",
        name: "Market2",
        widget: {
            id: 9,
            name: "Market2",
            short_description: "Market2 Prices",
            description:
                "The market widget displays the price chart and the various token metrics for your favorite projects.",
            slug: "market_widget",
            icon: "",
            status: ERemoteWidgetStatus.Production,
            template: {
                id: 6,
                name: "Market Template",
                slug: "market_template",
                icon: "",
                status: 1,
            },
            data_type: EWidgetData.Static,
            endpoint_url: null,
            endpoint_header: {},
            custom_data: {},
            custom_meta: {},
            format_structure: {},
            max_per_view: 4,
            refresh_interval: 60,
            categories: [
                {
                    id: 1,
                    name: "Trading",
                    slug: "trading_widget_category",
                    featured: false,
                    sort_order: 0,
                },
            ],
            featured: false,
            hide_in_library: false,

            settings: [
                {
                    setting: {
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    sort_order: 0,
                },
            ],
            sort_order: 2,
        },

        settings: [
            {
                setting: {
                    name: "Included Tags",
                    slug: EWidgetSettingsRegistry.IncludedTags,
                    setting_type: "tags",
                },
                tags: [
                    {
                        id: 136,
                        slug: "bitcoin",
                        name: "bitcoin",
                        tag_type: ETag.Global,
                    },
                ],
                toggle_value: false,
            },
        ],
        sort_order: 2,
    },
];

describe("Test for layout utilities", () => {
    test("computeLayoutGrid", () => {
        const layoutGrid = computeLayoutGrid(widgetsList);

        // widgets are positioned correctly
        expect(layoutGrid?.singleCol[0].length).toEqual(4);
        expect(layoutGrid?.twoCol[0].length).toEqual(2);
        expect(layoutGrid?.twoCol[1].length).toEqual(2);
        expect(layoutGrid?.threeCol[0].length).toEqual(2);
        expect(layoutGrid?.threeCol[1].length).toEqual(1);
        expect(layoutGrid?.threeCol[2].length).toEqual(1);
        expect(layoutGrid?.fourCol[0].length).toEqual(1);
        expect(layoutGrid?.fourCol[1].length).toEqual(1);
        expect(layoutGrid?.fourCol[2].length).toEqual(1);
        expect(layoutGrid?.fourCol[3].length).toEqual(1);

        // widegt with duplicated sort-order is placed at the end of array
        expect(layoutGrid?.singleCol[0][3].hash).toEqual(
            "1eb7861b6cac1f030f0ad74de6da6c95"
        );
    });
});
