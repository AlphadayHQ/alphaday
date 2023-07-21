import {
    defaultEventCategory,
    typeOptions,
} from "src/components/calendarCategories";
import { remoteEventsMock } from "src/mocks/calendar";
import {
    getEventCategoryByColor,
    getEventCategoryByType,
    reshapeEvents,
} from "./calendarUtils";

describe("getEventCategoryByType", () => {
    const mockOptions = typeOptions.map((t) => ({
        ...t,
        category: t.value,
        label: t.value,
    }));
    test("should return default event category if type is undefined", () => {
        expect(getEventCategoryByType(undefined, mockOptions)).toEqual(
            defaultEventCategory
        );
    });

    test("should return default event category if type is invalid", () => {
        expect(getEventCategoryByType("invalid", mockOptions)).toEqual(
            defaultEventCategory
        );
    });

    test("should return event category if type is valid", () => {
        const category = getEventCategoryByType("ICO", mockOptions);
        expect(category.value).toEqual("ICO");
        expect(category.color).toEqual("rgb(144, 190, 109)");
    });
});

describe("getEventCategoryByColor", () => {
    const mockOptions = typeOptions.map((t) => ({
        ...t,
        category: t.value,
        label: t.value,
    }));
    test("should return default event category if color is undefined", () => {
        expect(getEventCategoryByColor(undefined, mockOptions)).toEqual(
            defaultEventCategory
        );
    });

    test("should return default event category if color is invalid", () => {
        expect(getEventCategoryByColor("invalid", mockOptions)).toEqual(
            defaultEventCategory
        );
    });

    test("should return event category if color is valid", () => {
        const category = getEventCategoryByColor(
            "rgb(144, 190, 109)",
            mockOptions
        );
        expect(category.value).toEqual("ICO");
        expect(category.color).toEqual("rgb(144, 190, 109)");
    });
});

describe("reshapeEvents", () => {
    test("should return empty array if events is empty", () => {
        expect(reshapeEvents([])).toHaveLength(0);
    });

    test("should reshape events list", () => {
        const events = reshapeEvents(remoteEventsMock);
        expect(events).toHaveLength(1);
    });

    test("should transform event ids to string", () => {
        const events = reshapeEvents(remoteEventsMock);
        events.forEach((event) => {
            expect(typeof event.id).toEqual("string");
        });
    });

    test("should return event with colors", () => {
        const events = reshapeEvents(remoteEventsMock);
        events.forEach((event) => {
            expect(event.backgroundColor).toBeDefined();
            expect(event.borderColor).toBeDefined();
        });
    });
});
