import { renderHook } from "@testing-library/react-hooks";
import useEventListener from "./useEventListener";

describe("useEventListener", () => {
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;

    afterEach(() => {
        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });

    it("should add event listener to window with provided event name and handler", () => {
        const eventName = "resize";
        const handler = jest.fn();

        addEventListenerSpy = jest.spyOn(window, "addEventListener");
        removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

        const { unmount } = renderHook(() =>
            useEventListener(eventName, handler)
        );

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            eventName,
            expect.any(Function)
        );
        expect(removeEventListenerSpy).not.toHaveBeenCalled();

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            eventName,
            expect.any(Function)
        );
    });

    it("should add event listener to provided element with provided event name and handler", () => {
        const eventName = "click";
        const handler = jest.fn();
        const element = {
            current: document.createElement("button"),
        };

        addEventListenerSpy = jest.spyOn(element.current, "addEventListener");
        removeEventListenerSpy = jest.spyOn(
            element.current,
            "removeEventListener"
        );

        const { unmount } = renderHook(() =>
            useEventListener(eventName, handler, element)
        );

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            eventName,
            expect.any(Function)
        );
        expect(removeEventListenerSpy).not.toHaveBeenCalled();

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            eventName,
            expect.any(Function)
        );
    });
});
