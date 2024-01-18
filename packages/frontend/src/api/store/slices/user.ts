import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { logout } from "src/api/services/user/userEndpoints";
import {
    TUserAuth,
    TAuthToken,
    TAuthWallet,
    TPortfolioAccount,
    TUserSettings,
    WalletConnectionState,
    EWalletConnectionMethod,
    ESignInUpState,
    ESignInUpMethod,
    TUserAccess,
} from "src/api/types";
import assert from "src/api/utils/assert";
import { Logger } from "src/api/utils/logging";
// note: circular dependencies with types are okay
import type { RootState } from "../store";

export interface IUserState {
    auth: TUserAuth;
    portfolioAccounts: TPortfolioAccount[];
    selectedPortfolioAccount: TPortfolioAccount | null;
    settings: TUserSettings;
    // note: these might be consumed directly from rtk-query
    // profile: IUserProfile;
}

const initialState: IUserState = {
    auth: {
        token: undefined,
        access: {
            status: ESignInUpState.Guest,
            method: ESignInUpMethod.Email,
            error: null,
        },
        wallet: {
            account: undefined,
            status: WalletConnectionState.Disconnected,
            error: null,
            method: undefined,
        },
    },
    portfolioAccounts: [],
    selectedPortfolioAccount: null,
    settings: {},
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        initWalletMethodSelection(draft) {
            draft.auth.wallet.status = WalletConnectionState.SelectingMethod;
            draft.auth.wallet.method = undefined;
            draft.auth.wallet.error = null;
        },
        setConnectionMethod(
            draft,
            action: PayloadAction<EWalletConnectionMethod>
        ) {
            draft.auth.wallet.method = action.payload;
        },
        initWalletConnection(draft) {
            draft.auth.wallet.status = WalletConnectionState.Connecting;
        },
        setWalletAccount(draft, action: PayloadAction<string>) {
            draft.auth.wallet.account = {
                address: action.payload.toLowerCase(),
            };
        },
        setWalletConnected(draft) {
            draft.auth.wallet.status = WalletConnectionState.Connected;
        },
        setWalletInConnectionError(draft) {
            draft.auth.wallet.status = WalletConnectionState.ConnectionError;
        },
        setWalletDisconnected(draft) {
            draft.auth.wallet.status = WalletConnectionState.Disconnected;
            draft.auth.wallet.method = undefined;
            draft.auth.wallet.error = null;
        },
        initWalletVerification(draft) {
            if (
                !(
                    draft.auth.wallet.status ===
                        WalletConnectionState.Connected ||
                    draft.auth.wallet.status === WalletConnectionState.Prompted
                )
            ) {
                throw new Error("expected connected wallet");
            }
            draft.auth.wallet.status = WalletConnectionState.Verifying;
        },
        setWalletVerified(draft) {
            draft.auth.wallet.status = WalletConnectionState.Verified;
        },
        requestWalletVerification(draft) {
            draft.auth.wallet.status = WalletConnectionState.Prompted;
        },
        setWalletInVerificationError(draft) {
            draft.auth.wallet.status = WalletConnectionState.VerificationError;
        },
        addPortfolioAccount(draft, action: PayloadAction<TPortfolioAccount>) {
            const newAccount = { ...action.payload };
            assert(
                newAccount.address != null,
                "expected non-null account address"
            );
            // (@elcharitas): Previously, we made use of accountExist to check if the account exists in the state.
            // However, this only works if the user has reloaded the app. Which in turn leads to multiple entries.
            // To fix this, I'm performing a strict check here.
            if (
                !draft.portfolioAccounts.filter(
                    ({ address }) =>
                        address === newAccount.address?.toLowerCase()
                ).length
            ) {
                draft.portfolioAccounts.push({
                    address: newAccount.address
                        ? newAccount.address.toLowerCase()
                        : null,
                    ens: newAccount.ens,
                });
            }
        },
        setPortfolioAccounts(
            draft,
            action: PayloadAction<TPortfolioAccount[]>
        ) {
            draft.portfolioAccounts = action.payload;
        },
        setSelectedPortfolioAccount(
            draft,
            action: PayloadAction<TPortfolioAccount | null>
        ) {
            if (action.payload === null) {
                draft.selectedPortfolioAccount = null;
            } else {
                if (action.payload?.address == null) {
                    throw new Error("expected non-null address");
                }
                // normally we should check whether this account exists in the
                // portfolio. But since we set the selected account immediately
                // after inserting a new one, the store is not yet updated
                draft.selectedPortfolioAccount = {
                    address: action.payload.address.toLowerCase(),
                };
            }
        },
        setAuthToken(draft, action: PayloadAction<TAuthToken | undefined>) {
            draft.auth.token = action.payload;
        },
        initSignOut(draft) {
            if (draft.auth.wallet.status === WalletConnectionState.SigningOut) {
                /**
                 * On some occasions, the user can click the signout button multiple times
                 * before the wallet is actually disconnected. This is a safeguard to prevent
                 * multiple signout requests/state changes.
                 */
                Logger.debug("user::initSignOut: already signing out");
                return;
            }
            if (draft.auth.wallet.status !== WalletConnectionState.Verified) {
                Logger.error(
                    "user::initSignOut: expected verified wallet, found",
                    current(draft.auth.wallet)
                );
                throw new Error("expected verified wallet");
            }
            draft.auth.wallet.status = WalletConnectionState.SigningOut;
        },
        setWalletAuthError(draft, action: PayloadAction<string>) {
            draft.auth.wallet.error = action.payload;
        },
        setWalletInGenericError(draft) {
            draft.auth.wallet.status = WalletConnectionState.GenericError;
        },
        initSignInUpMethodSelection(draft) {
            draft.auth.access.status = ESignInUpState.SelectingMethod;
            draft.auth.access.method = undefined;
            draft.auth.access.error = null;
        },
        setSignInUpMethod(
            draft,
            action: PayloadAction<ESignInUpMethod | undefined>
        ) {
            draft.auth.access.method = action.payload;
        },
        initSignInUp(draft) {
            draft.auth.access.status = ESignInUpState.SigningUp;
        },
        setSignInUpError(draft, action: PayloadAction<string>) {
            draft.auth.access.error = action.payload;
        },
        setSignInUpState(draft, action: PayloadAction<ESignInUpState>) {
            draft.auth.access.status = action.payload;
        },
        resetAuthState(draft) {
            Logger.debug("user::resetAuthState: resetting auth state");
            draft.auth = initialState.auth;
        },
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addMatcher(logout.matchFulfilled, (_draft) => {
            Logger.debug("user::logout: fulfilled");
            return initialState;
        });
    },
});

