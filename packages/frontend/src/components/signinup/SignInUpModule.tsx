import { FC, memo, useCallback, useRef, useState } from "react";
import { Button } from "@alphaday/ui-kit";
import { ESignInUpMethod, ESignInUpState } from "src/api/types";
import { debounce } from "src/api/utils/helpers";
import OtpModule from "./OtpModule";

interface IEmailInputProps {
    isValidEmail: boolean;
    onEmailSubmit: () => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput: FC<IEmailInputProps> = ({
    isValidEmail,
    onEmailSubmit,
    handleEmailChange,
}) => {
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
                onClick={onEmailSubmit}
            >
                Continue
            </Button>
        </div>
    );
};

interface ISignInUpProps {
    isSignIn: boolean;
    status: ESignInUpState;
    handleSignInUp: (email: string, otp: string) => void;
    handleSSOCallback: (provider: ESignInUpMethod) => void;
}

const SignInUpModule: FC<ISignInUpProps> = memo(function SignInUpModule({
    status,
    isSignIn,
    handleSignInUp,
    handleSSOCallback,
}: ISignInUpProps) {
    const emailRef = useRef<string>();
    const [email, setEmail] = useState("");

    const handleOtpSubmit = useCallback(
        (otp: string) => {
            handleSignInUp(email, otp);
        },
        [handleSignInUp, email]
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
        <div className="w-full">
            <h2 className="text-primary text-2xl font-semibold leading-loose text-center">
                {isSignIn ? "Sign in to" : "Sign up for"} Alphaday
            </h2>

            {status === ESignInUpState.Verifying ? (
                <div>
                    <OtpModule onOtpSubmit={handleOtpSubmit} />
                </div>
            ) : (
                <div>
                    <EmailInput
                        isValidEmail={!!emailRef?.current?.match(/@/g)?.length}
                        onEmailSubmit={onEmailSubmit}
                        handleEmailChange={handleEmailChange}
                    />

                    <div className="opacity-60 text-primary text-xs tracking-wide">
                        Or continue with
                    </div>
                    <div className="w-full flex gap-2.5 py-2 justify-evenly">
                        <button
                            type="button"
                            className="px-4 py-3 bg-primary rounded-lg flex-col justify-center items-center gap-2 inline-flex text-primaryVariant100 text-base font-bold flex-grow"
                            onClick={() =>
                                handleSSOCallback(ESignInUpMethod.Google)
                            }
                        >
                            Google
                        </button>
                        <button
                            type="button"
                            className="px-4 py-3 bg-primary rounded-lg flex-col justify-center items-center gap-2 inline-flex text-primaryVariant100 text-base font-bold flex-grow"
                            onClick={() =>
                                handleSSOCallback(ESignInUpMethod.Apple)
                            }
                        >
                            Apple
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default SignInUpModule;
