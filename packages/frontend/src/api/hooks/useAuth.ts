import { useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
    useRequestCodeMutation,
    useVerifyTokenMutation,
    useSsoLoginMutation,
} from "../services";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as userStore from "../store/slices/user";
import { EAuthMethod, EAuthState, TUserAccess } from "../types";
import { Logger } from "../utils/logging";

interface IUseAuth {
    isAuthenticated: boolean;
    authState: TUserAccess;
    openAuthModal: () => void;
    resetAuthState: () => void;
    requestCode: (email: string) => Promise<void>;
    verifyToken: (email: string, code: string) => Promise<void>;
    ssoLogin: (provider: EAuthMethod) => void;
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

    const openAuthModal = useCallback(() => {
        dispatch(userStore.initAuthMethodSelection());
    }, [dispatch]);

    const requestCode = useCallback(
        async (email: string) => {
            try {
                await requestCodeMut({ email }).unwrap();
                Logger.debug("useAuth::requestCode: sent OTP to email");
                dispatch(userStore.setAuthState(EAuthState.VerifyingEmail));
            } catch (e) {
                Logger.error(
                    "useAuth::requestCode: error sending OTP to email",
                    e
                );
            }
        },
        [dispatch, requestCodeMut]
    );

    const verifyToken = useCallback(
        async (email: string, code: string) => {
            try {
                Logger.debug("useAuth::verifyToken: verifying OTP", {
                    email,
                    code,
                });
                const verifyResp = await verifyTokenMut({
                    email,
                    code,
                }).unwrap();

                Logger.debug("useAuth::verifyToken: verified OTP", verifyResp);
                dispatch(userStore.setAuthToken({ value: verifyResp.token }));
                dispatch(userStore.setAuthEmail(verifyResp.user.email));
                dispatch(userStore.setAuthState(EAuthState.Verified));
            } catch (e) {
                Logger.error("useAuth::verifyToken: error verifying OTP", e);
            }
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
                    Logger.error("useAuth::googleSSOLogin: error", e);
                });
        },
        [ssoLoginMut, dispatch]
    );

    const googleSSOLogin = useGoogleLogin({
        onSuccess: googleSSOCallback,
        redirect_uri: `${window.location.origin}/auth/google_callback/`,
    });
    const ssoLogin = useCallback(
        (provider: EAuthMethod) => {
            dispatch(userStore.setAuthMethod(provider));

            if (provider === EAuthMethod.Google) {
                googleSSOLogin();
            }

            // TODO: Add other providers here
        },
        [googleSSOLogin, dispatch]
    );

    const resetAuthState = useCallback(() => {
        Logger.debug("useAuth::resetAuthState: resetting auth state");
        dispatch(userStore.resetAuthState());
    }, [dispatch]);

    return {
        isAuthenticated,
        authState,
        openAuthModal,
        resetAuthState,
        requestCode,
        verifyToken,
        ssoLogin,
    };
};
