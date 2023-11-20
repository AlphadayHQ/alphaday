import "@wagmi/core/window"; // this provide as with types for window.ethereum
import { useCallback, useState } from "react";
import { useWeb3Modal } from "@web3modal/react";
import { MetamaskNotInstalledError } from "src/api/errors";
import {
    useLogoutMutation,
    useGenerateMessageMutation,
    useVerifySignatureMutation,
    useConnectWalletMutation,
} from "src/api/services";
import { useAppDispatch } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { WalletConnectionState, EWalletConnectionMethod } from "src/api/types";
import assert from "src/api/utils/assert";
import { isString, ignoreConcurrentAsync } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";
import {
    useAccount as useWagmiAccount,
    useDisconnect as useWagmiDisconnect,
    useSignMessage,
} from "wagmi";
import CONFIG from "src/config";
import { getErrorCode, getErrorMessage } from "../utils/errorHandling";
import { useAccount } from "./useAccount";

export const RTK_USER_CACHE_KEYS = {
    CONNECT: "connect-view-cache-key",
};

const RPC_ERROR_CODES = {
    REJECTED_BY_USER: 4001,
    NON_AUTHORIZED_BY_USER: 4100,
    DENIED_SIGNATURE: -32603,
} as const;

interface IWallet {
    /**
     * set the wallet state in `SelectingMethod`
     */
    openWalletConnectionDialog: () => void;
    /**
     * @param method Specify whether to use wallet connect or metamask
     * @param newAddress Necessary when called after an account change event
     * @returns void
     */
    connectWallet: (
        method: EWalletConnectionMethod,
        newAddress?: string
    ) => Promise<void>;
    /**
     * A util function to reset the wallet connection state
     * This will disconnect the wallet, but will not remove the auth token.
     */
    resetWalletConnection: () => void;
    /**
     * A util function to verify the currently connected wallet.
     * This will attempt to verify the wallet, and if successful, will attempt to open a session with the backend.
     */
    verifyWallet: () => void;
    /**
     * Similar to resetWalletConnection, but also removes the auth token.
     * This is useful when the user is authenticated, but the wallet is disconnected.
     */
    resetWalletVerification: () => void;
    /**
     * A util function to sign out the user.
     * This will remove the auth token and disconnect the wallet.
     */
    signout: () => Promise<void>;
}

/**
 * Hook to get wallet information
 * This hook will only handle all wallet related actions.
 */
