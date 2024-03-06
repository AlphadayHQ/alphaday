import { canShare, shareData } from "./shareUtils";

describe("shareUtils", () => {
    describe("canShare", () => {
        it("should return true if the Web Share API is supported", () => {
            expect(canShare()).toBe(true);
        });

        it("should return false if the Web Share API is not supported", () => {
            // @ts-expect-error navigator is read-only, we're just testing
            navigator.share = undefined;
            expect(canShare()).toBe(false);
        });
    });

    describe("shareData", () => {
        it("should share the provided data using the Web Share API", () => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            expect(shareData({ title: "Test", text: "Test" })).resolves.toBe(
                undefined
            );
        });

        it("should not share the data if the Web Share API is not supported", () => {
            // @ts-expect-error navigator is read-only, we're just testing
            navigator.share = undefined;
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            expect(shareData({ title: "Test", text: "Test" })).rejects.toThrow(
                "Sharing not supported"
            );
        });
    });
});
