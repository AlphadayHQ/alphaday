import { useCallback, useState } from "react";
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
    const { authState, resetAuthState, requestCode, ssoLogin } = useAuth();

    const handleEmailSubmit = useCallback(() => {
        requestCode(email)
            .then(() => toast("OTP sent to your email"))
            .catch(() => {
                Logger.error("Failed to send OTP to email", email);
            });
    }, [requestCode, email]);

    const handleOtpSubmit = useCallback(() => {}, []);

    const handleSSOCallback = useCallback(
        (method: EAuthMethod) => {
            if (authState.status === EAuthState.SelectingMethod) {
                if (method === EAuthMethod.Email) {
                    dispatch(userStore.setAuthState(EAuthState.SigningIn));
                }
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
            closeButtonProps={{ className: "border-0" }}
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
