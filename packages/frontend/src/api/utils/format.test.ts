import { formatNumber, ENumberStyle } from "./format";

const testNumbers = [
    {
        input: 0.0000000000000015,
        expectedOutput: "0.0000000000000015",
    },
    {
        input: 0.000000000000000000001,
        expectedOutput: "0.000000000000000000001",
    },
    {
        // use 3 significant digits for fractional numbers
        input: 0.00000000000123456,
        expectedOutput: "0.00000000000123",
    },
    {
        input: "0.000001",
        expectedOutput: "0.000001",
    },
    // numbers between 1 and 1000 display max. 2 decimal places
    {
        input: 1200.12,
        expectedOutput: "1,200.1",
    },
    {
        // numbers >= 1 have limited decimal places
        input: 1.000000000000001,
        expectedOutput: "1",
    },
    {
        input: 1.01,
        expectedOutput: "1.01",
    },
    // numbers higher than 1e6 use compact form
    {
        input: "1000000",
        expectedOutput: "1M",
    },
    {
        input: "1100000",
        expectedOutput: "1.1M",
    },
    // from 100k to 1e6, max decimal places = 0
    {
        input: 100_000.124,
        expectedOutput: "100,000",
    },
];

const testPercentages = [
    {
        input: 0.15,
        expectedOutput: "0.2%",
    },
    {
        input: 0.12,
        expectedOutput: "0.1%",
    },
    {
        input: 0.0000000000000015,
        expectedOutput: "0%",
    },
    {
        input: 112,
        expectedOutput: "112%",
    },
    {
        input: 112.12,
        expectedOutput: "112.1%",
    },
];

describe("Tests for formatting utilities", () => {
    test("formatNumber (decimal)", () => {
        testNumbers.forEach((n) => {
            const result = formatNumber({ value: n.input });
            expect(result.value).toBe(n.expectedOutput);
        });
    });

    test("formatNumber (percentage)", () => {
        testPercentages.forEach((n) => {
            const result = formatNumber({
                value: n.input,
                style: ENumberStyle.Percent,
                normalise: true,
            });
            expect(result.value).toBe(n.expectedOutput);
        });
    });
});
