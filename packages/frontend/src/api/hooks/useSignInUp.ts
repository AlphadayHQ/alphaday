import { useCallback } from "react";
import { useRequestCodeMutation, useVerifyTokenMutation } from "../services";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as userStore from "../store/slices/user";
import { ESignInUpState, TUserAccess } from "../types";
import { Logger } from "../utils/logging";

interface IUseSignInUp {
    authState: TUserAccess;
    openSignInUpModal: () => void;
    resetAuthState: () => void;
    requestCode: (email: string) => MaybeAsync<void>;
    verifyToken: (email: string, code: string) => MaybeAsync<void>;
}

/**
 * useSignInUp
 *
 * @returns
 */
export const useSignInUp = (): IUseSignInUp => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.user.auth.access);

    const [requestCodeMut] = useRequestCodeMutation();
    const [verifyTokenMut] = useVerifyTokenMutation();

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

    const resetAuthState = useCallback(() => {
        dispatch(userStore.resetAuthState());
    }, [dispatch]);

    return {
        authState,
        openSignInUpModal,
        resetAuthState,
        requestCode,
        verifyToken,
    };
};
