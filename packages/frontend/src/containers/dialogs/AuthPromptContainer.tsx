import { useCallback, useMemo, useState } from "react";
import { Modal } from "@alphaday/ui-kit";
import { useAuth } from "src/api/hooks";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as uiStore from "src/api/store/slices/ui";
import { EAuthMethod } from "src/api/types";
import { AuthMethodSelection } from "src/components/auth/AuthModule";

const AuthPromptContainer = () => {
    const dispatch = useAppDispatch();
    const lastAuthPromptedTs = useAppSelector(
        (state) => state.ui.lastAuthPrompted
    );
    const setLastAuthPrompted = useCallback(() => {
        dispatch(uiStore.setLastAuthPrompted(new Date().getTime()));
    }, [dispatch]);

    const { ssoLogin, isAuthenticated } = useAuth();
    const isAuthPromptVisible = useMemo(() => {
        if (!lastAuthPromptedTs) {
            setLastAuthPrompted();
            return true;
        }
        // check if the auth prompt should be visible within 7days/14days
        const now = new Date().getTime();
        return (
            !isAuthenticated &&
            now - lastAuthPromptedTs > 7 * 24 * 60 * 60 * 1000
        ); // 7days
    }, [lastAuthPromptedTs, setLastAuthPrompted, isAuthenticated]);

    const [isSignIn, setIsSignIn] = useState(false);
    const handleSSOCallback = useCallback(
        (method: EAuthMethod) => {
            ssoLogin(method);
        },
        [ssoLogin]
    );

    // TODO: improve this modal styles
    return (
        <Modal
            showModal={isAuthPromptVisible}
            className="fixed bottom-[60px] m-0 w-full p-8"
            onClose={setLastAuthPrompted}
        >
            <h2 className="text-primary text-center text-2xl font-semibold leading-loose">
                {isSignIn ? "Sign in to" : "Sign up for"} Alphaday
            </h2>

            <AuthMethodSelection
                handleSSOCallback={handleSSOCallback}
                handleLogin={() => setIsSignIn(true)}
            />
        </Modal>
    );
};

export default AuthPromptContainer;
