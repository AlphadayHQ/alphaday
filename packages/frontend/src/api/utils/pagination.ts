/**
 * extracts page number from url of the form:
 * "https://api.alphaday.com/items/news/?page=12"
 */
export const extractPageNumber: (url: string | null) => number | undefined = (
    url
) => {
    if (url == null) return undefined;
    const REGEX = /^.*\page=(\d+).*$/;
    const matchResult = REGEX.exec(url);
    if (matchResult) {
        return parseInt(matchResult[1], 10);
    }
    return undefined;
};

export type TPaginationAction = "next" | "previous";

export type TPaginationLinks =
    | {
          next: string | null;
          previous: string | null;
      }
    | undefined;
export type TPaginationNumbers = {
    next: number | undefined;
    previous: number | undefined;
};
export const extractPaginationNumbers: (
    links: TPaginationLinks
) => TPaginationNumbers = (links) => {
    if (links === undefined) {
        return {
            next: undefined,
            previous: undefined,
        };
    }
    return {
        next: extractPageNumber(links.next),
        previous: extractPageNumber(links.previous),
    };
};
