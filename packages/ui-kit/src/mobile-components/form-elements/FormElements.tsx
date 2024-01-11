import { ChangeEventHandler, FC, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IFormInput {
    label: string;
    placeholder: string;
    defaultValue: string;
    isOptional: boolean;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
    classNames?: string;
    errorMsg?: string;
    type: "text" | "email" | "password";
}

export const FormInput: FC<IFormInput> = ({
    label,
    placeholder,
    defaultValue,
    classNames,
    value,
    onChange,
    disabled,
    isOptional,
    type = "text",
    errorMsg,
}) => {
    const [hasBlurred, sethasBluurred] = useState(false);
    return (
        <div>
            <div
                className={twMerge(
                    "flex",
                    isOptional ? "justify-between" : "justify-start"
                )}
            >
                <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-primary"
                >
                    {label}
                </label>
                {isOptional && (
                    <span
                        className="text-sm leading-6 text-gray-400"
                        id="email-optional"
                    >
                        Optional
                    </span>
                )}
            </div>
            <div className="relative mt-1 rounded-md shadow-sm">
                <input
                    type={type}
                    name={label}
                    id="email"
                    value={value}
                    onChange={onChange}
                    onBlur={() => sethasBluurred(true)}
                    className={twMerge(
                        "block w-full bg-backgroundVariant100 rounded-md border-0 py-1.5 pr-10 ring-1 ring-inset disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200  focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6",
                        classNames,
                        errorMsg &&
                            hasBlurred &&
                            "ring-red-400 text-red-900 placeholder-red-300 focus:ring-red-500"
                    )}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    aria-invalid="true"
                    aria-describedby="email-error"
                    disabled={disabled}
                />
                {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                    />
                </div> */}
            </div>
            {errorMsg && hasBlurred && (
                <p className="mt-1 text-sm text-red-600" id="email-error">
                    {errorMsg}
                </p>
            )}
        </div>
    );
};
