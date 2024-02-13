import { useCallback, useState } from "react";
import { useKeyPress } from "src/api/hooks";

interface OtpInputProps {
    handleOtpSubmit: (otp: string) => void;
}

const OTP_LENGTH = 6;

const OtpInput: React.FC<OtpInputProps> = ({
    handleOtpSubmit: onOtpSubmit,
}) => {
    const [otp, setOtp] = useState<string[]>([]);

    const handleSubmit = useCallback(() => {
        if (otp.length !== OTP_LENGTH) return;
        onOtpSubmit(otp.join(""));
    }, [onOtpSubmit, otp]);

    const handleOtpChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            if (value.length > 1) {
                otp.push(...value.split("").splice(0, 6 - otp.length));
                document.getElementById(`otp-${otp.length - 1}`)?.focus();
                return;
            }
            if (value) {
                otp.push(value);
                if (otp.length === OTP_LENGTH) {
                    handleSubmit();
                    return;
                }
                document.getElementById(`otp-${otp.length}`)?.focus();
                setOtp([...otp]);
            } else {
                document.getElementById(`otp-${otp.length - 1}`)?.focus();
            }
        },
        [otp, handleSubmit]
    );

    useKeyPress({
        targetKey: "Enter",
        callback: handleSubmit,
    });

    // handle backspace
    useKeyPress({
        targetKey: "Backspace",
        callback: () => {
            if (otp.length === 0) return;
            otp.pop();
            setOtp([...otp]);
        },
    });

    return Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            id={`otp-${i}`}
            type="text"
            className="rounded text-black text-center w-10 h-10 border-2 border-primary font-semibold placeholder:bg-primaryVariant200 placeholder-shown:bg-primaryVariant200 placeholder-shown:border-primaryVariant200 focus:outline-none focus:border-primaryVariant200"
            onChange={handleOtpChange}
            placeholder=" "
        />
    ));
};

export default OtpInput;
