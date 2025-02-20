import { renderHook } from "@testing-library/react-hooks";
import { describe, it, expect, vi, type Mock } from "vitest";
import { useAppSelector } from "../store/hooks";
import { useAvailableViews } from "./useAvailableViews"; // Adjust path as necessary

vi.mock("../store/hooks", () => ({
    useAppSelector: vi.fn(),
}));

describe("useAvailableViews", () => {
    it("should return undefined if userAndSharedViewsCacheSelector returns undefined", () => {
        // Mock the useAppSelector to return undefined
        (useAppSelector as Mock).mockReturnValue(undefined);

        const { result } = renderHook(() => useAvailableViews());

        expect(result.current).toBeUndefined();
    });

    it("should return an array of views when userAndSharedViewsCacheSelector returns a cache object", () => {
        // Mock data
        const mockCache = {
            view1: { id: "view1", name: "View 1" },
            view2: { id: "view2", name: "View 2" },
        };

        // Mock the useAppSelector to return the mock cache
        (useAppSelector as Mock).mockReturnValue(mockCache);

        const { result } = renderHook(() => useAvailableViews());

        expect(result.current).toEqual([
            { id: "view1", name: "View 1" },
            { id: "view2", name: "View 2" },
        ]);
    });

    it("should memoize the result and not recompute if the dependency does not change", () => {
        // Mock data
        const mockCache = {
            view1: { id: "view1", name: "View 1" },
        };

        // Mock the useAppSelector to return the mock cache
        (useAppSelector as Mock).mockReturnValue(mockCache);

        const { result, rerender } = renderHook(() => useAvailableViews());

        // Capture the initial result
        const initialResult = result.current;

        // Rerender without changing the dependency
        rerender();

        // Expect the result to be the same instance (memoized)
        expect(result.current).toBe(initialResult);
    });

    it("should recompute the result when dependency changes", () => {
        // Mock initial data
        const mockCache1 = {
            view1: { id: "view1", name: "View 1" },
        };

        // Mock updated data
        const mockCache2 = {
            view1: { id: "view1", name: "View 1" },
            view2: { id: "view2", name: "View 2" },
        };

        // Mock the useAppSelector to return the initial cache
        (useAppSelector as Mock).mockReturnValue(mockCache1);

        const { result, rerender } = renderHook(() => useAvailableViews());

        // Capture the initial result
        const initialResult = result.current;

        // Update the mock to return the updated cache
        (useAppSelector as Mock).mockReturnValue(mockCache2);

        // Rerender the hook
        rerender();

        // Expect the result to be updated and not the same instance
        expect(result.current).not.toBe(initialResult);
        expect(result.current).toEqual([
            { id: "view1", name: "View 1" },
            { id: "view2", name: "View 2" },
        ]);
    });
});
