import { useState, useRef, useCallback } from "react";
import { MiniDialog } from "@alphaday/ui-kit";
import { IonPage } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuth } from "src/api/hooks";
import { EAuthMethod } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import { ReactComponent as GreenCheckSVG } from "src/assets/icons/green-check.svg";
import { Auth } from "src/components/auth/Auth";
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
    } = useAuth();
    const { current: isInitiallyAuthenticated } = useRef(isAuthenticated);

    const handleEmailSubmit = useCallback(() => {
        requestCode(email)
            .then(() => {
                toast("OTP has been sent to your email");
            })
            .catch(() => {
                toast("Email could not be sent. Please try again.");
                Logger.error("Failed to send OTP to email", email);
            });
    }, [email, requestCode]);

    const handleOtpSubmit = useCallback(
        (otp: string) => {
            verifyToken(email, otp)
                .then(() => {
                    toast("Successfully verified email");
                })
                .catch(() => {
                    toast("We couldn't verify your email. Please try again.");
                    Logger.error("Failed to verify OTP", otp);
                });
        },
        [email, verifyToken]
    );

    const handleEmailChange = debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
        }
    );

    const handleSSOCallback = useCallback(
        (method: EAuthMethod) => {
            ssoLogin(method);
        },
        [ssoLogin]
    );

    /**
     * If user is already authenticated, redirect to home page
     */
    if (isInitiallyAuthenticated) {
        history.push("/");
        return null;
    }

    const goBack = () =>
        history.length > 1 ? history.goBack() : history.push("/");

    const handleCloseAndBack = () => {
        resetAuthState();
        goBack();
    };

    return (
        <IonPage>
            <PagedMobileLayout
                title="Continue with Email"
                handleClose={handleCloseAndBack}
                handleBack={handleCloseAndBack}
            >
                <Auth
                    email={email}
                    authState={authState}
                    handleOtpSubmit={handleOtpSubmit}
                    handleSSOCallback={handleSSOCallback}
                    handleEmailSubmit={handleEmailSubmit}
                    handleEmailChange={handleEmailChange}
                />
                <MiniDialog
                    show={isAuthenticated}
                    icon={<GreenCheckSVG />}
                    title="CONGRATS"
                    onActionClick={() => {
                        history.push("/");
                    }}
                >
                    <div className="text-center text-sm font-normal leading-tight tracking-tight text-slate-300">
                        Your account has been created!
                    </div>
                </MiniDialog>
            </PagedMobileLayout>
        </IonPage>
    );
};

export default AuthPage;
