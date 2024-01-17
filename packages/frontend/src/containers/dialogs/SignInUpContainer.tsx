import { Dialog } from "@alphaday/ui-kit";
import { useKeyPress } from "src/api/hooks";
import { ESignInUpState } from "src/api/types";
import SignInUpModule from "src/components/signinup/SignInUpModule";

const SignInUpContainer = () => {
    return (
        <Dialog
            size="xs"
            showXButton
            showDialog
            useKeyPress={
                ESignInUpState.SelectingMethod ? useKeyPress : undefined
            }
            closeButtonProps={{ className: "border-0" }}
        >
            <SignInUpModule
                isSignIn
                status={ESignInUpState.Guest}
                onSignInUp={() => {}}
                onSSOCallback={() => {}}
            />
        </Dialog>
    );
};

export default SignInUpContainer;
