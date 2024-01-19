import { FC } from "react";
import { Button } from "src/components/buttons/Button";

interface IEmailInputProps {
    isValidEmail: boolean;
    handleEmailSubmit: () => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmailInput: FC<IEmailInputProps> = ({
    isValidEmail,
    handleEmailSubmit,
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
                onClick={handleEmailSubmit}
            >
                Continue
            </Button>
        </div>
    );
};
