// import { useGoogleLogin } from "@react-oauth/google";
import { configureStore } from "@reduxjs/toolkit";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userStore from "../store/slices/user";
import { EAuthMethod, EAuthState } from "../types";
import { useAuth } from "./useAuth";

const mockRequestCode = vi.fn();
const mockVerifyToken = vi.fn();
const mockSsoLogin = vi.fn();
const mockLogout = vi.fn();
const mockGoogleLogin = vi.fn((options) => {
    return () => {
        options.onSuccess({ access_token: "test-google-token" });
    };
});

vi.mock("@react-oauth/google", () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useGoogleLogin: (options: any) => mockGoogleLogin(options),
}));

vi.mock("../services", () => ({
    useRequestCodeMutation: () => [mockRequestCode, { isLoading: false }],
    useVerifyTokenMutation: () => [mockVerifyToken, { isLoading: false }],
    useSsoLoginMutation: () => [mockSsoLogin, { isLoading: false }],
    useSignoutMutation: () => [mockLogout, { isLoading: false }],
}));

vi.mock("../store/providers/oauth-provider", () => ({
    signInWithApple: () =>
        Promise.resolve({
            authorization: {
                id_token: "test-apple-token",
            },
        }),
}));

vi.mock("../utils/logging", () => ({
    Logger: {
        debug: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../utils/toastUtils", () => ({
    toast: vi.fn(),
    EToastRole: {
        Error: "error",
    },
}));

// Helper function to create a wrapper with Redux store
const createWrapper = () => {
    const store = configureStore({
        reducer: {
            user: userStore,
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
    );
};

describe("useAuth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Set up the default mock implementations
        mockRequestCode.mockImplementation(() => ({
            unwrap: () => Promise.resolve(),
        }));
        mockVerifyToken.mockImplementation(() => ({
            unwrap: () => Promise.resolve({ token: "test-token" }),
        }));
        mockSsoLogin.mockImplementation(() => ({
            unwrap: () =>
                Promise.resolve({
                    token: "test-token",
                    user: { email: "test@example.com" },
                }),
        }));
        mockLogout.mockImplementation(() => ({
            unwrap: () => Promise.resolve(),
        }));
        mockGoogleLogin.mockImplementation((options) => {
            return () => {
                options.onSuccess({ access_token: "test-google-token" });
            };
        });
    });

    it("should initialize with Guest state", () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.authState.status).toBeDefined();
        expect(result.current.authState.status).toBe(EAuthState.Guest);
    });

    it("should transition to SelectingMethod state when opening auth modal", () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.openAuthModal();
        });

        expect(result.current.authState.status).toBe(
            EAuthState.SelectingMethod
        );
    });

    it("should handle email verification flow", async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.requestCode("test@example.com");
        });

        expect(mockRequestCode).toHaveBeenCalledWith({
            email: "test@example.com",
        });
        expect(result.current.authState.status).toBe(EAuthState.VerifyingEmail);

        await act(async () => {
            await result.current.verifyToken("test@example.com", "123456");
        });

        expect(mockVerifyToken).toHaveBeenCalledWith({
            email: "test@example.com",
            code: "123456",
        });
        expect(result.current.authState.status).toBe(EAuthState.Verified);
    });

    it("should set auth method for Google SSO login", () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.ssoLogin(EAuthMethod.Google);
        });

        expect(result.current.authState.method).toBe(EAuthMethod.Google);
        expect(mockGoogleLogin).toHaveBeenCalled();
    });

    it("should handle Apple SSO login state transitions", () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.ssoLogin(EAuthMethod.Apple);
        });

        expect(result.current.authState.method).toBe(EAuthMethod.Apple);
    });

    it("should handle complete Google SSO flow", async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        // Initiate Google SSO login
        act(() => {
            result.current.ssoLogin(EAuthMethod.Google);
        });

        expect(mockGoogleLogin).toHaveBeenCalled();

        // Simulate the Google OAuth callback
        await act(async () => {
            const { onSuccess } = mockGoogleLogin.mock.calls[0][0];
            await onSuccess({ access_token: "test-google-token" });
        });

        // Verify the API call
        expect(mockSsoLogin).toHaveBeenCalledWith({
            accessToken: "test-google-token",
            provider: EAuthMethod.Google,
        });

        // Verify final state
        expect(result.current.authState.status).toBe(EAuthState.Verified);
        expect(result.current.isAuthenticated).toBe(true);
    });

    it("should handle logout and return to Guest state", async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        // First set up a logged-in state
        act(() => {
            result.current.ssoLogin(EAuthMethod.Google);
        });

        // Then logout
        await act(async () => {
            await result.current.logout();
        });

        expect(result.current.authState.status).toBe(EAuthState.Guest);
        expect(result.current.isAuthenticated).toBe(false);
    });

    it("should handle authentication errors", async () => {
        // Set up the error mock before rendering the hook
        mockVerifyToken.mockImplementation(() => ({
            unwrap: () => Promise.reject(new Error("Authentication failed")),
        }));

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            try {
                await result.current.verifyToken(
                    "test@example.com",
                    "invalid-code"
                );
            } catch (error) {
                // Error should be caught
            }
        });

        expect(result.current.authState.status).toBe(EAuthState.Guest);
        expect(result.current.isAuthenticated).toBe(false);
    });

    it("should reset to Guest state", () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        });

        // First set some other state
        act(() => {
            result.current.openAuthModal();
        });
        expect(result.current.authState.status).toBe(
            EAuthState.SelectingMethod
        );

        // Then reset
        act(() => {
            result.current.resetAuthState();
        });

        expect(result.current.authState.status).toBe(EAuthState.Guest);
    });
});
