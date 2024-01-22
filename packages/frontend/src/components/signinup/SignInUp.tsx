import { FC, useMemo } from "react";
import { EmailInput } from "@alphaday/ui-kit/src/mobile-components/auth/EmailInput";
import { ESignInUpMethod, ESignInUpState, TUserAccess } from "src/api/types";
import { validateEmail } from "src/api/utils/accountUtils";
import { ReactComponent as AppleIcon } from "src/assets/icons/socials/apple_icon.svg";
import { ReactComponent as GoogleIcon } from "src/assets/icons/socials/google_icon.svg";
import OtpInput from "./OtpInput";

export interface SignInUpProps {
    email: string;
    authState: TUserAccess;
    handleOtpSubmit: (otp: string) => void;
    handleSSOCallback: (provider: ESignInUpMethod) => void;
    handleEmailSubmit: () => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SignInUp: FC<SignInUpProps> = ({
    email,
    authState,
    handleOtpSubmit,
    handleSSOCallback,
    handleEmailSubmit,
    handleEmailChange,
}) => {
    const isValidEmail = useMemo(() => validateEmail(email), [email]);
    return authState.status === ESignInUpState.VerifyingEmail ? (
        <div className="flex flex-col justify-center w-full h-full p-5">
            <p className="text-primary text-sm">
                Enter the 6 digit verification code we sent to
                <span className="font-bold"> {email}</span>
            </p>
            <div className="flex justify-between gap-2.5 py-4">
                <OtpInput handleOtpSubmit={handleOtpSubmit} />
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
        <div className="w-full p-5">
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
