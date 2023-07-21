import { isObject, isEmptyObj, isString, minVal, isHash } from "./helpers";

describe("Test for helpers", () => {
    test("isObject", () => {
        const arr = [1, 2, 3];
        const obj = {
            id: 0,
            name: "",
        };
        const nullVariable = null;

        expect(isObject(arr)).toEqual(false);
        expect(isObject(obj)).toEqual(true);
        expect(isObject(nullVariable)).toEqual(false);
    });

    test("isEmptyObj", () => {
        const objNotEmpty = {
            id: 0,
            name: "",
        };
        const objEmpty = {};

        expect(isEmptyObj(objNotEmpty)).toEqual(false);
        expect(isEmptyObj(objEmpty)).toEqual(true);
    });

    test("isString", () => {
        const s = "";
        // eslint-disable-next-line no-new-wrappers
        const arg = new String(9);
        expect(isString(s)).toEqual(true);
        expect(isString(arg)).toEqual(true);
    });

    test("minVal", () => {
        const arr = [[1, 2, 3]];
        const num = [
            [1, 20000000000, 3000],
            [45, 9000, 56043],
        ];
        expect(minVal(arr)).toStrictEqual([2]);
        expect(minVal(num)).not.toStrictEqual([20000000000]);
    });

    test("isHash", () => {
        const validHashes = [
            "297037e6df477241eff8c3bf063636cd",
            "74ab26816ddef3a49dfafa84ff8f4760",
            "160ce0ea7653997f45502e2ac0b17c82",
            "160110117653997f4550222232b17482",
            "11111111111111111111111111111111",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        ];
        const invalidHashes = [
            "ethereum",
            "160ce0ea7653997f45502e2ac0b17c821",
            "160ce0ea7653997f45502e2ac0b17c",
            "ad160ce0ea7653997f45502e2ac0b17c8212",
            "160ce0ea7653997f45502e2ac0b17c82160ce0ea7653997f45502e2ac0b17c82",
            "1",
            "",
            null,
            undefined,
        ];
        validHashes.forEach((h) => expect(isHash(h)).toEqual(true));
        invalidHashes.forEach((h) => expect(isHash(h)).toEqual(false));
    });
});
