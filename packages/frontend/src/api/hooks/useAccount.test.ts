import "src/mocks/libraryMocks";
import { useEffect } from "react";
import Vitest from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import { useGetUserProfileQuery, useGetFeaturesQuery } from "src/api/services";
import * as userStore from "src/api/store/slices/user";
import { DefaultWrapper } from "src/mocks/utils";
import { useAppDispatch } from "../store/hooks";
import { useAccount } from "./useAccount";

vi.mock("src/api/services");

describe("useAccount", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return the correct account information for disconnected", () => {
        (
            useGetUserProfileQuery as Vitest.MockedFunction<
                typeof useGetUserProfileQuery
            >
        ).mockReturnValue({
            data: undefined,
            currentData: undefined,
            error: null,
            isFetching: false,
            isLoading: false,
            refetch: vi.fn(),
        });
        (
            useGetFeaturesQuery as Vitest.MockedFunction<
                typeof useGetFeaturesQuery
            >
        ).mockReturnValue({
            data: undefined,
            currentData: undefined,
            error: null,
            isFetching: false,
            isLoading: false,
            refetch: vi.fn(),
        });
        const { result } = renderHook(() => useAccount(), {
            wrapper: DefaultWrapper,
        });
        expect(result.current.authWallet).toEqual({
            account: undefined,
            status: 0,
            error: null,
        });
        expect(result.current.isAuthenticated).toEqual(false);
        expect(result.current.isStaff).toEqual(false);
    });

    it("should return the correct account information for connected", () => {
        const walletAccount = "0x00589290920";
        (
            useGetUserProfileQuery as Vitest.MockedFunction<
                typeof useGetUserProfileQuery
            >
        ).mockReturnValue({
            currentData: {
                user: {
                    id: 1,
                    is_staff: true,
                },
            },
            error: null,
            isFetching: false,
            isLoading: false,
            refetch: vi.fn(),
        });
        (
            useGetFeaturesQuery as Vitest.MockedFunction<
                typeof useGetFeaturesQuery
            >
        ).mockReturnValue({
            data: [
                {
                    id: 2,
                    slug: "wallet_connect",
                    name: "Wallet Connect MVP",
                    status: 3,
                    widget: null,
                },
            ],
            currentData: undefined,
            error: null,
            isFetching: false,
            isLoading: false,
            refetch: vi.fn(),
        });
        const { result, waitForNextUpdate } = renderHook(
            () => {
                const dispatch = useAppDispatch();

                /**
                 * This effect simulates the user connecting their wallet
                 * and verifying it.
                 */
                useEffect(() => {
                    dispatch(userStore.setWalletVerified());
                    dispatch(
                        userStore.setAuthToken({
                            value: "token",
                        })
                    );
                    dispatch(userStore.setWalletAccount(walletAccount));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, []);
                return useAccount();
            },
            { wrapper: DefaultWrapper }
        );
        expect(result.current.authWallet).toEqual({
            account: {
                address: walletAccount.toLowerCase(),
            },
            status: 6,
            error: null,
        });
        expect(result.current.isAuthenticated).toEqual(true);
        waitForNextUpdate()
            .then(() => {
                expect(result.current.isStaff).toEqual(true);
            })
            .catch(() => ({}));
    });
});
