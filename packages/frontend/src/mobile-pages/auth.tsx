import { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { ESignInUpState } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import SignInUpModule from "src/components/signinup/SignInUpModule";
import PagedMobileLayout from "src/layout/PagedMobileLayout";

const AuthPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const dispatch = useAppDispatch();
    const authState = useAppSelector(userStore.selectUserAccess);

    const handleEmailSubmit = useCallback(() => {
        dispatch(userStore.setSignInUpState(ESignInUpState.VerifyingEmail));
    }, [dispatch]);

    const handleOtpSubmit = useCallback(() => {}, []);

    const handleClose = useCallback(() => {
        dispatch(userStore.resetAuthState());
    }, [dispatch]);

    const handleEmailChange = debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
        }
    );

    return (
        <PagedMobileLayout
            title="Continue with Email"
            handleClose={handleClose}
        >
            <SignInUpModule
                email={email}
                status={authState.status}
                handleOtpSubmit={handleOtpSubmit}
                handleSSOCallback={() => {}}
                handleEmailSubmit={handleEmailSubmit}
                handleEmailChange={handleEmailChange}
            />
        </PagedMobileLayout>
    );
};

export default AuthPage;
