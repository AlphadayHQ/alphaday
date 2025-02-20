import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import useElementSize from "./useElementSize";

describe("useElementSize", () => {
    let mockElement: HTMLDivElement;

    beforeEach(() => {
        // Create mock element with initial dimensions
        mockElement = document.createElement("div");
        Object.defineProperty(mockElement, "offsetWidth", { value: 100 });
        Object.defineProperty(mockElement, "offsetHeight", { value: 100 });
    });

    it("should initialize with zero dimensions", () => {
        const { result } = renderHook(() => useElementSize());
        const [, size] = result.current;

        expect(size).toEqual({ width: 0, height: 0 });
    });

    it("should update size when element ref is set", () => {
        const { result } = renderHook(() => useElementSize());
        const [setRef] = result.current;

        act(() => {
            setRef(mockElement);
        });

        const [, size] = result.current;
        expect(size).toEqual({ width: 100, height: 100 });
    });

    it("should update size on resize event", () => {
        const { result } = renderHook(() => useElementSize());
        const [setRef] = result.current;

        act(() => {
            setRef(mockElement);
        });

        // Modify element dimensions
        Object.defineProperty(mockElement, "offsetWidth", { value: 200 });
        Object.defineProperty(mockElement, "offsetHeight", { value: 150 });

        // Trigger resize event
        act(() => {
            window.dispatchEvent(new Event("resize"));
        });

        const [, size] = result.current;
        expect(size).toEqual({ width: 200, height: 150 });
    });

    it("should handle null ref", () => {
        const { result } = renderHook(() => useElementSize());
        const [setRef] = result.current;

        act(() => {
            setRef(null);
        });

        const [, size] = result.current;
        expect(size).toEqual({ width: 0, height: 0 });
    });

    it("should not update size if dimensions haven't changed", () => {
        const { result } = renderHook(() => useElementSize());
        const [setRef] = result.current;

        act(() => {
            setRef(mockElement);
        });

        const initialSize = result.current[1];

        // Trigger resize event without changing dimensions
        act(() => {
            window.dispatchEvent(new Event("resize"));
        });

        const [, newSize] = result.current;
        expect(newSize).toEqual(initialSize);
    });

    it("should work with custom HTML element types", () => {
        const { result } = renderHook(() =>
            useElementSize<HTMLButtonElement>()
        );
        const [setRef] = result.current;

        const buttonElement = document.createElement("button");
        Object.defineProperty(buttonElement, "offsetWidth", { value: 120 });
        Object.defineProperty(buttonElement, "offsetHeight", { value: 40 });

        act(() => {
            setRef(buttonElement);
        });

        const [, size] = result.current;
        expect(size).toEqual({ width: 120, height: 40 });
    });
});
