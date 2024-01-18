import { EWidgetData } from "src/api/services";
import { TUserViewWidget } from "src/api/types";
import { v4 as uuid4 } from "uuid";
import { EWidgetSettingsRegistry } from "src/constants";
import { TItem } from "src/types";

export const tableModuleDataMock: TUserViewWidget<TItem[]>[] = [
    {
        id: 1,
        hash: uuid4(),
        name: "Widget 1",
        widget: {
            id: 1,
            slug: "test1_table_widget",
            name: "Widget 1",
            description: "Widget 1 description",
            short_description: "Widget 1 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [
                {
                    setting: {
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    sort_order: 1,
                },
            ],
            status: 1,
            template: {
                id: 1,
                slug: "table_template",
                name: "Table Template",
                icon: "table-template.png",
                status: 1,
            },
            custom_data: undefined,
            custom_meta: undefined,
            format_structure: {
                data: [
                    { id: "1", name: "John Doe", age: "30" },
                    { id: "2", name: "Jane Doe", age: "40" },
                    { id: "3", name: "Jack Doe", age: "50" },
                ],
                columns: [
                    {
                        name: "Name",
                        field: {
                            name: "name",
                            type: "string",
                        },
                        column_type: "string",
                        width: 5,
                    },
                    {
                        name: "Age",
                        field: {
                            name: "age",
                            type: "number",
                        },
                        column_type: "number",
                        width: 5,
                    },
                ],
            },
            max_per_view: 1,
            refresh_interval: 1,
            sort_order: 1,
            featured: true,
            hide_in_library: false,
            categories: [],
        },
        settings: [
            {
                widget_setting: {
                    setting: {
                        name: "Included Tags",
                        setting_type: "tags",
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    default_toggle_value: null,
                    sort_order: 0,
                },
                tags: [],
                toggle_value: false,
            },
        ],
        sort_order: 0,
    },
    {
        id: 2,
        hash: uuid4(),
        name: "Widget 2",
        widget: {
            id: 1,
            slug: "test2_table_widget",
            name: "Widget 2",
            description: "Widget 2 description",
            short_description: "Widget 2 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [
                {
                    setting: {
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    sort_order: 1,
                },
            ],
            status: 1,
            template: {
                id: 1,
                slug: "table_template",
                name: "Table Template",
                icon: "table-template.png",
                status: 1,
            },
            custom_data: undefined,
            custom_meta: undefined,
            format_structure: {
                data: [
                    { id: "1", job: "Developer", pay: "50.670090" },
                    { id: "2", job: "Designer", pay: "60.4500978" },
                ],
                columns: [
                    {
                        name: "Jobs",
                        field: {
                            name: "job",
                            type: "string",
                        },
                        column_type: "string",
                        width: 5,
                    },
                    {
                        name: "Pay",
                        field: {
                            name: "pay",
                            type: "number",
                        },
                        column_type: "decimal",
                        width: 5,
                    },
                ],
            },
            max_per_view: 1,
            refresh_interval: 1,
            sort_order: 1,
            featured: true,
            hide_in_library: false,
            categories: [],
        },
        settings: [
            {
                widget_setting: {
                    setting: {
                        name: "Included Tags",
                        setting_type: "tags",
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    default_toggle_value: null,
                    sort_order: 0,
                },
                tags: [],
                toggle_value: false,
            },
        ],
        sort_order: 0,
    },
];

// v2 of our table widget structure
export const customTableModuleDataMock: TUserViewWidget[] = [
    {
        id: 1,
        hash: uuid4(),
        name: "Widget 1",
        widget: {
            id: 1,
            slug: "test1_table_widget",
            name: "Widget 1",
            description: "Widget 1 description",
            short_description: "Widget 1 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [
                {
                    setting: {
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    sort_order: 1,
                },
            ],
            status: 1,
            template: {
                id: 1,
                slug: "custom_table_template",
                name: "Table Template",
                icon: "table-template.png",
                status: 1,
            },
            custom_data: [
                {
                    id: 0,
                    category: "Beginners",
                    link_name: "coinbase.com",
                    exchange_url: "http://coinbase.com/",
                    exchange_name: "Coinbase",
                },
            ],
            custom_meta: {
                layout_type: "table",
                layout: {
                    columns: [
                        {
                            id: 0,
                            title: "Best for",
                            template: "{{category}}",
                            format: "plain-text",
                            width: 1,
                        },
                        {
                            id: 1,
                            title: "Exchange Name",
                            template: "{{exchange_name}}",
                            format: "plain-text",
                            width: 1,
                        },
                        {
                            id: 2,
                            title: "URL",
                            template: "{{exchange_url}}",
                            format: "link",
                            width: 1,
                        },
                    ],
                },
            },
            format_structure: {},
            max_per_view: 1,
            refresh_interval: 1,
            sort_order: 1,
            featured: true,
            hide_in_library: false,
            categories: [],
        },
        settings: [
            {
                widget_setting: {
                    setting: {
                        name: "Included Tags",
                        setting_type: "tags",
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    default_toggle_value: null,
                    sort_order: 0,
                },
                tags: [],
                toggle_value: false,
            },
        ],
        sort_order: 0,
    },
    {
        id: 2,
        hash: uuid4(),
        name: "Widget 2",
        widget: {
            id: 1,
            slug: "test2_table_widget",
            name: "Widget 2",
            description: "Widget 2 description",
            short_description: "Widget 2 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [
                {
                    setting: {
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    sort_order: 1,
                },
            ],
            status: 1,
            template: {
                id: 1,
                slug: "custom_table_template",
                name: "Table Template",
                icon: "table-template.png",
                status: 1,
            },
            custom_data: [
                {
                    id: 0,
                    job: "Developer",
                    pay: 50.67009,
                },
            ],
            custom_meta: {
                layout_type: "table",
                layout: {
                    columns: [
                        {
                            id: 0,
                            title: "Jobs",
                            template: "{{job}}",
                            format: "plain-text",
                            width: 1,
                        },
                        {
                            id: 1,
                            title: "Pay",
                            template: "{{pay}}",
                            format: "decimal",
                            width: 1,
                        },
                    ],
                },
            },
            format_structure: {},
            max_per_view: 1,
            refresh_interval: 1,
            sort_order: 1,
            featured: true,
            hide_in_library: false,
            categories: [],
        },
        settings: [
            {
                widget_setting: {
                    setting: {
                        name: "Included Tags",
                        setting_type: "tags",
                        slug: EWidgetSettingsRegistry.IncludedTags,
                    },
                    default_toggle_value: null,
                    sort_order: 0,
                },
                tags: [],
                toggle_value: false,
            },
        ],
        sort_order: 0,
    },
];
