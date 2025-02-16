/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from "@testing-library/react-hooks";
import {
    useGetFeaturesQuery,
    useGetSubscribedViewsQuery,
} from "src/api/services";
import * as userStore from "src/api/store/slices/user";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRtkErrorCode } from "../utils/errorHandling";
import { Logger } from "../utils/logging";
import { useAppInit } from "./useAppInit";

// Mock all dependencies
vi.mock("src/api/services", () => ({
    useGetFeaturesQuery: vi.fn(),
    useGetSubscribedViewsQuery: vi.fn(),
}));

vi.mock("../store/hooks", () => ({
    useAppDispatch: () => vi.fn(),
}));

vi.mock("../utils/errorHandling", () => ({
    getRtkErrorCode: vi.fn(),
}));

vi.mock("../utils/logging", () => ({
    Logger: {
        debug: vi.fn(),
    },
}));

vi.mock("src/api/store/slices/user", () => ({
    resetAuthState: vi.fn(),
}));

describe("useAppInit", () => {
    const mockReload = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementations
        (useGetFeaturesQuery as any).mockReturnValue({ error: null });
        (useGetSubscribedViewsQuery as any).mockReturnValue({});
        (getRtkErrorCode as any).mockReturnValue(null);

        // Mock location.reload
        Object.defineProperty(window, "location", {
            value: {
                reload: mockReload,
            },
            writable: true,
        });
    });

    it("should fetch features and subscribed views on initialization", () => {
        renderHook(() => useAppInit());

        expect(useGetFeaturesQuery).toHaveBeenCalled();
        expect(useGetSubscribedViewsQuery).toHaveBeenCalled();
    });

    it("should handle 401 error by resetting auth state and reloading", () => {
        // Mock 401 error
        (useGetFeaturesQuery as any).mockReturnValue({
            error: { status: 401 },
        });
        (getRtkErrorCode as any).mockReturnValue(401);

        renderHook(() => useAppInit());

        expect(Logger.debug).toHaveBeenCalledWith(
            "App::AppRoutes: 401 received"
        );
        expect(userStore.resetAuthState).toHaveBeenCalled();
        expect(mockReload).toHaveBeenCalled();
    });

    it("should not reset auth state for non-401 errors", () => {
        // Mock non-401 error
        (useGetFeaturesQuery as any).mockReturnValue({
            error: { status: 500 },
        });
        (getRtkErrorCode as any).mockReturnValue(500);

        renderHook(() => useAppInit());

        expect(Logger.debug).not.toHaveBeenCalled();
        expect(userStore.resetAuthState).not.toHaveBeenCalled();
        expect(mockReload).not.toHaveBeenCalled();
    });

    it("should not reset auth state when there is no error", () => {
        renderHook(() => useAppInit());

        expect(Logger.debug).not.toHaveBeenCalled();
        expect(userStore.resetAuthState).not.toHaveBeenCalled();
        expect(mockReload).not.toHaveBeenCalled();
    });
});
