import globalMessages from "src/globalMessages";
import { getReadableErrorMessage } from "./errorHandling";

describe("getReadableErrorMessage", () => {
    describe("when the format matches a pattern", () => {
        it("should return the correct error message for maxViews", () => {
            const format = "max views count 10";
            const expected = globalMessages.error.maxViews;

            expect(getReadableErrorMessage(format)).toBe(expected);
        });

        it("should return the correct error message for maxViewWidgets", () => {
            const format = "widget 1 exceeded max-per-view limit";
            const expected = globalMessages.error.maxViewWidgets;

            expect(getReadableErrorMessage(format)).toBe(expected);
        });

        it("should return the correct error message for maxWidgets", () => {
            const format = "max widget count 20";
            const expected = globalMessages.error.maxWidgets;

            expect(getReadableErrorMessage(format)).toBe(expected);
        });

        it("should return the generic error message when pattern is not found", () => {
            const format = "invalid format";
            const expected = globalMessages.error.generic;

            expect(getReadableErrorMessage(format)).toBe(expected);
        });

        it("should return the generic error message when format is undefined", () => {
            const format = undefined;
            const expected = globalMessages.error.generic;

            expect(getReadableErrorMessage(format)).toBe(expected);
        });
    });
});
