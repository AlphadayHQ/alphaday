import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useSignInUp } from "src/api/hooks";
import { debounce } from "src/api/utils/helpers";
import { SignInUp } from "src/components/signinup/SignInUp";
import PagedMobileLayout from "src/layout/PagedMobileLayout";

const AuthPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const history = useHistory();
    const { authState, requestCode, verifyToken, resetAuthState } =
        useSignInUp();

    const handleEmailSubmit = useCallback(() => {
        requestCode(email);
    }, [email, requestCode]);

    const handleOtpSubmit = useCallback(
        (otp: string) => {
            verifyToken(email, otp);
        },
        [email, verifyToken]
    );

    const handleEmailChange = debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
        }
    );

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
                handleSSOCallback={() => {}}
                handleEmailSubmit={handleEmailSubmit}
                handleEmailChange={handleEmailChange}
            />
        </PagedMobileLayout>
    );
};

export default AuthPage;
