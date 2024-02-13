import { FC, memo, useState } from "react";
import { Button } from "@alphaday/ui-kit";
import { EAuthMethod, EAuthState } from "src/api/types";
import { ReactComponent as AppleIcon } from "src/assets/icons/socials/apple_icon.svg";
import { ReactComponent as EnvelopeIcon } from "src/assets/icons/socials/envelope_icon.svg";
import { ReactComponent as GoogleIcon } from "src/assets/icons/socials/google_icon.svg";
import { Auth, AuthProps } from "./Auth";

const ENABLE_APPLE_AUTH = false;

export const AuthMethodSelection: FC<{
    handleLogin: () => void;
    handleSSOCallback: (provider: EAuthMethod) => void;
}> = ({ handleSSOCallback, handleLogin }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col gap-4">
                <Button
                    className="bg-backgroundBlue100 border-backgroundBlue100 hover:bg-backgroundBlue text-primary inline-flex w-full items-center justify-center gap-1 rounded-lg px-4 py-6 text-base font-bold tracking-tight"
                    onClick={() => handleSSOCallback(EAuthMethod.Email)}
                >
                    <EnvelopeIcon /> &nbsp; Continue with Email
                </Button>
                <Button
                    className="border-backgroundBlue text-primary inline-flex w-full items-center justify-center gap-1 rounded-lg px-4 py-6 text-base font-bold tracking-tight"
                    onClick={() => handleSSOCallback(EAuthMethod.Google)}
                >
                    <GoogleIcon /> &nbsp; Continue with Google
                </Button>

                {ENABLE_APPLE_AUTH && (
                    <Button
                        className="border-backgroundBlue text-primary inline-flex w-full items-center justify-center gap-1 rounded-lg px-4 py-6 text-base font-bold tracking-tight"
                        onClick={() => handleSSOCallback(EAuthMethod.Apple)}
                    >
                        <AppleIcon /> &nbsp; Continue with Apple
                    </Button>
                )}
            </div>
            <div className="mt-4 flex items-center gap-1">
                <span className="text-primary text-sm">
                    Already have an account?
                </span>
                <button
                    type="button"
                    className="text-primary text-sm font-semibold underline transition-opacity hover:opacity-80"
                    onClick={handleLogin}
                >
                    Log in
                </button>
            </div>

            <div className="text-primary mt-4 text-sm">
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
        <div className="flex min-h-[300px] w-full flex-col items-center">
            <h2 className="text-primary text-center text-2xl font-semibold leading-loose">
                {isSignIn ? "Sign in to" : "Sign up for"} Alphaday
            </h2>

            {authState.status === EAuthState.SelectingMethod && !isSignIn ? (
                <AuthMethodSelection
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
