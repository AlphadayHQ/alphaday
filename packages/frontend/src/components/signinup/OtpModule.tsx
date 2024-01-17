import { useCallback, useState } from "react";

interface IOtpModuleProps {
    onOtpSubmit: (otp: string) => void;
}

const OtpModule: React.FC<IOtpModuleProps> = ({ onOtpSubmit }) => {
    const [otp, setOtp] = useState<string[]>([]);

    const handleSubmit = useCallback(() => {
        onOtpSubmit(otp.join(""));
    }, [onOtpSubmit, otp]);

    const handleOtpChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            otp.push(e.target.value);
            if (otp.length === 6) {
                handleSubmit();
                return;
            }
            setOtp([...otp]);
        },
        [otp, handleSubmit]
    );

    return Array.from({ length: 6 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <input key={i} type="text" onChange={handleOtpChange} />
    ));
};

export default OtpModule;
