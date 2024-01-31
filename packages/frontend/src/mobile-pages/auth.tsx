import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useSignInUp } from "src/api/hooks";
import { ESignInUpMethod } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import { SignInUp } from "src/components/signinup/SignInUp";
import PagedMobileLayout from "src/layout/PagedMobileLayout";

const AuthPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const history = useHistory();
    const {
        authState,
        isAuthenticated,
        requestCode,
        verifyToken,
        resetAuthState,
        ssoLogin,
    } = useSignInUp();

    const handleEmailSubmit = useCallback(() => {
        requestCode(email)
            .then(() => toast("OTP sent to your email"))
            .catch(() => {
                Logger.error("Failed to send OTP to email", email);
            });
    }, [email, requestCode]);

    const handleOtpSubmit = useCallback(
        (otp: string) => {
            verifyToken(email, otp)
                .then(() => {
                    toast("Successfully verified email");
                    history.push("/");
                })
                .catch(() => {
                    Logger.error("Failed to verify OTP", otp);
                });
        },
        [email, history, verifyToken]
    );

    const handleEmailChange = debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
        }
    );

    const handleSSOCallback = useCallback(
        (method: ESignInUpMethod) => {
            ssoLogin(method);
        },
        [ssoLogin]
    );

    /**
     * If user is already authenticated, redirect to home page
     */
    if (isAuthenticated) {
        history.push("/");
        return null;
    }

    return (
        <PagedMobileLayout
            title="Continue with Email"
            handleClose={resetAuthState}
            handleBack={() =>
                history.length > 1 ? history.goBack() : history.push("/")
            }
        >
            <SignInUp
                email={email}
                authState={authState}
                handleOtpSubmit={handleOtpSubmit}
                handleSSOCallback={handleSSOCallback}
                handleEmailSubmit={handleEmailSubmit}
                handleEmailChange={handleEmailChange}
            />
        </PagedMobileLayout>
    );
};

export default AuthPage;
