import { ChangeEventHandler, FC, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IFormElement<T> {
    label: string;
    placeholder: string;
    defaultValue: string;
    value: string;
    onChange: ChangeEventHandler<T>;
    disabled?: boolean;
    classNames?: string;
}
interface IFormInput extends IFormElement<HTMLInputElement> {
    isOptional?: boolean;
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
                    value={value}
                    onChange={onChange}
                    onBlur={() => sethasBluurred(true)}
                    className={twMerge(
                        "block w-full bg-backgroundVariant100 rounded-md border-0 py-1.5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 placeholder:text-gray-400",
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
            </div>
            {errorMsg && hasBlurred && (
                <p className="mt-1 text-sm text-red-600" id="email-error">
                    {errorMsg}
                </p>
            )}
        </div>
    );
};

export const FormTextArea: FC<IFormElement<HTMLTextAreaElement>> = ({
    label,
    placeholder,
    defaultValue,
    classNames,
    value,
    onChange,
    disabled,
}) => {
    return (
        <div>
            <label
                htmlFor="email"
                className="text-sm font-medium leading-6 text-primary flex"
            >
                {label}
            </label>
            <div className="mt-1">
                <textarea
                    rows={4}
                    name={label}
                    id="comment"
                    className={twMerge(
                        "block w-full bg-backgroundVariant100 rounded-md border-0 py-1.5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-50 disabled:ring-gray-200 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                        classNames
                    )}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};
