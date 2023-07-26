import "src/mocks/libraryMocks";
import { TCustomItem } from "src/api/types";
import {
    validateCustomData,
    evaluateTemplate,
    EItemValidationErrorCodes,
} from "./customDataUtils";

export const validCustomData: Record<string, Record<string, unknown>>[] = [
    {
        category: {
            name: "category",
            value: "Beginners",
            type: "string",
        },
        link_name: {
            name: "link_name",
            value: "coinbase.com",
            type: "string",
        },
        exchange_url: {
            name: "exchange_url",
            value: "http://coinbase.com/",
            type: "string",
        },
        exchange_name: {
            name: "exchange_name",
            value: "Coinbase",
            type: "string",
        },
    },
];

export const invalidCustomData: Record<string, Record<string, unknown>>[] = [
    {
        category: {
            name: "category",
            value: "Beginners",
            type: "number",
        },
        tvl: {
            name: "tvl",
            value: 8,
            type: "string",
        },
        exchange_url: {
            name: "exchange_url",
            value: "http://coinbase.com/",
            type: "string",
        },
        exchange_name: {
            name: "exchange_name",
            value: "Coinbase",
            type: "string",
        },
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
        const result = validateCustomData(validCustomData);
        expect(result.errorCode).toBe(undefined);
        expect(result.items).not.toBe(undefined);
        expect(result.items?.length).toBe(validCustomData.length);

        const invalidResult = validateCustomData(invalidCustomData);
        expect(invalidResult.errorCode).toBe(
            EItemValidationErrorCodes.InvalidType
        );
    });

    test("evaluateTemplate", () => {
        [...validTemplates, ...invalidTemplates].forEach((template) => {
            expect(
                evaluateTemplate(
                    template.input,
                    validCustomData[0] as TCustomItem
                )
            ).toEqual(template.output);
        });
    });
});
