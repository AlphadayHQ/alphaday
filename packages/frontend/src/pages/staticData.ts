import { EWidgetData } from "src/api/services";
import { TUserViewWidget } from "src/api/types";
import { v4 as uuid4 } from "uuid";

export const dummyModuleData: TUserViewWidget[] = [
    {
        id: 2,
        hash: uuid4(),
        name: "DAOs",
        widget: {
            id: 2,
            slug: "test1_dao_widget",
            name: "DAOs",
            description:
                "Aggregate crypto articles from reputable crypto news sources from across the internet. Current sources include: Coindesk, CoinTelegraph, Decrypt, The Defiant, and more.",
            short_description: "Widget 1 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [],
            status: 1,
            template: {
                id: 2,
                slug: "dao_template",
                name: "DAO Template",
                icon: "sample-template.png",
                status: 1,
            },
            custom_data: {},
            custom_meta: {},
            format_structure: {},
            max_per_view: 1,
            refresh_interval: 1,
            sort_order: 1,
            featured: true,
            hide_in_library: false,
            categories: [],
        },
        settings: [],
        sort_order: 0,
    },
    {
        id: 3,
        hash: uuid4(),
        name: "News",
        widget: {
            id: 3,
            slug: "test1_news_widget",
            name: "Widget 2",
            description:
                "Aggregate crypto articles from reputable crypto news sources from across the internet. Current sources include: Coindesk, CoinTelegraph, Decrypt, The Defiant, and more.",
            short_description: "Widget 1 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [],
            status: 1,
            template: {
                id: 3,
                slug: "news_template",
                name: "News Template",
                icon: "sample-template.png",
                status: 1,
            },
            custom_data: {},
            custom_meta: {},
            format_structure: {},
            max_per_view: 1,
            refresh_interval: 1,
            sort_order: 1,
            featured: true,
            hide_in_library: false,
            categories: [],
        },
        settings: [],
        sort_order: 0,
    },
    {
        id: 4,
        hash: uuid4(),
        name: "Blog",
        widget: {
            id: 4,
            slug: "test1_blog_widget",
            name: "Widget 2",
            description:
                "Aggregate crypto articles from reputable crypto news sources from across the internet. Current sources include: Coindesk, CoinTelegraph, Decrypt, The Defiant, and more.",
            short_description: "Widget 1 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [],
            status: 1,
            template: {
                id: 4,
                slug: "blog_template",
                name: "Blog Template",
                icon: "sample-template.png",
                status: 1,
            },
            custom_data: {},
            custom_meta: {},
            format_structure: {},
            max_per_view: 1,
            refresh_interval: 1,
            sort_order: 1,
            featured: true,
            hide_in_library: false,
            categories: [],
        },
        settings: [],
        sort_order: 0,
    },
    {
        id: 5,
        hash: uuid4(),
        name: "Forum",
        widget: {
            id: 5,
            slug: "test1_forum_widget",
            name: "Widget 2",
            description:
                "Aggregate crypto articles from reputable crypto news sources from across the internet. Current sources include: Coindesk, CoinTelegraph, Decrypt, The Defiant, and more.",
            short_description: "Widget 1 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [],
            status: 1,
            template: {
                id: 5,
                slug: "forum_template",
                name: "Forum Template",
                icon: "sample-template.png",
                status: 1,
            },
            custom_data: {},
            custom_meta: {},
            format_structure: {},
            max_per_view: 1,
            refresh_interval: 1,
            sort_order: 1,
            featured: true,
            hide_in_library: false,
            categories: [],
        },
        settings: [],
        sort_order: 0,
    },
];
