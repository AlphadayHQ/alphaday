import { useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
    useRequestCodeMutation,
    useVerifyTokenMutation,
    useSsoLoginMutation,
    useSignoutMutation,
} from "../services";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signInWithApple } from "../store/providers/oauth-provider";
import * as userStore from "../store/slices/user";
import { EAuthMethod, EAuthState, TUserAccess } from "../types";
import { Logger } from "../utils/logging";
import { toast, EToastRole } from "../utils/toastUtils";

interface IUseAuth {
    isAuthenticated: boolean;
    authState: TUserAccess;
    openAuthModal: () => void;
    resetAuthState: () => void;
    requestCode: (email: string) => Promise<void>;
    verifyToken: (email: string, code: string) => Promise<void>;
    ssoLogin: (provider: EAuthMethod) => void;
    logout: () => Promise<void>;
}

/**
 * useAuth
 *
 * @returns
 */
export const useAuth = (): IUseAuth => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(userStore.selectAuthState);
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const [requestCodeMut] = useRequestCodeMutation();
    const [verifyTokenMut] = useVerifyTokenMutation();
    const [ssoLoginMut] = useSsoLoginMutation();
    const [logoutMut] = useSignoutMutation();

    const openAuthModal = useCallback(() => {
        dispatch(userStore.initAuthMethodSelection());
    }, [dispatch]);

    const requestCode = useCallback(
        async (email: string) => {
            await requestCodeMut({ email }).unwrap();
            Logger.debug("useAuth::requestCode: sent OTP to email");
            dispatch(userStore.setAuthState(EAuthState.VerifyingEmail));
        },
        [dispatch, requestCodeMut]
    );

    const verifyToken = useCallback(
        async (email: string, code: string) => {
            Logger.debug("useAuth::verifyToken: verifying OTP", {
                email,
                code,
            });
            const verifyResp = await verifyTokenMut({
                email,
                code,
            }).unwrap();

            Logger.debug("useAuth::verifyToken: verified OTP", verifyResp);
            // note: token an user email are set through RTK-query (see verifyToken::onQueryStarted)
            dispatch(userStore.setAuthState(EAuthState.Verified));
        },
        [dispatch, verifyTokenMut]
    );

    const googleSSOCallback = useCallback(
        ({ access_token }: Record<string, string>) => {
            Logger.debug("useAuth::googleSSOCallback: received token", {
                access_token,
            });
            ssoLoginMut({
                accessToken: access_token,
                provider: EAuthMethod.Google,
            })
                .unwrap()
                .then((r) => {
                    Logger.debug("useAuth::googleSSOLogin: success", r);
                    dispatch(userStore.setAuthToken({ value: r.token }));
                    dispatch(userStore.setAuthEmail(r.user.email));
                    dispatch(userStore.setAuthState(EAuthState.Verified));
                })
                .catch((e) => {
                    toast("Could not login with Google");
                    Logger.error("useAuth::googleSSOLogin: error", e);
                });
        },
        [ssoLoginMut, dispatch]
    );

    const googleSSOLogin = useGoogleLogin({
        onSuccess: googleSSOCallback,
        redirect_uri: `${window.location.origin}/auth/google_callback/`,
    });
    const appleSSOLogin = useCallback(() => {
        signInWithApple()
            .then((data) => {
                Logger.debug("useAuth::appleSSOLogin: received token", {
                    data,
                });
                ssoLoginMut({
                    accessToken: data.authorization.id_token,
                    idToken: data.authorization.id_token,
                    provider: EAuthMethod.Apple,
                })
                    .unwrap()
                    .then((r) => {
                        Logger.debug("useAuth::appleSSOLogin: success", r);
                        dispatch(userStore.setAuthToken({ value: r.token }));
                        dispatch(userStore.setAuthEmail(r.user.email));
                        dispatch(userStore.setAuthState(EAuthState.Verified));
                    })
                    .catch((e) => {
                        Logger.error("useAuth::appleSSOLogin: error", e);
                        toast("Could not login with Apple");
                    });
            })
            .catch((e) => {
                Logger.error("useAuth::appleSSOLogin: error", e);
                toast("Could not login with Apple", {
                    type: EToastRole.Error,
                });
            });
    }, [ssoLoginMut, dispatch]);

    const ssoLogin = useCallback(
        (provider: EAuthMethod) => {
            dispatch(userStore.setAuthMethod(provider));

            if (provider === EAuthMethod.Google) {
                googleSSOLogin();
            }

            if (provider === EAuthMethod.Apple) {
                appleSSOLogin();
            }
        },
        [googleSSOLogin, appleSSOLogin, dispatch]
    );

    const resetAuthState = useCallback(() => {
        Logger.debug("useAuth::resetAuthState: resetting auth state");
        dispatch(userStore.resetAuthState());
    }, [dispatch]);

    const logout = useCallback(async () => {
        Logger.debug("useAuth::logout: logging out");
        await logoutMut().unwrap();
        resetAuthState();
    }, [logoutMut, resetAuthState]);

    return {
        isAuthenticated,
        authState,
        openAuthModal,
        resetAuthState,
        requestCode,
        verifyToken,
        ssoLogin,
        logout,
    };
};