export const useWallet: () => IWallet = () => {
    const dispatch = useAppDispatch();

    const { authWallet, resetAuthState } = useAccount();

    const { isConnected, address: wagmiAddress } = useWagmiAccount();
    const [prevIsConnected, setPrevIsConnected] = useState<boolean | undefined>(
        undefined
    );
    const normalizedWagmiAddress = wagmiAddress?.toLowerCase();
    const { disconnect } = useWagmiDisconnect();

    const { signMessageAsync } = useSignMessage({ message: "" });

    const { open, isOpen } = useWeb3Modal();
    const [prevIsOpen, setPrevIsOpen] = useState<boolean | undefined>(
        undefined
    );

    const [connectWalletMut, connectMutResult] = useConnectWalletMutation({
        fixedCacheKey: RTK_USER_CACHE_KEYS.CONNECT,
    });

    const [generateMessageMut] = useGenerateMessageMutation();

    const [verifySignatureMut] = useVerifySignatureMutation();

    const [logoutMut, logoutMutResult] = useLogoutMutation();

    const openWalletConnectionDialog = () => {
        dispatch(userStore.initWalletMethodSelection());
    };

    const resetWalletConnection = useCallback(() => {
        if (authWallet.status !== WalletConnectionState.Disconnected) {
            dispatch(userStore.setWalletDisconnected());
        }
    }, [authWallet.status, dispatch]);

    const resetWalletVerification = useCallback(() => {
        dispatch(userStore.setWalletConnected());
    }, [dispatch]);

    const handleError = useCallback(
        (
            err: unknown,
            state: WalletConnectionState,
            defaultErrorMessage: string,
            errorContext?: string
        ) => {
            const errorCode = getErrorCode(err);
            if (
                errorCode === RPC_ERROR_CODES.REJECTED_BY_USER ||
                errorCode === RPC_ERROR_CODES.NON_AUTHORIZED_BY_USER ||
                errorCode === RPC_ERROR_CODES.DENIED_SIGNATURE
            ) {
                // if action is rejected, no need to move to error state
                if (state === WalletConnectionState.Verifying) {
                    resetWalletVerification();
                    return;
                }
                resetWalletConnection();
                return;
            }
            let errorMsg = defaultErrorMessage;
            if (err instanceof MetamaskNotInstalledError) {
                errorMsg = "Metamask not installed. Please install it first!";
            } else {
                const errorLog = errorContext ?? "useWallet::handleError";
                Logger.error(`${errorLog}:`, err);
                errorMsg = `${errorMsg}: ${getErrorMessage(err)}`;
            }
            dispatch(userStore.setWalletAuthError(errorMsg));
            if (state === WalletConnectionState.Verifying) {
                dispatch(userStore.setWalletInVerificationError());
            } else if (state === WalletConnectionState.Connecting) {
                dispatch(userStore.setWalletInConnectionError());
            } else {
                dispatch(userStore.setWalletInGenericError());
            }
        },
        [dispatch, resetWalletConnection, resetWalletVerification]
    );

    const verifyWallet = useCallback(() => {
        Logger.debug("useWallet::verifyWallet called");
        if (authWallet.status === WalletConnectionState.Verifying) {
            /**
             * On rare occasions, the user can click the verify button multiple times.
             * This will cause the verifyWallet function to be called multiple times.
             * This is not a problem, but we should not attempt to verify the wallet multiple times.
             */
            Logger.debug("useWallet::verifyWallet: already verifying");
            return;
        }
        try {
            assert(
                authWallet.account?.address,
                "account address must not be empty"
            );
            assert(
                authWallet.status === WalletConnectionState.Prompted ||
                    authWallet.status === WalletConnectionState.Connected,
                "wallet must be connected"
            );
            dispatch(userStore.initWalletVerification());
            const address = authWallet.account?.address as `0x${string}`;
            Logger.debug("useWallet::verifyWallet::address", address);
            generateMessageMut({ address })
                .unwrap()
                .then(async (genMsgResp) => {
                    let signature: `0x${string}` | undefined;
                    try {
                        Logger.debug(
                            "useWallet:verifyWallet:genMsgResp",
                            genMsgResp
                        );
                        const { message } = genMsgResp;
                        const signatureRequest: `0x${string}` = `0x${Buffer.from(
                            message,
                            "utf8"
                        ).toString("hex")}`;
                        Logger.debug(
                            "useWallet:verifyWallet:signatureRequest",
                            signatureRequest
                        );
                        if (
                            authWallet.method ===
                            EWalletConnectionMethod.Metamask
                        ) {
                            if (window.ethereum == null) {
                                throw new MetamaskNotInstalledError();
                            }
                            signature = await window.ethereum.request({
                                method: "personal_sign",
                                params: [signatureRequest, address],
                            });
                        } else {
                            Logger.debug(
                                "useWallet:verifyWallet: signing through wagmi"
                            );
                            signature = await signMessageAsync({
                                message,
                            });
                        }
                        Logger.debug(
                            "useWallet:verifyWallet:signature",
                            signature
                        );
                        Logger.debug("useWallet:verifyWallet:address", address);
                        if (signature === undefined) {
                            throw new Error(
                                "useWallet::verifyWallet: signature is undefined"
                            );
                        }
                        verifySignatureMut({
                            address,
                            signature,
                        })
                            .unwrap()
                            .catch((rejected) => {
                                handleError(
                                    rejected,
                                    WalletConnectionState.Verifying,
                                    "Could not verify signature",
                                    "useWallet:verifyWallet::verifySignatureMut"
                                );
                            });
                    } catch (err) {
                        handleError(
                            err,
                            WalletConnectionState.Verifying,
                            "Could not generate signature",
                            "useWallet:verifyWallet"
                        );
                    }
                })
                .catch((rejected) => {
                    handleError(
                        rejected,
                        WalletConnectionState.Verifying,
                        "Could not generate challenge",
                        "useWallet:verifyWallet::generateMessageMut"
                    );
                });
        } catch (err) {
            handleError(
                err,
                WalletConnectionState.Verifying,
                "Unexpected error",
                "useWallet:verifyWallet"
            );
        }
    }, [
        authWallet.account?.address,
        authWallet.method,
        authWallet.status,
        dispatch,
        generateMessageMut,
        handleError,
        signMessageAsync,
        verifySignatureMut,
    ]);

    const signout = useCallback(async () => {
        await ignoreConcurrentAsync<void, void>(async () => {
            Logger.debug("useWallet::signout called");
            if (authWallet.status === WalletConnectionState.SigningOut) {
                /**
                 * On rare occasions, the user can click the signout button multiple times
                 * before the wallet is actually disconnected. This is a safeguard to prevent
                 * multiple signout requests/state changes.
                 */
                Logger.debug("useWallet::signout: already signing out");
                return;
            }
            try {
                dispatch(userStore.initSignOut());
                if (isConnected) {
                    disconnect();
                }
                if (!logoutMutResult.isLoading) {
                    const response = await logoutMut();
                    Logger.debug(
                        "useWallet::signout endpoint call success",
                        response
                    );
                }
                // note: wallet state is reset in user store extra reducers
                // so no need to handle it here
            } catch (error) {
                Logger.error("useWallet::signout failed", error);
                dispatch(userStore.setWalletInGenericError());
                dispatch(userStore.setWalletAuthError(JSON.stringify(error)));
            }
        }, 5000)();
    }, [
        authWallet.status,
        dispatch,
        isConnected,
        logoutMutResult.isLoading,
        disconnect,
        logoutMut,
    ]);

    const connectAndSyncWallet = (address: string) => {
        if (!connectMutResult.isLoading) {
            connectWalletMut({ address })
                .unwrap()
                .then((connectionResponse) => {
                    Logger.debug(
                        "useWallet:connectAndSyncWallet::connectWalletMut: success",
                        connectionResponse
                    );
                    const normalisedAccount = {
                        address: address.toLowerCase(),
                    };
                    dispatch(userStore.addPortfolioAccount(normalisedAccount));
                    dispatch(userStore.setWalletAccount(address));
                    dispatch(userStore.requestWalletVerification());
                    // when user connects a wallet, it becomes the selected
                    // address in the portfolio widget
                    Logger.debug(
                        "useWallet:connectAndSyncWallet: setting new selected account",
                        address
                    );
                    dispatch(
                        userStore.setSelectedPortfolioAccount({ address })
                    );
                })
                .catch((rejected) => {
                    handleError(
                        rejected,
                        WalletConnectionState.Connecting,
                        "Could not connect wallet:",
                        "useWallet::connectAndSyncWallet"
                    );
                });
        }
    };

    /**
     * Take first account from Metamask and set it as the connected crypto account
     * If the account was not saved in the accounts array, save it.
     * Finally, set this address as the selected portfolio address.
     */
    const connectWallet = async (
        method: EWalletConnectionMethod,
        newAddress?: string
    ) => {
        try {
            Logger.debug("useWallet::connectWallet: called.");
            Logger.debug("useWallet::connectWallet::method", method);
            dispatch(userStore.initWalletConnection());
            dispatch(userStore.setConnectionMethod(method));
            if (method === EWalletConnectionMethod.WalletConnect) {
                assert(
                    CONFIG.WALLET_CONNECT.PROJECT_ID !== undefined,
                    "WalletConnect projectId must be defined"
                );
                assert(
                    CONFIG.WALLET_CONNECT.PROJECT_ID.length > 0,
                    "WalletConnect projectId must not be empty"
                );
                if (
                    isConnected &&
                    newAddress !== undefined &&
                    newAddress !== normalizedWagmiAddress
                ) {
                    Logger.debug(
                        "useWallet::connectWallet: Attempting to connect to new address",
                        newAddress
                    );
                    disconnect();
                    return;
                }
                if (isConnected && normalizedWagmiAddress !== undefined) {
                    Logger.debug(
                        "useWallet::connectWallet: already connected to wallet provider"
                    );
                    connectAndSyncWallet(normalizedWagmiAddress);
                    return;
                }
                if (!isOpen) {
                    Logger.debug(
                        "useWallet::connectWallet: opening wallet connect modal"
                    );
                    await open();
                }
                return;
            }
            /**
             * Connect through metamask flow
             */
            if (window.ethereum == null) throw new MetamaskNotInstalledError();
            if (CONFIG.IS_PROD) {
                assert(
                    // @ts-expect-error
                    window.ethereum.isAlphaday === undefined,
                    "Wallet provider must be valid in non-test env"
                );
            }
            const newAccounts: string[] = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const address = newAccounts[0].toLowerCase();
            assert(
                isString(address),
                "useWallet::connectWallet: account address must be a string"
            );
            assert(
                address.length > 0,
                "useWallet::connectWallet: account address must not be empty"
            );
            connectAndSyncWallet(address);
        } catch (err) {
            handleError(
                err,
                WalletConnectionState.Connecting,
                "Unexpected error:",
                "useWallet::connectWallet"
            );
        }
    };

    /**
     * Keep in mind the code below runs on every instance of this hook
     */

    /**
     * handle state in case user closes wallet connect modal
     * without connecting
     */
    if (isOpen !== prevIsOpen) {
        if (
            !isOpen &&
            !isConnected &&
            authWallet.status === WalletConnectionState.Connecting
        ) {
            Logger.debug("useWallet: modal was closed, resetting state...");
            resetWalletConnection();
        }
        setPrevIsOpen(isOpen);
    }

    /**
     * expect bugs from here
     */
    if (
        isConnected !== prevIsConnected &&
        authWallet.method === EWalletConnectionMethod.WalletConnect
    ) {
        /**
         * user's wallet transitions from unconnected -> connected
         */
        if (
            isConnected &&
            normalizedWagmiAddress !== undefined &&
            authWallet.account?.address !== normalizedWagmiAddress
        ) {
            connectAndSyncWallet(normalizedWagmiAddress);
            setPrevIsConnected(isConnected);
        }
        /**
         * user's wallet transitions from connected -> unconnected
         */
        if (!isConnected) {
            // happens on account switch event, in which case we need to disconnect first
            // and then (now) open the modal again
            if (authWallet.status === WalletConnectionState.Connecting) {
                open().catch(() => ({}));
            }
            if (authWallet.status === WalletConnectionState.Connected) {
                dispatch(userStore.setWalletDisconnected());
                resetAuthState();
            }
            if (authWallet.status === WalletConnectionState.Verified) {
                signout().catch((e) =>
                    Logger.error("useWallet: error during signout", e)
                );
            }
            setPrevIsConnected(isConnected);
        }
    }

    return {
        openWalletConnectionDialog,
        connectWallet,
        resetWalletConnection,
        verifyWallet,
        resetWalletVerification,
        signout,
    };
};
