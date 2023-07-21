import "src/mocks/libraryMocks";
import { renderHook } from "@testing-library/react-hooks";
import { WrapperWithZapperApi } from "src/mocks/utils";
import assert from "../utils/assert";
import { useGetNftBalanceForAddressesQuery } from "./zapperApi";

const assertNullableValue: (
    value: string | number | null | undefined,
    type: "string" | "number"
) => () => void = (value, type) => () =>
    assert(
        typeof value === type ||
            typeof value === "object" ||
            typeof value === "undefined",
        `type should be ${type} or null, received ${typeof value}`
    );

describe("useApi", () => {
    test("useGetNftBalanceForAddressesQuery", async () => {
        const { result, waitForNextUpdate } = renderHook(
            () =>
                useGetNftBalanceForAddressesQuery({
                    // vitalik's address
                    addresses: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"],
                }),
            { wrapper: WrapperWithZapperApi }
        );

        // Wait for the hook to update and return data
        await waitForNextUpdate({ timeout: 10000 });

        const { data } = result.current;

        expect(data).not.toBe(undefined);

        // Assert that the result is an array
        expect(Array.isArray(data?.items)).toBe(true);

        // Assert that each element of the array is a Zapper asset object
        data?.items.forEach((item) => {
            expect(typeof item.balance).toBe("string");
            expect(typeof item.token.tokenId).toBe("string");
            expect(
                assertNullableValue(item.token.lastSaleEth, "string")
            ).not.toThrow();
            expect(
                assertNullableValue(item.token.rarityRank, "number")
            ).not.toThrow();
            expect(
                assertNullableValue(item.token.estimatedValueEth, "string")
            ).not.toThrow();
            expect(Array.isArray(item.token.medias)).toBe(true);
            item.token.medias.forEach((media) => {
                expect(typeof media.type).toBe("string");
                if (media.type === "image") {
                    expect(typeof media.originalUrl).toBe("string");
                }
                if (media.type === "audio") {
                    expect(typeof media.original).toBe("string");
                }
            });
            expect(
                assertNullableValue(item.token.collection.address, "string")
            ).not.toThrow();
            expect(
                assertNullableValue(item.token.collection.name, "string")
            ).not.toThrow();
            expect(
                assertNullableValue(item.token.collection.nftStandard, "string")
            ).not.toThrow();
            expect(
                assertNullableValue(
                    item.token.collection.floorPriceEth,
                    "string"
                )
            ).not.toThrow();
            expect(
                assertNullableValue(
                    item.token.collection.logoImageUrl,
                    "string"
                )
            ).not.toThrow();
            expect(
                assertNullableValue(item.token.collection.openseaId, "string")
            ).not.toThrow();
        });
    }, 11000);
});
