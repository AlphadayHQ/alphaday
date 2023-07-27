import { renderHook } from "@testing-library/react-hooks";
import Vitest from "vitest";
import useEventListener from "./useEventListener";

describe("useEventListener", () => {
    let addEventListenerSpy: Vitest.SpyInstance;
    let removeEventListenerSpy: Vitest.SpyInstance;

    afterEach(() => {
        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });

    it("should add event listener to window with provided event name and handler", () => {
        const eventName = "resize";
        const handler = vi.fn();

        addEventListenerSpy = vi.spyOn(window, "addEventListener");
        removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

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
        const handler = vi.fn();
        const element = {
            current: document.createElement("button"),
        };

        addEventListenerSpy = vi.spyOn(element.current, "addEventListener");
        removeEventListenerSpy = vi.spyOn(
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
