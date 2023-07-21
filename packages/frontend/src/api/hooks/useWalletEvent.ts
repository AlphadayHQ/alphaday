import { useEffect, useRef } from "react";
import { MetamaskNotInstalledError } from "src/api/errors";
import { Logger } from "src/api/utils/logging";
import { useConnect } from "wagmi";
import { EWalletConnectionMethod } from "../types";

export enum EWalletEvent {
    Connect = "connect",
    Disconnect = "disconnect",
    AccountChanged = "accountsChanged",
    NetworkChanged = "chainChanged",
    Message = "message",
}

type TWalletEventCallback = (accounts: string[]) => void;

interface IWalletEvent {
    /**
     * Sets the wallet event listener.
     *
     * @param callback The callback to be called when the event is triggered
     */
    setWalletEventListener: (callback: TWalletEventCallback) => void;
}

/**
 * This hooks allows listening to wallet events.
 * It will automatically remove the previous listener
 * if a new one is set.
 * It will also automatically remove the listener
 * when the component unmounts.
 *
 * @param eventType The type of wallet event to listen for
 */
export const useWalletEvent = (
    eventType: EWalletEvent,
    authMethod: EWalletConnectionMethod
): IWalletEvent => {
    const eventRef = useRef<TWalletEventCallback>();

    const { connectors } = useConnect();

    const setWalletEventListener = (callback: TWalletEventCallback): void => {
        if (authMethod === EWalletConnectionMethod.Metamask) {
            if (window.ethereum == null) throw new MetamaskNotInstalledError();
            if (typeof window.ethereum.on === "function") {
                if (eventRef.current) {
                    Logger.warn(
                        "useWalletEvent: subscription exists already, removing..."
                    );
                    // remove previous listener
                    if (typeof window.ethereum.removeListener === "function") {
                        window.ethereum.removeListener(
                            // @ts-expect-error (we already handle the event type)
                            eventType,
                            eventRef.current
                        );
                    }
                }
                eventRef.current = callback;
                // @ts-expect-error
                window.ethereum.on(eventType, callback);
            }
            return;
        }
        if (
            authMethod === EWalletConnectionMethod.WalletConnect &&
            eventType === EWalletEvent.AccountChanged
        ) {
            connectors.forEach((connector) => {
                if (eventRef.current) {
                    Logger.debug("useWalletEvent: cleaning up listeners");
                    connector.removeAllListeners("change");
                }
                Logger.debug(
                    "useWalletEvent: setting account change handler...",
                    connector
                );
                connector.on("change", ({ account }) => {
                    callback(account ? [account] : []);
                });
                // this is not accurate but it's not important since we clean all handlers
                eventRef.current = callback;
            });
        }
    };

    /**
     * Remove the listener when the component unmounts
     * or the event type changes.
     */
    useEffect(
        () => () => {
            if (eventRef.current !== undefined) {
                Logger.debug(
                    "useWalletEvent: unsubscribing from event:",
                    eventType
                );
                if (typeof window.ethereum?.removeListener === "function") {
                    // @ts-expect-error
                    window.ethereum.removeListener(eventType, eventRef.current);
                }
                if (
                    authMethod === EWalletConnectionMethod.WalletConnect &&
                    eventType === EWalletEvent.AccountChanged
                ) {
                    connectors.forEach((connector) => {
                        connector.removeAllListeners("change");
                    });
                }
            }
        },
        [connectors, eventType, authMethod]
    );

    return { setWalletEventListener };
};
