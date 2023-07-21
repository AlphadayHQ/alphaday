import { renderHook, act } from "@testing-library/react-hooks";
import { usePagination } from "./usePagination";

describe("usePagination hook", () => {
    const remotePaginationState = {
        next: "?page=2",
        previous: null,
    };

    test("initial state", () => {
        const { result } = renderHook(() =>
            usePagination(remotePaginationState, 4, true)
        );

        expect(result.current.nextPage).toBeUndefined();
    });

    test("handle next page", () => {
        const { result } = renderHook(() =>
            usePagination(remotePaginationState, 4, true)
        );

        act(() => {
            result.current.handleNextPage("next");
        });

        expect(result.current.nextPage).toBe(2);
    });

    test("handle previous page", () => {
        const { result } = renderHook(() =>
            usePagination(
                {
                    ...remotePaginationState,
                    previous: "?page=1",
                },
                4,
                true
            )
        );

        act(() => {
            result.current.handleNextPage("previous");
        });

        expect(result.current.nextPage).toBe(1);
    });

    test("do not change page if not successful", () => {
        const { result } = renderHook(() =>
            usePagination(remotePaginationState, 4, false)
        );

        act(() => {
            result.current.handleNextPage("next");
        });

        expect(result.current.nextPage).toBeUndefined();
    });

    test("do not change page if nextPage > maxPaginationNumber", () => {
        const { result } = renderHook(() =>
            usePagination(remotePaginationState, 1, true)
        );

        act(() => {
            result.current.handleNextPage("next");
        });

        expect(result.current.nextPage).toBeUndefined();
    });
});
