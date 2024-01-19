import { useCallback, useState } from "react";
import { Dialog } from "@alphaday/ui-kit";
import { useKeyPress, useSignInUp } from "src/api/hooks";
import { useAppDispatch } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { ESignInUpState } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import SignInUpModule from "src/components/signinup/SignInUpModule";

const SignInUpContainer = () => {
    const [email, setEmail] = useState("");
    const dispatch = useAppDispatch();
    const { authState, resetAuthState } = useSignInUp();

    const handleEmailSubmit = useCallback(() => {
        dispatch(userStore.setSignInUpState(ESignInUpState.VerifyingEmail));
    }, [dispatch]);

    const handleOtpSubmit = useCallback(() => {}, []);

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
                authState.status === ESignInUpState.SelectingMethod
            }
            useKeyPress={useKeyPress}
            closeButtonProps={{ className: "border-0" }}
            onClose={resetAuthState}
        >
            <SignInUpModule
                email={email}
                status={authState.status}
                handleOtpSubmit={handleOtpSubmit}
                handleSSOCallback={() => {}}
                handleEmailSubmit={handleEmailSubmit}
                handleEmailChange={handleEmailChange}
            />
        </Dialog>
    );
};

export default SignInUpContainer;
