import { EWidgetData } from "src/api/services";
import { TUserViewWidget } from "src/api/types";
import { v4 as uuid4 } from "uuid";

export const dummyModuleData: TUserViewWidget[] = [
    {
        id: 1,
        hash: uuid4(),
        name: "Widget 1",
        widget: {
            id: 1,
            slug: "test1_sample_widget",
            name: "Widget 1",
            description: "Widget 1 description",
            short_description: "Widget 1 short description",
            icon: "widget-1.png",
            endpoint_header: {},
            endpoint_url: null,
            data_type: EWidgetData.Static,
            settings: [],
            status: 1,
            template: {
                id: 1,
                slug: "sample_template",
                name: "Sample Template",
                icon: "sample-template.png",
                status: 1,
            },
            custom_data: {},
            custom_meta: {},
            format_structure: {
                data: [
                    { name: "John Doe", age: "30" },
                    { name: "Jane Doe", age: "40" },
                    { name: "Jack Doe", age: "50" },
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
        settings: [],
        sort_order: 0,
    },
];
