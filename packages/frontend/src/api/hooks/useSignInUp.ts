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
import { ESignInUpMethod, ESignInUpState, TUserAccess } from "../types";
import { Logger } from "../utils/logging";

interface IUseSignInUp {
    isAuthenticated: boolean;
    authState: TUserAccess;
    openSignInUpModal: () => void;
    resetAuthState: () => void;
    requestCode: (email: string) => Promise<void>;
    verifyToken: (email: string, code: string) => Promise<void>;
    ssoLogin: (provider: ESignInUpMethod) => void;
}

/**
 * useSignInUp
 *
 * @returns
 */
export const useSignInUp = (): IUseSignInUp => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(userStore.selectAuthState);
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);
    const navigate = useHistory();

    const [requestCodeMut] = useRequestCodeMutation();
    const [verifyTokenMut] = useVerifyTokenMutation();
    const [ssoLoginMut] = useSsoLoginMutation();

    const openSignInUpModal = useCallback(() => {
        dispatch(userStore.initSignInUpMethodSelection());
    }, [dispatch]);

    const requestCode = useCallback(
        async (email: string) => {
            try {
                await requestCodeMut({ email }).unwrap();
                dispatch(
                    userStore.setSignInUpState(ESignInUpState.VerifyingEmail)
                );
            } catch (e) {
                Logger.error(
                    "useSignInUp::requestCode: error sending OTP to email",
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
                Logger.error(
                    "useSignInUp::verifyToken: error verifying OTP",
                    e
                );
            }
        },
        [dispatch, verifyTokenMut]
    );

    const googleSSOCallback = useCallback(
        ({ access_token }: Record<string, string>) => {
            ssoLoginMut({
                accessToken: access_token,
                provider: ESignInUpMethod.Google,
            })
                .unwrap()
                .then((r) => {
                    Logger.debug("useSignInUp::googleSSOLogin: success", r);
                    dispatch(userStore.setAuthToken({ value: r.accessToken }));
                    dispatch(
                        userStore.setSignInUpState(ESignInUpState.Verified)
                    );
                    Logger.debug("useSignInUp::googleSSOLogin: redirecting");
                    navigate.push("/");
                })
                .catch((e) =>
                    Logger.error("useSignInUp::googleSSOLogin: error", e)
                );
        },
        [ssoLoginMut, dispatch, navigate]
    );

    const googleSSOLogin = useGoogleLogin({
        onSuccess: googleSSOCallback,
        redirect_uri: `${window.location.origin}/auth/google_callback/`,
    });
    const ssoLogin = useCallback(
        (provider: ESignInUpMethod) => {
            if (provider === ESignInUpMethod.Google) {
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
        openSignInUpModal,
        resetAuthState,
        requestCode,
        verifyToken,
        ssoLogin,
    };
};
