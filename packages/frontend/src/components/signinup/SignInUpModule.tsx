import { FC, memo, useMemo, useState } from "react";
import { Button } from "@alphaday/ui-kit";
import { useKeyPress } from "src/api/hooks";
import { ESignInUpMethod, ESignInUpState } from "src/api/types";
import { validateEmail } from "src/api/utils/accountUtils";
import { ReactComponent as AppleIcon } from "src/assets/icons/socials/apple_icon.svg";
import { ReactComponent as GoogleIcon } from "src/assets/icons/socials/google_icon.svg";
import OtpModule from "./OtpModule";

interface IEmailInputProps {
    isValidEmail: boolean;
    handleEmailSubmit: () => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput: FC<IEmailInputProps> = ({
    isValidEmail,
    handleEmailSubmit,
    handleEmailChange,
}) => {
    useKeyPress({
        targetKey: "Enter",
        callback: handleEmailSubmit,
    });
    return (
        <div className="p-5">
            <p className="flex flex-col mb-5">
                <span className="text-muted py-3">
                    Enter your email address to get started
                </span>
                <input
                    type="email"
                    className="self-stretch px-4 py-6 border-0 bg-neutral-800 rounded-lg justify-start items-center inline-flex grow shrink basis-0 text-primary text-base leading-tight tracking-tight "
                    placeholder="Email"
                    onChange={handleEmailChange}
                />
            </p>

            <Button
                className={`w-full border-0 justify-center items-center gap-1 inline-flex text-base font-bold px-4 py-6 ${
                    isValidEmail
                        ? "bg-accentVariant100 text-primary"
                        : "bg-zinc-800 text-primaryVariant100"
                } rounded-lg tracking-tight`}
                onClick={handleEmailSubmit}
            >
                Continue
            </Button>
        </div>
    );
};

const MethodSelection: FC<{
    handleLogin: () => void;
    handleSSOCallback: (provider: ESignInUpMethod) => void;
}> = ({ handleSSOCallback, handleLogin }) => {
    return (
        <div className="w-full">
            <div className="flex flex-col gap-4">
                <Button
                    className="w-full justify-center items-center gap-1 inline-flex text-base font-bold px-4 py-6 bg-backgroundBlue border-backgroundBlue hover:bg-backgroundBlue100 text-primary rounded-lg tracking-tight"
                    onClick={() => handleSSOCallback(ESignInUpMethod.Email)}
                >
                    <GoogleIcon /> &nbsp; Continue with Email
                </Button>
                <Button
                    className="w-full justify-center items-center gap-1 inline-flex text-base font-bold px-4 py-6 border-backgroundBlue text-primary rounded-lg tracking-tight"
                    onClick={() => handleSSOCallback(ESignInUpMethod.Google)}
                >
                    <GoogleIcon /> &nbsp; Continue with Google
                </Button>

                <Button
                    className="w-full justify-center items-center gap-1 inline-flex text-base font-bold px-4 py-6 border-backgroundBlue text-primary rounded-lg tracking-tight"
                    onClick={() => handleSSOCallback(ESignInUpMethod.Apple)}
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

interface ISignInUpProps {
    status: ESignInUpState;
    email: string;
    handleOtpSubmit: (otp: string) => void;
    handleSSOCallback: (provider: ESignInUpMethod) => void;
    handleEmailSubmit: () => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignInUp: FC<ISignInUpProps> = ({
    status,
    email,
    handleOtpSubmit,
    handleSSOCallback,
    handleEmailSubmit,
    handleEmailChange,
}) => {
    const isValidEmail = useMemo(() => validateEmail(email), [email]);
    return status === ESignInUpState.VerifyingEmail ? (
        <div className="flex flex-col justify-center w-full h-full p-5">
            <p className="text-primary text-sm">
                Enter the 6 digit verification code we sent to
                <span className="font-bold"> {email}</span>
            </p>
            <div className="flex justify-between gap-2.5 py-4">
                <OtpModule handleOtpSubmit={handleOtpSubmit} />
            </div>
            <p className="text-primary text-sm flex flex-col">
                Didn&apos;t get a verification code?{" "}
                <button
                    type="button"
                    className="text-primary text-sm font-bold"
                >
                    Resend now
                </button>
            </p>
        </div>
    ) : (
        <div className="w-full">
            <EmailInput
                isValidEmail={isValidEmail}
                handleEmailSubmit={handleEmailSubmit}
                handleEmailChange={handleEmailChange}
            />

            <div className="opacity-60 text-primary text-xs tracking-wide">
                Or continue with
            </div>
            <div className="w-full flex gap-2.5 py-2 justify-evenly">
                <button
                    type="button"
                    className="px-4 py-3 bg-primary rounded-lg justify-center items-center gap-2 inline-flex text-primaryVariant100 hover:text-black text-base font-bold flex-grow"
                    onClick={() => handleSSOCallback(ESignInUpMethod.Google)}
                >
                    <GoogleIcon /> Google
                </button>
                <button
                    type="button"
                    className="px-4 py-3 bg-primary rounded-lg justify-center items-center gap-2 inline-flex text-primaryVariant100 hover:text-black text-base font-bold flex-grow"
                    onClick={() => handleSSOCallback(ESignInUpMethod.Apple)}
                >
                    <AppleIcon className="text-black" /> Apple
                </button>
            </div>
        </div>
    );
};

const SignInUpModule: FC<ISignInUpProps> = memo(function SignInUpModule({
    status,
    email,
    handleOtpSubmit,
    handleSSOCallback,
    handleEmailSubmit,
    handleEmailChange,
}: ISignInUpProps) {
    const [isSignIn, setIsSignIn] = useState(false);

    return (
        <div className="w-full min-h-[300px] flex flex-col items-center">
            <h2 className="text-primary text-2xl font-semibold leading-loose text-center">
                {isSignIn ? "Sign in to" : "Sign up for"} Alphaday
            </h2>

            {status === ESignInUpState.SelectingMethod && !isSignIn ? (
                <MethodSelection
                    handleSSOCallback={handleSSOCallback}
                    handleLogin={() => setIsSignIn(true)}
                />
            ) : (
                <SignInUp
                    status={status}
                    email={email}
                    handleOtpSubmit={handleOtpSubmit}
                    handleSSOCallback={handleSSOCallback}
                    handleEmailSubmit={handleEmailSubmit}
                    handleEmailChange={handleEmailChange}
                />
            )}
        </div>
    );
});

export default SignInUpModule;
