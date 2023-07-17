import "src/mocks/libraryMocks";
import { TTag } from "src/api/types";
import { ETag } from "../services";
import { tagsInclude, filteringListToStr } from "./filterUtils";

const tagList = [
    {
        id: 0,
        name: "Bitcoin",
        slug: "bitcoin",
        tagType: ETag.Global,
    },
    {
        id: 1,
        name: "Ethereum",
        slug: "ethereum",
        tagType: ETag.Global,
    },
    {
        id: 2,
        name: "Polkadot",
        slug: "polkadot",
        tagType: ETag.Global,
    },
    {
        id: 3,
        name: "Bitcoin Cash",
        slug: "bitcoin-cash",
        tagType: ETag.Global,
    },
];

const someTag: TTag = {
    id: 0,
    name: "Bitcoin",
    slug: "bitcoin",
    tagType: ETag.Global,
};

const someOtherTag: TTag = {
    id: -1000,
    name: "Bitconnect",
    slug: "bitconnect",
    tagType: ETag.Global,
};

describe("tagsInclude", () => {
    test("should validate presence of tags in tagList", () => {
        expect(tagsInclude(tagList, someTag)).toEqual(true);
        expect(tagsInclude(tagList, someOtherTag)).toEqual(false);
        expect(tagsInclude([], someOtherTag)).toEqual(false);
    });
});

describe("filteringListToStr", () => {
    const formattedTagList: string = filteringListToStr(tagList);
    expect(formattedTagList).toBe("bitcoin,ethereum,polkadot,bitcoin-cash");
});
