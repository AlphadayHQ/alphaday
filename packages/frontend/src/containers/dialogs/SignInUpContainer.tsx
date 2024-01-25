import { useCallback, useState } from "react";
import { Dialog } from "@alphaday/ui-kit";
import { useKeyPress, useSignInUp } from "src/api/hooks";
import { useAppDispatch } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { ESignInUpMethod, ESignInUpState } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import SignInUpModule from "src/components/signinup/SignInUpModule";

const SignInUpContainer = () => {
    const [email, setEmail] = useState("");
    const dispatch = useAppDispatch();
    const { authState, resetAuthState, requestCode } = useSignInUp();

    const handleEmailSubmit = useCallback(() => {
        requestCode(email);
    }, [requestCode, email]);

    const handleOtpSubmit = useCallback(() => {}, []);

    const handleSSOCallback = useCallback(
        (method: ESignInUpMethod) => {
            if (authState.status === ESignInUpState.SelectingMethod) {
                if (method === ESignInUpMethod.Email) {
                    dispatch(
                        userStore.setSignInUpState(ESignInUpState.SigningIn)
                    );
                } else {
                    // TODO: Implement SSO
                }
            }
        },
        [dispatch, authState]
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
                authState.status === ESignInUpState.VerifyingEmail ||
                authState.status === ESignInUpState.SigningIn ||
                authState.status === ESignInUpState.SigningUp ||
                authState.status === ESignInUpState.SelectingMethod
            }
            useKeyPress={useKeyPress}
            closeButtonProps={{ className: "border-0" }}
            onClose={resetAuthState}
        >
            <SignInUpModule
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

export default SignInUpContainer;
