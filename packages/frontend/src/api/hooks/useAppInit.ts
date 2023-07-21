/**
 *
 * Add here any logic that needs to be executed during app initialization
 *
 */
import { useEffect } from "react";
import { useAccount, useWallet } from "src/api/hooks";
import {
    useConnectWalletMutation,
    useGetFeaturesQuery,
} from "src/api/services";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { WalletConnectionState, EWalletConnectionMethod } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { useAccount as useWagmiAccount } from "wagmi";

export const useAppInit: () => void = () => {
    const dispatch = useAppDispatch();
    const authToken = useAppSelector(userStore.selectAuthToken);

    const { signout } = useWallet();
    const { authWallet } = useAccount();

    const { isConnected, address: wagmiAddress } = useWagmiAccount();

    const [connectWalletMut] = useConnectWalletMutation();

    /**
     * Fetch the features on app load, then we rely on redux cache to
     * ensure subsequent calls are cached.
     */
    useGetFeaturesQuery();

    useEffect(() => {
        Logger.debug("useAppInit effect called");
        const checkUserAuth = async () => {
            // check whether this account is already connected
            // if it's connected, and a token exists, automatically attempt to verify
            // and open a session with the backend
            if (
                authWallet.account?.address &&
                authWallet.status === WalletConnectionState.Connected
            ) {
                if (authToken !== undefined) {
                    Logger.debug("appInit: attempting optimistic login");
                    // attempt optimistic authentication
                    connectWalletMut({
                        address: authWallet.account.address,
                        token: authToken.value,
                    })
                        .unwrap()
                        .then((connectionResponse) => {
                            Logger.debug(
                                "appInit::connectWalletMut::response:",
                                connectionResponse
                            );
                            if (!connectionResponse.is_verified) {
                                // logout user
                                dispatch(userStore.reset());
                                return;
                            }
                            dispatch(userStore.setWalletVerified());
                        })
                        .catch((rejected) => {
                            Logger.error(
                                "appInit:connectWalletMut: error trying to auto-verify account",
                                rejected
                            );
                            // we were not able to establish
                            // a session with the server.
                            // reset user state
                            dispatch(userStore.resetAuthState());
                        });
                    return;
                }

                // avoid unnecessary state changes
                Logger.debug("appInit: wallet already connected");
            } else if (authWallet.status === WalletConnectionState.Verified) {
                Logger.info(
                    "appInit: found verified user. Checking if connection is still valid..."
                );
                if (authWallet.method === EWalletConnectionMethod.Metamask) {
                    if (window.ethereum == null) {
                        Logger.info(
                            "appInit: web3 provider is null, signing out"
                        );
                        await signout();
                        return;
                    }
                    window.ethereum
                        .request({
                            method: "eth_requestAccounts",
                        })
                        .then(async ([curAccount]: string[]) => {
                            if (
                                !curAccount ||
                                curAccount.toLowerCase() !==
                                    authWallet.account?.address?.toLowerCase()
                            ) {
                                await signout();
                            }
                        })
                        .catch(async () => {
                            await signout();
                        });
                } else if (
                    authWallet.method === EWalletConnectionMethod.WalletConnect
                ) {
                    if (
                        !isConnected ||
                        authWallet.account?.address !==
                            wagmiAddress?.toLowerCase()
                    ) {
                        await signout();
                    }
                } else {
                    Logger.info(
                        "appInit: Unknown wallet provider, signing out..."
                    );
                    // This should only happen to users loading the app on and old version.
                    // Just in case, it's better to signout the user, as we can't check whether
                    // the connection is still valid
                    await signout();
                }
            }
        };
        checkUserAuth().catch((e) =>
            Logger.error("appInit::checkUserAuth: unexpected error", e)
        );
        /**
         * This effect should only run once, when the component is mounted.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
