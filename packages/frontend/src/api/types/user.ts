import { TRemoteProfile } from "../services";
import { TCryptoAccount } from "./primitives";

export enum WalletConnectionState {
    Disconnected,
    SelectingMethod,
    Connecting,
    Connected,
    ConnectionError,
    Verifying,
    Verified,
    Prompted,
    VerificationError,
    SigningOut,
    GenericError,
}

export enum EWalletConnectionMethod {
    Metamask = "metamask",
    WalletConnect = "wallet-connect",
    Unknown = "unknown",
}

export type TPortfolioAccount = TCryptoAccount;

export type TAuthToken = {
    value: string;
    expirationDate?: string | undefined;
};

export type TAuthWallet = {
    account: TCryptoAccount | undefined;
    status: WalletConnectionState;
    error: string | null;
    method: EWalletConnectionMethod | undefined;
};

export type TUserAuth = {
    token: TAuthToken | undefined;
    wallet: TAuthWallet;
};

export type TUserSettings = Record<string, unknown>;

export type TUserProfile = TRemoteProfile;
