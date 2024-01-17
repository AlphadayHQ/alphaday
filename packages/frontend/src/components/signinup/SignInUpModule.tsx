import { FC, memo, useCallback, useRef, useState } from "react";
import { Button } from "@alphaday/ui-kit";
import { ESignInUpMethod, ESignInUpState } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import OtpModule from "./OtpModule";

interface IEmailInputProps {
    onEmailSubmit: () => void;
    onSSOCallback: (provider: ESignInUpMethod) => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput: FC<IEmailInputProps> = ({
    onEmailSubmit,
    onSSOCallback,
    handleEmailChange,
}) => {
    return (
        <>
            <p>
                <span className="text-muted">
                    Enter your email address to get started
                </span>
                <input
                    type="email"
                    className="self-stretch h-12 px-4 py-3 bg-neutral-800 rounded-lg justify-start items-center inline-flex grow shrink basis-0 text-zinc-100 text-base font-normal font-['Open Sans'] leading-tight tracking-tight"
                    onChange={handleEmailChange}
                />
            </p>

            <Button
                className="justify-center items-center gap-1 inline-flex text-gray-400 text-base font-bold px-4 py-3 bg-zinc-800 rounded-lg leading-normal tracking-tight"
                onClick={onEmailSubmit}
            >
                Continue
            </Button>

            <div className="opacity-60 text-center text-zinc-100 text-xs font-normal font-['Open Sans'] leading-none tracking-wide">
                Or continue with
            </div>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => onSSOCallback(ESignInUpMethod.Google)}
            >
                Google
            </button>
        </>
    );
};

interface ISignInUpProps {
    isSignIn: boolean;
    status: ESignInUpState;
    onSignInUp: (email: string, otp: string) => void;
    onSSOCallback: (provider: ESignInUpMethod) => void;
}

const SignInUpModule: FC<ISignInUpProps> = memo(function SignInUpModule({
    status,
    isSignIn,
    onSignInUp,
    onSSOCallback,
}: ISignInUpProps) {
    const emailRef = useRef<string>();
    const [email, setEmail] = useState("");

    const handleOtpSubmit = useCallback(
        (otp: string) => {
            onSignInUp(email, otp);
        },
        [onSignInUp, email]
    );

    const handleEmailChange = debounce(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            emailRef.current = e.target.value;
        }
    );

    const onEmailSubmit = useCallback(() => {
        if (!emailRef.current) return;
        setEmail(emailRef.current);
    }, []);

    return (
        <>
            <h2>{isSignIn ? "Sign in to" : "Sign up for"} Alphaday</h2>

            {status === ESignInUpState.Verifying ? (
                <div>
                    <OtpModule onOtpSubmit={handleOtpSubmit} />
                </div>
            ) : (
                <div>
                    <EmailInput
                        onEmailSubmit={onEmailSubmit}
                        onSSOCallback={onSSOCallback}
                        handleEmailChange={handleEmailChange}
                    />
                </div>
            )}
        </>
    );
});

export default SignInUpModule;
