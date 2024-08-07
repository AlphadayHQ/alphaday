import { FC, useMemo } from "react";
import { Spinner } from "@alphaday/ui-kit";
import { EmailInput } from "@alphaday/ui-kit/src/mobile-components/auth/EmailInput";
import { EAuthMethod, EAuthState, TUserAccess } from "src/api/types";
import { validateEmail } from "src/api/utils/accountUtils";
import { ReactComponent as AppleIcon } from "src/assets/icons/socials/apple_icon.svg";
import { ReactComponent as GoogleIcon } from "src/assets/icons/socials/google_icon.svg";
import { OTPInput } from "./OtpInput";

export interface AuthProps {
    email: string;
    authState: TUserAccess;
    handleOtpSubmit: (otp: string) => void;
    handleSSOCallback: (provider: EAuthMethod) => void;
    handleEmailSubmit: () => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isVerifyingOTP?: boolean;
}

const OTP_INPUT_LENGTH = 6;

export const Auth: FC<AuthProps> = ({
    email,
    authState,
    handleOtpSubmit,
    handleSSOCallback,
    handleEmailSubmit,
    handleEmailChange,
    isVerifyingOTP,
}) => {
    const isValidEmail = useMemo(() => validateEmail(email), [email]);
    return authState.status === EAuthState.VerifyingEmail ? (
        <div className="flex flex-col justify-start p-5">
            <p className="text-primary mb-0 whitespace-normal">
                Enter the 6 digit verification code we sent to{" "}
            </p>
            <p className="fontGroup-highlight !font-bold text-primary">
                {email}
            </p>

            <div className="max-w-screen-single-col flex justify-between gap-2.5 py-4">
                {isVerifyingOTP ? (
                    <div className="w-full flex justify-center mt-2 mb-4">
                        <Spinner />
                    </div>
                ) : (
                    <OTPInput
                        length={OTP_INPUT_LENGTH}
                        autoFocus
                        onChangeOTP={handleOtpSubmit}
                    />
                )}
            </div>
            <div className="text-primary text-sm">
                <div>Didn&apos;t get a verification code?</div>
                <button
                    type="button"
                    className="text-primary text-sm font-bold underline underline-offset-4 hover:text-accentVariant200 active:hover:text-accentVariant100"
                    onClick={handleEmailSubmit}
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
