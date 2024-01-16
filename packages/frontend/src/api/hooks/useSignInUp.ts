import { useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import * as userStore from "../store/slices/user";

interface IUseSignInUp {
    openSignInUpModal: () => void;
}

/**
 * useSignInUp
 *
 * @returns
 */
export const useSignInUp = (): IUseSignInUp => {
    const dispatch = useAppDispatch();

    const openSignInUpModal = useCallback(() => {
        dispatch(userStore.initSignInUpMethodSelection());
    }, [dispatch]);

    return {
        openSignInUpModal,
    };
};
