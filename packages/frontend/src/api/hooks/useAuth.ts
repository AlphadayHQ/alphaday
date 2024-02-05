import { useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useHistory } from "react-router";
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
    const navigate = useHistory();

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
                const verifyResp = await verifyTokenMut({
                    email,
                    code,
                }).unwrap();

                dispatch(
                    userStore.setAuthToken({ value: verifyResp.accessToken })
                );
            } catch (e) {
                Logger.error("useAuth::verifyToken: error verifying OTP", e);
            }
        },
        [dispatch, verifyTokenMut]
    );

    const googleSSOCallback = useCallback(
        ({ access_token }: Record<string, string>) => {
            ssoLoginMut({
                accessToken: access_token,
                provider: EAuthMethod.Google,
            })
                .unwrap()
                .then((r) => {
                    Logger.debug("useAuth::googleSSOLogin: success", r);
                    dispatch(userStore.setAuthToken({ value: r.accessToken }));
                    dispatch(userStore.setAuthState(EAuthState.Verified));
                    Logger.debug("useAuth::googleSSOLogin: redirecting");
                    navigate.push("/");
                })
                .catch((e) =>
                    Logger.error("useAuth::googleSSOLogin: error", e)
                );
        },
        [ssoLoginMut, dispatch, navigate]
    );

    const googleSSOLogin = useGoogleLogin({
        onSuccess: googleSSOCallback,
        redirect_uri: `${window.location.origin}/auth/google_callback/`,
    });
    const ssoLogin = useCallback(
        (provider: EAuthMethod) => {
            if (provider === EAuthMethod.Google) {
                googleSSOLogin();
            }
        },
        [googleSSOLogin]
    );

    const resetAuthState = useCallback(() => {
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
