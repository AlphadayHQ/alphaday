import { TItem } from "src/types";
import { TRemoteCustomData, TRemoteCustomDatum } from "../services";
import { Logger } from "./logging";

/**
 * This type is used to define the root type of items which include news, daos, tweets etc
 */
type TRootItem = { id: string | number };

export const itemsInclude: <T extends TRootItem>(
    itemList: T[],
    item: T
) => boolean = (itemList, item) => {
    if (itemList.filter((i) => i.id === item.id).length > 0) return true;
    return false;
};

export const buildUniqueItemList: <T extends TRootItem>(items: T[]) => T[] = (
    items
) => {
    const uniqueItems: typeof items = [];

    items.forEach((i) => {
        if (!itemsInclude(uniqueItems, i)) uniqueItems.push(i);
    });
    return uniqueItems;
};

type TItemRecord = Record<string, unknown>;

/**
 * Get an value from a record item by a dot notation path.
 * getValueByPath would continue to traverse till the last key in the path or an undefined value is found.
 *
 * (@elcharitas): this function is based off of a package I wrote called [js-dot](https://github.com/elcharitas/js-dot)
 * This more improved and as such I'm not sure if it's a good idea to use it here
 * but it's a good starting point. lodash.get is also an alternative except we don't make much use of lodash atm
 *
 * @example
 * - First Level traversal
 * ```js
 * const item = { id: 1, name: "test" };
 * const path = "id";
 * const value = getValueByPath(item, path);
 * console.log(value); // 1
 * ```
 * - Second Level traversal
 * ```js
 * const item = { id: 1, user: { name: "test" } };
 * const path = "user.name";
 * const value = getValueByPath(item, path);
 * console.log(value) // "test"
 * ```
 *
 * @param item the item to be checked/traversed
 * @param path a string representing the field to be retrieved
 * @returns the retrieved field value
 */
export const getValueByPath = <T = string>(
    item: TItemRecord,
    path: string
): T | undefined => {
    const fields = path.split(".");
    const firstField = fields.pop();

    if (!firstField) return undefined;
    if (!fields.length) return item[firstField] as T;
    return fields.reduce(
        (acc, curr) => (acc?.[curr] || {}) as TItemRecord,
        item
    )[firstField] as T;
};

/**
 * Fraction of the content the user must have reached before
 * fetching more items
 */
const SCROLL_THRESHOLD = 0.9;

/**
 * Determine whether the user has reached SCROLL_THRESHOLD
 *
 *     +-----------------+
 *     |                 |
 *     |    non-visible  |
 *     |      area       |
 *     |                 |
 *     |-----------------|<-- scrollTop
 *     |                 |
 *     |     visible     |
 *     |      area       |
 *     |                 |
 *     |-----------------|<-- scrollTop + clientHeight
 *     |                 |
 *     |   non-visible   |
 *     |     area        |
 *     |                 |
 *     +-----------------+<-- scrollHeight
 *
 * @param target The HTML element to check for scroll position.
 * @returns true if the lower position of the visible area has reached SCROLL_THRESHOLD
 */
export const shouldFetchMoreItems = (t: HTMLElement): boolean =>
    Math.abs((t.clientHeight + t.scrollTop) / t.scrollHeight) >
    SCROLL_THRESHOLD;

/**
 * Compare 2 item lists by checking their element ids
 *
 * @returns true if both lists contain the same elements
 */
export const itemListsAreEqual = <T extends TRootItem>(
    listA: T[],
    listB: T[]
): boolean => {
    if (listA.length !== listB.length) return false;
    return listA.every(
        (itemA) => !!listB.find((itemB) => itemB.id === itemA.id)
    );
};

/**
 * Repeats the items of an array sequentially until it matches limit
 * if limit is less than arr.length, it slices the array
 *
 * @returns an array of string
 */
export const makeRepeated = <T extends string | number>(
    arr: T[],
    limit: number
): T[] => {
    const repeats = Math.floor(limit / arr.length) + 1;
    const repeated: T[] = Array.from({ length: repeats }, () => arr).flat();

    return repeated.slice(0, limit);
};

/**
 * Builds a transformed multi-value results record based on a passed structure.
 *
 * @example
 * ```js
 * console.log(buildMultiValue({ a: 1, b: 2 }, { a: "value", b: "time" })); // { value: 1, time: 2 }
 * ```
 *
 * @param results The Multi-value Record to transform
 * @param structure A record of the structure to transform to
 * @returns A transformed multi-value record
 */
export const buildMultiValue = <
    T extends Record<string, unknown>,
    D extends Record<string, unknown> = Record<string, unknown>,
>(
    results: D[],
    structure: Record<string, string>
): T =>
    results.reduce((result, curr) => {
        const key = structure[curr.key as keyof typeof structure];
        return {
            ...result,
            [key]: curr.value,
        };
    }, {} as T);

/**
 * Transforms a TCustomDatum dict into a TItem dict
 */
export const customDatumAsItem: (datum: TRemoteCustomDatum) => TItem = (d) => {
    return Object.entries(d).reduce((acc, curr) => {
        const [currKey, currVal] = curr;
        return {
            ...acc,
            [currKey]: String(currVal),
        };
    }, {} as TItem);
};

export const customDataAsItems: (data: TRemoteCustomData) => TItem[] = (d) => {
    try {
        return d.map(customDatumAsItem);
    } catch (error) {
        Logger.error("customDataAsItems: unexpected error", error);
        return [];
    }
};
