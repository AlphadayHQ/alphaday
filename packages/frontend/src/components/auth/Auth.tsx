import { FC, useMemo } from "react";
import { EmailInput } from "@alphaday/ui-kit/src/mobile-components/auth/EmailInput";
import { EAuthMethod, EAuthState, TUserAccess } from "src/api/types";
import { validateEmail } from "src/api/utils/accountUtils";
import { ReactComponent as AppleIcon } from "src/assets/icons/socials/apple_icon.svg";
import { ReactComponent as GoogleIcon } from "src/assets/icons/socials/google_icon.svg";
import OtpInput from "./OtpInput";

export interface AuthProps {
    email: string;
    authState: TUserAccess;
    handleOtpSubmit: (otp: string) => void;
    handleSSOCallback: (provider: EAuthMethod) => void;
    handleEmailSubmit: () => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Auth: FC<AuthProps> = ({
    email,
    authState,
    handleOtpSubmit,
    handleSSOCallback,
    handleEmailSubmit,
    handleEmailChange,
}) => {
    const isValidEmail = useMemo(() => validateEmail(email), [email]);
    return authState.status === EAuthState.VerifyingEmail ? (
        <div className="flex h-full w-full flex-col justify-center p-5">
            <p className="text-primary text-sm">
                Enter the 6 digit verification code we sent to
                <span className="font-bold"> {email}</span>
            </p>
            <div className="max-w-screen-single-col flex justify-between gap-2.5 py-4">
                <OtpInput handleOtpSubmit={handleOtpSubmit} />
            </div>
            <div className="text-primary text-sm">
                <div>Didn&apos;t get a verification code?</div>
                <button
                    type="button"
                    className="text-primary text-sm font-bold underline underline-offset-4"
                >
                    Resend now
                </button>
            </div>
        </div>
    ) : (
        <div className="w-full p-5">
            <EmailInput
                isValidEmail={isValidEmail}
                handleEmailSubmit={handleEmailSubmit}
                handleEmailChange={handleEmailChange}
            />

            <div className="text-primary text-xs tracking-wide opacity-60">
                Or continue with
            </div>
            <div className="flex w-full justify-evenly gap-2.5 py-2">
                <button
                    type="button"
                    className="bg-primary text-primaryVariant100 inline-flex flex-grow items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-bold hover:text-black"
                    onClick={() => handleSSOCallback(EAuthMethod.Google)}
                >
                    <GoogleIcon /> Google
                </button>
                <button
                    type="button"
                    className="bg-primary text-primaryVariant100 inline-flex flex-grow items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-bold hover:text-black"
                    onClick={() => handleSSOCallback(EAuthMethod.Apple)}
                >
                    <AppleIcon className="text-black" /> Apple
                </button>
            </div>
        </div>
    );
};
