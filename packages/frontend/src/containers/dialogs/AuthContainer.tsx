import { useCallback, useEffect, useState } from "react";
import { Dialog } from "@alphaday/ui-kit";
import { useKeyPress, useAuth } from "src/api/hooks";
import { useAppDispatch } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { EAuthMethod, EAuthState } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import AuthModule from "src/components/auth/AuthModule";

const AuthContainer = () => {
    const [email, setEmail] = useState("");
    const dispatch = useAppDispatch();
    const { authState, resetAuthState, requestCode, ssoLogin, verifyToken } =
        useAuth();

    useEffect(() => {
        /**
         * Reset auth state when the component mounts and the state is a transient state
         * This is necessary because the auth state is persisted
         */
        if (
            authState.status === EAuthState.SigningIn ||
            authState.status === EAuthState.SelectingMethod ||
            authState.status === EAuthState.GenericError
        ) {
            Logger.debug("AuthContainer: Found user in transient auth state");
            resetAuthState();
        }
        // should only run on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEmailSubmit = useCallback(() => {
        requestCode(email)
            .then(() => toast("OTP sent to your email"))
            .catch(() => {
                toast("Email could not be sent. Please try again.");
                Logger.error("Failed to send OTP to email", email);
            });
    }, [requestCode, email]);

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

    const handleSSOCallback = useCallback(
        (method: EAuthMethod) => {
            if (
                authState.status === EAuthState.SelectingMethod &&
                method === EAuthMethod.Email
            ) {
                dispatch(userStore.setAuthState(EAuthState.SigningIn));
            } else {
                ssoLogin(method);
            }
        },
        [dispatch, authState, ssoLogin]
    );

    const handleEmailChange = debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
        }
    );

    return (
        <Dialog
            size="xs"
            showXButton
            showDialog={
                authState.status === EAuthState.VerifyingEmail ||
                authState.status === EAuthState.SigningIn ||
                authState.status === EAuthState.SigningUp ||
                authState.status === EAuthState.SelectingMethod
            }
            useKeyPress={useKeyPress}
            closeButtonProps={{ className: "border-0 [&_svg]:w-3 [&_svg]:h-3" }}
            onClose={resetAuthState}
        >
            <AuthModule
                email={email}
                authState={authState}
                handleOtpSubmit={handleOtpSubmit}
                handleSSOCallback={handleSSOCallback}
                handleEmailSubmit={handleEmailSubmit}
                handleEmailChange={handleEmailChange}
            />
        </Dialog>
    );
};

export default AuthContainer;
