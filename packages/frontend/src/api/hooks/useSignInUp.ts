import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import * as userStore from "../store/slices/user";
import { TUserAccess } from "../types";

interface IUseSignInUp {
    authState: TUserAccess;
    openSignInUpModal: () => void;
    resetAuthState: () => void;
}

/**
 * useSignInUp
 *
 * @returns
 */
export const useSignInUp = (): IUseSignInUp => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.user.auth.access);

    const openSignInUpModal = useCallback(() => {
        dispatch(userStore.initSignInUpMethodSelection());
    }, [dispatch]);

    const resetAuthState = useCallback(() => {
        dispatch(userStore.resetAuthState());
    }, [dispatch]);

    return {
        authState,
        openSignInUpModal,
        resetAuthState,
    };
};
