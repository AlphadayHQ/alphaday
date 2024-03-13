import { memo, useCallback, useMemo, useState } from "react";
import { Modal } from "@alphaday/ui-kit";
import { useAuth } from "src/api/hooks";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as uiStore from "src/api/store/slices/ui";
import { EAuthMethod } from "src/api/types";
import { AuthMethodSelection } from "src/components/auth/AuthModule";

const hasTimeElapsed = (lastAuthPromptedTs: number) => {
    const now = new Date().getTime();
    const timeElapsed = now - lastAuthPromptedTs;
    const timeInterval = 7 * 86400 * 1000; // 7days
    return timeElapsed > timeInterval;
};

const AuthPromptContainer = memo(() => {
    const dispatch = useAppDispatch();
    const lastAuthPromptedTs = useAppSelector(
        (state) => state.ui.lastAuthPrompted
    );
    const setLastAuthPrompted = useCallback(() => {
        dispatch(uiStore.setLastAuthPrompted(Date.now()));
    }, [dispatch]);

    const { ssoLogin, isAuthenticated } = useAuth();
    const isAuthPromptVisible = useMemo(() => {
        if (!lastAuthPromptedTs) {
            return true;
        }
        return !isAuthenticated && hasTimeElapsed(lastAuthPromptedTs); // 7days
    }, [lastAuthPromptedTs, isAuthenticated]);

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
            className="fixed bottom-0 m-0 w-full p-8 bg-backgroundVariant300 rounded-t-[12px] rounded-b-[0px]"
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
});

export default AuthPromptContainer;
