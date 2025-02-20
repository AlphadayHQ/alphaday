import "src/mocks/libraryMocks";
import { TCustomItem } from "src/api/types";
import {
    validateCustomData,
    evaluateTranslationTemplate,
} from "./customDataUtils";

export const validCustomData: JSONValue = [
    null,
    [],
    {},
    [
        {
            category: "Beginners",
            link_name: "coinbase.com",
            exchange_url: "http://coinbase.com/",
            exchange_name: "Coinbase",
        },
        {
            category: "Advanced",
            link_name: "curve.fi",
            exchange_url: "http://curve.fi/",
            exchange_name: "Curve",
        },
    ],
];

export const invalidCustomData = [
    1,
    true,
    "string",
    {
        category: "Beginners",
        link_name: "coinbase.com",
        exchange_url: "http://coinbase.com/",
        exchange_name: "Coinbase",
    },
];

const validTemplates = [
    {
        input: "{{exchange_url}}",
        output: "http://coinbase.com/",
    },
    {
        input: "{{exchange_name}} is a good exchange for {{category}}",
        output: "Coinbase is a good exchange for Beginners",
    },
];

const invalidTemplates = [
    {
        input: "{exchange_url}",
        output: "{exchange_url}",
    },
    {
        input: "{{non_existing_field}} is a good exchange for {{category}}",
        output: "{{non_existing_field}} is a good exchange for {{category}}",
    },
];

describe("Tests for custom data utilities", () => {
    test("validateCustomData", () => {
        validCustomData.forEach((data) => {
            const result = validateCustomData(data);
            if (result.items !== undefined) {
                // @ts-expect-error
                expect(result.items.length).toBe(data.length);
            }
            result.items?.forEach((item) =>
                expect(item.id).not.toBe(undefined)
            );
            expect(result.errorCode).toBe(undefined);
        });
        invalidCustomData.forEach((invalidData) => {
            const result = validateCustomData(invalidData);
            expect(result.items).toBe(undefined);
            expect(result.errorCode).not.toBe(undefined);
        });
    });

    test("evaluateTranslationTemplate", () => {
        [...validTemplates, ...invalidTemplates].forEach((template) => {
            const data: TCustomItem = {
                id: 0,
                category: "Beginners",
                link_name: "coinbase.com",
                exchange_url: "http://coinbase.com/",
                exchange_name: "Coinbase",
            };
            expect(evaluateTranslationTemplate(template.input, data)).toEqual(
                template.output
            );
        });
    });
});
