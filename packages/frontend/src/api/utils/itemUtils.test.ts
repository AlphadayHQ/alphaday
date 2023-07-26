import "src/mocks/libraryMocks";
import { TBaseItem } from "src/api/types";
import { ETag } from "../services";
import {
    buildUniqueItemList,
    itemsInclude,
    itemListsAreEqual,
} from "./itemUtils";

export const itemList: TBaseItem[] = [
    {
        id: 0,
        title: "BTC",
        url: "www.btc.io",
        sourceIcon: "bitcoin.ico",
        sourceSlug: "bitcoin-slug",
        sourceName: "bitcointraders",
        bookmarked: false,
    },

    {
        id: 1,
        title: "ETH",
        url: "www.ethereum.eth",
        sourceIcon: "ethereum.ico",
        sourceSlug: "ethereum-slug",
        sourceName: "ethereumtraders",
        bookmarked: false,
    },

    {
        id: 2,
        title: "DOT",
        url: "www.dot.io",
        sourceIcon: "polkadot.ico",
        sourceSlug: "polkadot-slug",
        sourceName: "polkadottraders",
        bookmarked: false,
    },

    {
        id: 3,
        title: "BTCC",
        url: "www.btcc.io",
        sourceIcon: "btccash.ico",
        sourceSlug: "bttc-slug",
        sourceName: "btcctraders",
        bookmarked: false,
    },
];

export const itemListWithDuplicates = [
    {
        id: 0,
        title: "BTC",
        url: "www.btc.io",
        sourceIcon: "bitcoin.ico",
        sourceSlug: "bitcoin-slug",
        sourceName: "bitcointraders",
        tags: [
            {
                id: 0,
                name: "Bitcoin",
                slug: "bitcoin",
                tagType: ETag.Global,
            },
        ],
        bookmarked: false,
    },

    {
        id: 1,
        title: "ETH",
        url: "www.ethereum.eth",
        sourceIcon: "ethereum.ico",
        sourceSlug: "ethereum-slug",
        sourceName: "ethereumtraders",
        tags: [
            {
                id: 1,
                name: "Ethereum",
                slug: "ethereum",
                tagType: ETag.Global,
            },
        ],
        bookmarked: false,
    },

    {
        id: 3,
        title: "BTCC",
        url: "www.btcc.io",
        sourceIcon: "btccash.ico",
        sourceSlug: "bttc-slug",
        sourceName: "btcctraders",
        tags: [
            {
                id: 3,
                name: "Bitcoin",
                slug: "bitcoin",
                tagType: ETag.Global,
            },
        ],
        bookmarked: false,
    },

    {
        id: 2,
        title: "DOT",
        url: "www.dot.io",
        sourceIcon: "polkadot.ico",
        sourceSlug: "polkadot-slug",
        sourceName: "polkadottraders",
        tags: [
            {
                id: 2,
                name: "Polkadot",
                slug: "polkadot",
                tagType: ETag.Global,
            },
        ],
        bookmarked: false,
    },

    {
        id: 0,
        title: "BTC",
        url: "www.btc.io",
        sourceIcon: "bitcoin.ico",
        sourceSlug: "bitcoin-slug",
        sourceName: "bitcointraders",
        tags: [
            {
                id: 0,
                name: "Bitcoin",
                slug: "bitcoin",
                tagType: ETag.Global,
            },
        ],
        bookmarked: false,
    },

    {
        id: 3,
        title: "BTCC",
        url: "www.btcc.io",
        sourceIcon: "btccash.ico",
        sourceSlug: "bttc-slug",
        sourceName: "btcctraders",
        tags: [
            {
                id: 3,
                name: "Bitcoin",
                slug: "bitcoin",
                tagType: ETag.Global,
            },
        ],
        bookmarked: false,
    },
];

describe("Test for item utilities", () => {
    test("itemsInclude", () => {
        const item: TBaseItem = {
            id: 2,
            title: "DOT",
            url: "www.dot.io",
            sourceIcon: "polkadot.ico",
            sourceSlug: "polkadot-slug",
            sourceName: "polkadottraders",
            bookmarked: false,
        };
        expect(itemsInclude(itemList, item)).toEqual(true);
    });

    test("buildUniqueItemList", () => {
        const uniqueItemList = buildUniqueItemList(itemList);
        const uniqueItemListFromDuplicateList = buildUniqueItemList(
            itemListWithDuplicates
        );
        expect(uniqueItemList).toStrictEqual(itemList);
        expect(uniqueItemListFromDuplicateList).not.toStrictEqual(
            itemListWithDuplicates
        );
    });

    test("itemListsAreEqual", () => {
        const listA = [
            {
                id: 0,
            },
            {
                id: 1,
            },
            {
                id: 2,
            },
        ];
        const listB = [
            {
                id: 1,
            },
            {
                id: 0,
            },
            {
                id: 2,
            },
        ];
        const listC = [
            ...listA,
            {
                id: 1, // duplicated element
            },
        ];
        expect(itemListsAreEqual(listA, listB)).toBe(true);
        expect(itemListsAreEqual(listA, listC)).toBe(false);
    });
});
