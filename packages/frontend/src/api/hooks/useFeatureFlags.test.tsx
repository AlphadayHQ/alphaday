import { configureStore } from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, it, expect, beforeEach } from "vitest";
import { EFeatureStatus, EFeaturesRegistry } from "src/constants";
import { useGetFeaturesQuery } from "../services";
import { useFeatureFlags } from "./useFeatureFlags";

// Mock the RTK Query hook
vi.mock("src/api/services", () => ({
    useGetFeaturesQuery: vi.fn(),
}));

// Mock the Redux selector
vi.mock("src/api/store/slices/user", () => ({
    selectIsAuthenticated: (state: { user: { isAuthenticated: boolean } }) =>
        state.user.isAuthenticated,
}));

describe("useFeatureFlags", () => {
    const mockFeatures = [
        {
            slug: EFeaturesRegistry.MobileApp,
            status: EFeatureStatus.Enabled,
        },
        {
            slug: EFeaturesRegistry.Notifications,
            status: EFeatureStatus.Restricted,
        },
        {
            slug: EFeaturesRegistry.TrendingKeywords,
            status: EFeatureStatus.Protected,
        },
        {
            slug: EFeaturesRegistry.WalletBoard,
            status: EFeatureStatus.Disabled,
        },
    ];

    // Create a wrapper with Redux Provider
    const createWrapper = (isAuthenticated: boolean) => {
        const store = configureStore({
            reducer: {
                user: () => ({ isAuthenticated }),
            },
        });
        return ({ children }: { children: React.ReactNode }) => (
            <Provider store={store}>{children}</Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("for unauthenticated users", () => {
        beforeEach(() => {
            // Mock the RTK Query hook response for each test
            vi.mocked(useGetFeaturesQuery).mockReturnValue({
                data: mockFeatures,
                isLoading: false,
                refetch: () => {},
            } as ReturnType<typeof useGetFeaturesQuery>);
        });

        it("should allow access to enabled features", () => {
            const wrapper = createWrapper(false);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.MobileApp),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: true,
                isLoading: false,
            });
        });

        it("should deny access to restricted features", () => {
            const wrapper = createWrapper(false);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.Notifications),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: false,
                isLoading: false,
            });
        });

        it("should deny access to protected features", () => {
            const wrapper = createWrapper(false);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.TrendingKeywords),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: false,
                isLoading: false,
            });
        });

        it("should deny access to disabled features", () => {
            const wrapper = createWrapper(false);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.WalletBoard),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: false,
                isLoading: false,
            });
        });
    });

    describe("for authenticated users", () => {
        beforeEach(() => {
            vi.mocked(useGetFeaturesQuery).mockReturnValue({
                data: mockFeatures,
                isLoading: false,
                refetch: () => {},
            } as ReturnType<typeof useGetFeaturesQuery>);
        });

        it("should allow access to enabled features", () => {
            const wrapper = createWrapper(true);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.MobileApp),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: true,
                isLoading: false,
            });
        });

        it("should allow access to restricted features", () => {
            const wrapper = createWrapper(true);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.Notifications),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: true,
                isLoading: false,
            });
        });

        it("should allow access to protected features", () => {
            const wrapper = createWrapper(true);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.TrendingKeywords),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: true,
                isLoading: false,
            });
        });

        it("should deny access to disabled features", () => {
            const wrapper = createWrapper(true);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.WalletBoard),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: false,
                isLoading: false,
            });
        });
    });

    describe("loading state", () => {
        it("should return isLoading true when features are being fetched", () => {
            vi.mocked(useGetFeaturesQuery).mockReturnValue({
                data: undefined,
                isLoading: true,
                refetch: () => {},
            } as ReturnType<typeof useGetFeaturesQuery>);

            const wrapper = createWrapper(false);
            const { result } = renderHook(
                () => useFeatureFlags(EFeaturesRegistry.MobileApp),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: false,
                isLoading: true,
            });
        });
    });

    describe("edge cases", () => {
        beforeEach(() => {
            vi.mocked(useGetFeaturesQuery).mockReturnValue({
                data: mockFeatures,
                isLoading: false,
                refetch: () => {},
            } as ReturnType<typeof useGetFeaturesQuery>);
        });

        it("should handle undefined featureId", () => {
            const wrapper = createWrapper(false);
            const { result } = renderHook(() => useFeatureFlags(undefined), {
                wrapper,
            });

            expect(result.current).toEqual({
                enabled: false,
                isLoading: false,
            });
        });

        it("should handle non-existent feature", () => {
            const wrapper = createWrapper(false);
            const { result } = renderHook(
                () =>
                    useFeatureFlags(
                        "NON_EXISTENT_FEATURE" as EFeaturesRegistry
                    ),
                { wrapper }
            );

            expect(result.current).toEqual({
                enabled: false,
                isLoading: false,
            });
        });
    });
});
