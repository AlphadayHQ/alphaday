import ReactMarkdown from "react-markdown";
import renderer from "react-test-renderer";
import { slugify, isURL, containsURLs, remarkRegex } from "./textUtils";

describe("Test for text Utilities", () => {
    test("slugify()", () => {
        const slugTests = [
            { test: " bitcoin ", result: "bitcoin" },
            { test: "terra luna", result: "terra-luna" },
            { test: "Bitcoin Cash", result: "bitcoin-cash" },
        ];
        slugTests.forEach(({ test, result }) => {
            expect(slugify(test)).toBe(result);
        });
    });

    test("isURL()", () => {
        const validURLs = [
            "http://www.alphaday.com",
            "HTTPS://ALPHADAY.COM",
            "https://www.alphaday.com",
            "https://www.alphaday.com/",
            "https://alphaday.com/",
            "https://localhost",
        ];
        const invalidURLs = [
            "www.alphaday.com",
            "//www.alphaday.com/",
            "(http://www.alphaday.com)",
            "http://www.alphaday.com.",
            "",
            null,
            undefined,
        ];
        validURLs.forEach((url) => expect(isURL(url)).toBe(true));
        // @ts-expect-error
        invalidURLs.forEach((url) => expect(isURL(url)).toBe(false));
    });

    test("containsURLs()", () => {
        const valid = [
            "http://www.alphaday.com",
            "http://www.alphaday.com https://google.com",
            "Check out http://www.alphaday.com.",
            "\n\n\nhttps://www.alphaday.com has the best crypto dashboards.\n",
            "/https://www.alphaday.com//",
            "(https://alphaday.com/)",
            "...lorem ipsum (https://alphaday.com/).\nLorem ipsum",
            "https://localhost",
        ];
        const invalid = [
            "Check out www.alphaday.com.",
            "This won't work //www.alphaday.com/",
            "(www.alphaday.com)",
            "",
            null,
            undefined,
        ];
        valid.forEach((url) => expect(containsURLs(url)).toBe(true));
        // @ts-expect-error
        invalid.forEach((url) => expect(containsURLs(url)).toBe(false));
    });

    test("remarkRegex()", () => {
        const plugins = [remarkRegex(/(https?:\/\/[^\s]+)/g)];
        const tree = renderer
            .create(
                ReactMarkdown({
                    remarkPlugins: plugins,
                    children: "Check out https://www.alphaday.com.",
                })
            )
            .toJSON();

        const snapshot = `<p>Check out <a href="https://www.alphaday.com">https://www.alphaday.com</a>.</p>`;

        expect(tree).toMatchSnapshot(snapshot);
    });
});
