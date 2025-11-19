import { ChangeEvent, FC, FocusEvent, MouseEvent } from "react";
import { twMerge } from "tailwind-merge";
import Feedback from "../feedback/feedback";

interface IInputProps {
    className?: string;
    required?: boolean;
    type?: string;
    feedbackText?: string;
    readonly?: boolean;
    id: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    value?: string | number;
    showState?: boolean;
    showErrorOnly?: boolean;
    state?: "success" | "warning" | "error";
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onClick?: (e: MouseEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    width?: string;
    height?: string;
}

export const Input: FC<IInputProps> = ({
    disabled,
    state,
    feedbackText,
    id,
    name,
    onChange,
    onClick,
    onBlur,
    value,
    readonly,
    width,
    height,
    showState,
    showErrorOnly,
    className,
    required,
    ...restProps
}) => {
    return (
        <div className="mx-auto flex flex-col">
            <input
                disabled={disabled}
                id={id}
                name={name}
                onChange={onChange}
                onClick={onClick}
                onBlur={onBlur}
                value={value}
                readOnly={readonly}
                required={required}
                className={twMerge(
                    `${state === "error" && "border-danger"}`,
                    "bg-backgroundVariant200 text-primary flex flex-row  items-start rounded-lg p-3",
                    className
                )}
                style={{
                    width: width || "359px",
                    height: height || "40px",
                }}
                {...restProps}
            />
            {feedbackText && showState && (
                <Feedback
                    state={state}
                    showState={showState}
                    showErrorOnly={showErrorOnly}
                >
                    {feedbackText}
                </Feedback>
            )}
        </div>
    );
};