export const {
    initWalletMethodSelection,
    setConnectionMethod,
    initWalletConnection,
    setWalletAccount,
    setWalletConnected,
    setWalletInConnectionError,
    initWalletVerification,
    setWalletVerified,
    requestWalletVerification,
    setWalletInVerificationError,
    addPortfolioAccount,
    setPortfolioAccounts,
    setSelectedPortfolioAccount,
    setAuthToken,
    initSignOut,
    setWalletDisconnected,
    setWalletInGenericError,
    setWalletAuthError,
    initSignInUpMethodSelection,
    initSignInUp,
    resetAuthState,
    reset,
} = userSlice.actions;
export default userSlice.reducer;

export const selectIsAuthenticated = (state: RootState): boolean =>
    state.user.auth.token?.value != null &&
    state.user.auth.wallet.status === WalletConnectionState.Verified;

export const selectAuthWallet = (state: RootState): TAuthWallet =>
    state.user.auth.wallet;

export const selectAuthToken = (state: RootState): TAuthToken | undefined =>
    state.user.auth.token;

export const selectUserAccess = (state: RootState): TUserAccess =>
    state.user.auth.access;

export const selectPortfolioAccounts = (
    state: RootState
): TPortfolioAccount[] => state.user.portfolioAccounts;

export const selectSelectedPortfolioAccount = (
    state: RootState
): TPortfolioAccount | null => state.user.selectedPortfolioAccount;
