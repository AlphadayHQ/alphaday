import { ChangeEventHandler, FC, Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { ReactComponent as CheckmarkSVG } from "../../assets/svg/checkmark.svg";
import { ReactComponent as ChevronUpDownSVG } from "../../assets/svg/chevron-up-down.svg";

interface IFormElement<T> {
    label: string;
    placeholder?: string;
    defaultValue?: string;
    value: string | number;
    onChange: ChangeEventHandler<T>;
    disabled?: boolean;
    className?: string;
}
interface IFormInput extends IFormElement<HTMLInputElement> {
    errorMsg?: string;
    type: "text" | "email" | "password" | "number" | "date";
    name?: string;
    min?: number;
}

export const FormInput: FC<IFormInput> = ({
    label,
    placeholder,
    defaultValue,
    className,
    value,
    onChange,
    disabled,
    type = "text",
    errorMsg,
    name,
    min,
}) => {
    const [hasBlured, sethasBlured] = useState(false);
    return (
        <div className="w-full">
            <div className="flex justify-start">
                <label
                    htmlFor="email"
                    className="block text-sm fontGroup-normal text-primaryVariant100"
                >
                    {label}
                </label>
            </div>
            <div className="relative mt-1 rounded-md shadow-sm">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={() => sethasBlured(true)}
                    className={twMerge(
                        "block w-full bg-backgroundVariant100 rounded-md border-0 py-1.5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 placeholder:text-gray-400",
                        className,
                        errorMsg &&
                            hasBlured &&
                            "ring-red-400 placeholder-red-300 focus:ring-red-500"
                    )}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    aria-invalid="true"
                    aria-describedby="email-error"
                    disabled={disabled}
                    min={min}
                />
            </div>
            {errorMsg && hasBlured && (
                <p
                    className="mt-1 text-sm text-red-600 fontGroup-mini"
                    id="email-error"
                >
                    {errorMsg}
                </p>
            )}
        </div>
    );
};

interface FormTextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const FormTextArea: FC<FormTextAreaProps> = ({
    label,
    placeholder,
    defaultValue,
    className,
    value,
    onChange,
    disabled,
    rows = 4,
    ...props
}) => {
    return (
        <>
            <label
                htmlFor="email"
                className="text-sm font-medium leading-6 text-primary flex"
            >
                {label}
            </label>

            <textarea
                rows={rows}
                name={label}
                id="comment"
                className={twMerge(
                    "block w-full mt-1 bg-backgroundVariant100 rounded-md border-0 py-1.5 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-50 disabled:ring-gray-200 text-primary shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6",
                    className
                )}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                {...props}
            />
        </>
    );
};

type TOption = { id: string; value: string };
interface IFormSelect
    extends Omit<
        IFormElement<HTMLSelectElement>,
        "onChange" | "value" | "defaultValue"
    > {
    options: TOption[];
    selected: TOption | undefined;
    onChange: (option: TOption) => void;
    defaultValue?: TOption;
}

export const FormSelect: FC<IFormSelect> = ({
    label,
    options,
    placeholder,
    defaultValue,
    className,
    selected,
    onChange,
    disabled,
}) => {
    return (
        <Listbox
            value={selected}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
        >
            {({ open }) => (
                <div className={className}>
                    <Listbox.Label className="block text-sm font-medium leading-6 text-primary">
                        {label}
                    </Listbox.Label>
                    <div className="relative mt-1">
                        <Listbox.Button className="relative w-full bg-backgroundVariant100 text-primary cursor-default rounded-md py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200">
                            <span className="block truncate">
                                {selected?.value ||
                                    defaultValue?.value ||
                                    placeholder}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownSVG
                                    className="h-5 w-5 text-gray-300"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute bg-backgroundVariant100 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map((option) => (
                                    <Listbox.Option
                                        key={option.id}
                                        className={({ active }) =>
                                            twMerge(
                                                active ? "bg-indigo-600" : "",
                                                "relative text-primary cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                        }
                                        value={option}
                                    >
                                        {({
                                            selected: optionSelected,
                                            active,
                                        }) => (
                                            <>
                                                <span
                                                    className={twMerge(
                                                        optionSelected
                                                            ? "font-semibold"
                                                            : "font-normal",
                                                        "block truncate"
                                                    )}
                                                >
                                                    {option.value}
                                                </span>

                                                {optionSelected ? (
                                                    <span
                                                        className={twMerge(
                                                            active
                                                                ? "text-white"
                                                                : "text-indigo-600",
                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                        )}
                                                    >
                                                        <CheckmarkSVG
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </div>
            )}
        </Listbox>
    );
};

interface IFormCheckbox {
    checked: boolean;
    classNames?: string;
    label: string;
    subtext?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
}

export const FormCheckbox: FC<IFormCheckbox> = ({
    label,
    classNames,
    checked,
    onChange,
    disabled,
    subtext,
}) => {
    return (
        <div
            className={twMerge(
                "flex items-start group cursor-pointer",
                classNames
            )}
        >
            <div className="flex items-center h-5">
                <input
                    id="comments"
                    name="comments"
                    type="checkbox"
                    className="h-4 w-4 text-primary bg-background !ring-1 !ring-primaryVariant100 checked:!bg-backgroundVariant400 checked:!ring-accentVariant200 rounded disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="comments" className="font-medium text-primary">
                    {label}
                </label>
                <p className="text-primaryVariant100">{subtext}</p>
            </div>
        </div>
    );
};

export const FormRadio: FC<IFormCheckbox> = ({
    label,
    classNames,
    checked,
    onChange,
    disabled,
    subtext,
}: IFormCheckbox) => {
    return (
        <div className={twMerge("relative flex items-start", classNames)}>
            <div className="flex h-6 items-center">
                <input
                    id="radio"
                    aria-describedby="radio-description"
                    name="plan"
                    type="radio"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="h-4 w-4 border-gray-300 text-accentVariant100 focus:ring-accentVariant100"
                />
            </div>
            <div className="ml-3 text-sm leading-6">
                <label htmlFor="radio" className="font-medium text-primary">
                    {label}
                </label>
                <p id="radio-description" className="text-primaryVariant100">
                    {subtext}
                </p>
            </div>
        </div>
    );
};
