import {
    extractPageNumber,
    extractPaginationNumbers,
    TPaginationLinks,
} from "./pagination";

describe("extractPageNumber", () => {
    it("should return undefined for null url", () => {
        expect(extractPageNumber(null)).toBeUndefined();
    });

    it("should extract page number from valid url", () => {
        expect(
            extractPageNumber("https://api.alphaday.com/items/news/?page=12")
        ).toBe(12);
    });

    it("should handle url with additional parameters", () => {
        expect(
            extractPageNumber(
                "https://api.alphaday.com/items/news/?page=5&limit=10"
            )
        ).toBe(5);
    });

    it("should return undefined for url without page parameter", () => {
        expect(
            extractPageNumber("https://api.alphaday.com/items/news/")
        ).toBeUndefined();
    });

    it("should handle url with page parameter at start", () => {
        expect(
            extractPageNumber(
                "https://api.alphaday.com/items/news/?page=1&other=stuff"
            )
        ).toBe(1);
    });
});

describe("extractPaginationNumbers", () => {
    it("should return undefined values when links is undefined", () => {
        expect(extractPaginationNumbers(undefined)).toEqual({
            next: undefined,
            previous: undefined,
        });
    });

    it("should extract page numbers from valid links", () => {
        const links: TPaginationLinks = {
            next: "https://api.alphaday.com/items/news/?page=3",
            previous: "https://api.alphaday.com/items/news/?page=1",
        };
        expect(extractPaginationNumbers(links)).toEqual({
            next: 3,
            previous: 1,
        });
    });

    it("should handle null values in links", () => {
        const links: TPaginationLinks = {
            next: null,
            previous: "https://api.alphaday.com/items/news/?page=1",
        };
        expect(extractPaginationNumbers(links)).toEqual({
            next: undefined,
            previous: 1,
        });
    });

    it("should handle both null values in links", () => {
        const links: TPaginationLinks = {
            next: null,
            previous: null,
        };
        expect(extractPaginationNumbers(links)).toEqual({
            next: undefined,
            previous: undefined,
        });
    });

    it("should handle invalid urls in links", () => {
        const links: TPaginationLinks = {
            next: "https://api.alphaday.com/items/news/",
            previous: "https://api.alphaday.com/items/news/",
        };
        expect(extractPaginationNumbers(links)).toEqual({
            next: undefined,
            previous: undefined,
        });
    });
});
