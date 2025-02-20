import { renderHook } from "@testing-library/react-hooks";
import { useGetIpMetadataQuery } from "src/api/services";
import { setCookieChoice } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { ECookieChoice } from "src/api/types";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useCookieChoice } from "./useCookieChoice"; // Adjust the path as needed

vi.mock("src/api/store/hooks", () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock("src/api/services", () => ({
    useGetIpMetadataQuery: vi.fn(),
}));

vi.mock("src/api/store", () => ({
    setCookieChoice: vi.fn(),
}));

describe("useCookieChoice", () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    });

    it("should return allowTracking true if cookieChoice is AcceptAll", () => {
        (useAppSelector as Mock).mockReturnValue(ECookieChoice.AcceptAll);
        (useGetIpMetadataQuery as Mock).mockReturnValue({
            data: null,
            isError: false,
        });

        const { result } = renderHook(() => useCookieChoice());

        expect(result.current).toEqual({ allowTracking: true });
    });

    it("should return allowTracking false if ipMeta indicates user is in the EU", () => {
        (useAppSelector as Mock).mockReturnValue(undefined);
        (useGetIpMetadataQuery as Mock).mockReturnValue({
            data: { in_eu: true },
            isError: false,
        });

        const { result } = renderHook(() => useCookieChoice());

        expect(result.current).toEqual({ allowTracking: false });
    });

    it("should return allowTracking true if ipMeta indicates user is not in the EU", () => {
        (useAppSelector as Mock).mockReturnValue(undefined);
        (useGetIpMetadataQuery as Mock).mockReturnValue({
            data: { in_eu: false },
            isError: false,
        });

        const { result } = renderHook(() => useCookieChoice());

        expect(result.current).toEqual({ allowTracking: true });
    });

    it("should dispatch AcceptAll if ipMeta indicates user is not in the EU and cookieChoice is undefined", () => {
        (useAppSelector as Mock).mockReturnValue(undefined);
        (useGetIpMetadataQuery as Mock).mockReturnValue({
            data: { in_eu: false },
            isError: false,
        });

        renderHook(() => useCookieChoice());

        expect(mockDispatch).toHaveBeenCalledWith(
            setCookieChoice(ECookieChoice.AcceptAll)
        );
    });

    it("should not dispatch AcceptAll if cookieChoice is already set", () => {
        (useAppSelector as Mock).mockReturnValue(ECookieChoice.RejectAll);
        (useGetIpMetadataQuery as Mock).mockReturnValue({
            data: { in_eu: false },
            isError: false,
        });

        renderHook(() => useCookieChoice());

        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should handle query errors gracefully and return allowTracking false", () => {
        (useAppSelector as Mock).mockReturnValue(undefined);
        (useGetIpMetadataQuery as Mock).mockReturnValue({
            data: null,
            isError: true,
        });

        const { result } = renderHook(() => useCookieChoice());

        expect(result.current).toEqual({ allowTracking: false });
    });
});
