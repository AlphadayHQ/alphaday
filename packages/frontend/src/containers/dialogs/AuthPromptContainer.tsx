import { useCallback, useState } from "react";
import { Modal } from "@alphaday/ui-kit";
import { useAuth } from "src/api/hooks";
import { EAuthMethod } from "src/api/types";
import { AuthMethodSelection } from "src/components/auth/AuthModule";

const AuthPromptContainer = () => {
    // TODO:add logic to store and check if the auth prompt should be visible within 7days/14days
    const [isAuthPromptVisible, setIsPromptVisible] = useState(true);
    const { ssoLogin } = useAuth();
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
            onClose={() => setIsPromptVisible(false)}
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
