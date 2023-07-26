/**
 * The hooks contained here must be instantiated once (typically in App.tsx)
 */
import { useEffect, useCallback } from "react";
import { useAccount, useWallet } from "src/api/hooks";
import { WalletConnectionState, EWalletConnectionMethod } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { MetamaskNotInstalledError } from "../errors";
import { EWalletEvent, useWalletEvent } from "./useWalletEvent";

export const useGlobalHooks: () => void = () => {
    const { signout, resetWalletConnection, connectWallet } = useWallet();
    const { authWallet, isAuthenticated, resetAuthState, cleanAuthState } =
        useAccount();

    const { setWalletEventListener } = useWalletEvent(
        EWalletEvent.AccountChanged,
        authWallet.method ?? EWalletConnectionMethod.Metamask
    );

    const attemptReconnect = useCallback(
        (account: string) => {
            Logger.debug(
                "useGlobalHooks::attemptReconnect: attempting to reconnect to the new account",
                account
            );
            connectWallet(
                authWallet.method ?? EWalletConnectionMethod.Metamask,
                account.toLowerCase()
            ).catch((e) =>
                Logger.error("useGlobalHooks::attemptReconnect: error", e)
            );
        },
        [authWallet.method, connectWallet]
    );

    const handleAccountChange = useCallback(
        (accounts: string[]) => {
            const [account] = accounts;
            Logger.debug(
                "handleAccountChange: account change event handler called"
            );
            Logger.debug("handleAccountChange::account", account);
            Logger.debug("handleAccountChange::authWallet", authWallet);
            // wallet has been disconnected so we signout the user
            if (!account) {
                if (authWallet.status === WalletConnectionState.Verified) {
                    Logger.debug("handleAccountChange: signing out...");
                    signout().catch(() => ({}));
                } else {
                    Logger.debug("handleAccountChange: wallet disconnected");
                    resetAuthState();
                }
            } else if (account.toLowerCase() !== authWallet.account?.address) {
                Logger.debug(
                    "handleAccountChange: Account switch, wallet state:",
                    authWallet
                );
                if (authWallet.status === WalletConnectionState.Verified) {
                    Logger.debug(
                        "handleAccountChange: signing out...",
                        "verified"
                    );
                    signout()
                        .then(() => {
                            attemptReconnect(account);
                        })
                        .catch(() => ({}));
                } else {
                    Logger.debug(
                        "handleAccountChange: disconnecting current wallet..."
                    );
                    cleanAuthState();
                    resetWalletConnection();
                    attemptReconnect(account);
                }
            }
        },
        [
            attemptReconnect,
            authWallet,
            cleanAuthState,
            resetAuthState,
            resetWalletConnection,
            signout,
        ]
    );

    useEffect(() => {
        if (
            isAuthenticated ||
            authWallet.status === WalletConnectionState.Connected ||
            authWallet.status === WalletConnectionState.Prompted
        ) {
            try {
                // register new account if it's not already in the list
                setWalletEventListener(handleAccountChange);
            } catch (e) {
                if (!(e instanceof MetamaskNotInstalledError)) {
                    Logger.error(
                        "useGlobalHooks::setWalletEventListener: unexpected error",
                        e
                    );
                }
                resetAuthState();
            }
        }
    }, [
        authWallet.method,
        authWallet.status,
        handleAccountChange,
        isAuthenticated,
        resetAuthState,
        setWalletEventListener,
    ]);
};
