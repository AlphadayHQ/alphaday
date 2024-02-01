import { FC, memo, useState } from "react";
import { Button } from "@alphaday/ui-kit";
import { EAuthMethod, EAuthState } from "src/api/types";
import { ReactComponent as AppleIcon } from "src/assets/icons/socials/apple_icon.svg";
import { ReactComponent as GoogleIcon } from "src/assets/icons/socials/google_icon.svg";
import { Auth, AuthProps } from "./Auth";

const MethodSelection: FC<{
    handleLogin: () => void;
    handleSSOCallback: (provider: EAuthMethod) => void;
}> = ({ handleSSOCallback, handleLogin }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col gap-4">
                <Button
                    className="w-full justify-center items-center gap-1 inline-flex text-base font-bold px-4 py-6 bg-backgroundBlue border-backgroundBlue hover:bg-backgroundBlue100 text-primary rounded-lg tracking-tight"
                    onClick={() => handleSSOCallback(EAuthMethod.Email)}
                >
                    <GoogleIcon /> &nbsp; Continue with Email
                </Button>
                <Button
                    className="w-full justify-center items-center gap-1 inline-flex text-base font-bold px-4 py-6 border-backgroundBlue text-primary rounded-lg tracking-tight"
                    onClick={() => handleSSOCallback(EAuthMethod.Google)}
                >
                    <GoogleIcon /> &nbsp; Continue with Google
                </Button>

                <Button
                    className="w-full justify-center items-center gap-1 inline-flex text-base font-bold px-4 py-6 border-backgroundBlue text-primary rounded-lg tracking-tight"
                    onClick={() => handleSSOCallback(EAuthMethod.Apple)}
                >
                    <AppleIcon /> &nbsp; Continue with Apple
                </Button>
            </div>
            <div className="flex items-center gap-1 mt-4">
                <span className="text-primary text-sm">
                    Already have an account?
                </span>
                <button
                    type="button"
                    className="text-primary text-sm font-semibold underline"
                    onClick={handleLogin}
                >
                    Log in
                </button>
            </div>

            <div className="mt-4 text-primary text-sm">
                By continuing, you agree to our {}
                <a href="/terms" className="font-semibold underline">
                    Terms of Service
                </a>
                {} and {}
                <a href="/privacy" className="font-semibold underline">
                    Privacy Statement
                </a>
            </div>
        </div>
    );
};

const AuthModule: FC<AuthProps> = memo(function AuthModule({
    email,
    authState,
    handleOtpSubmit,
    handleSSOCallback,
    handleEmailSubmit,
    handleEmailChange,
}: AuthProps) {
    const [isSignIn, setIsSignIn] = useState(false);

    return (
        <div className="w-full min-h-[300px] flex flex-col items-center">
            <h2 className="text-primary text-2xl font-semibold leading-loose text-center">
                {isSignIn ? "Sign in to" : "Sign up for"} Alphaday
            </h2>

            {authState.status === EAuthState.SelectingMethod && !isSignIn ? (
                <MethodSelection
                    handleSSOCallback={handleSSOCallback}
                    handleLogin={() => setIsSignIn(true)}
                />
            ) : (
                <Auth
                    email={email}
                    authState={authState}
                    handleOtpSubmit={handleOtpSubmit}
                    handleSSOCallback={handleSSOCallback}
                    handleEmailSubmit={handleEmailSubmit}
                    handleEmailChange={handleEmailChange}
                />
            )}
        </div>
    );
});

export default AuthModule;
