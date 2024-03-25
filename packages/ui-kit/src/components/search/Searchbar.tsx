import { useState, useEffect, useCallback, FC } from "react";
import Select, {
    components,
    GroupBase,
    StylesConfig,
    ClassNamesConfig,
    ActionMeta,
    InputActionMeta,
    InputProps,
    NoticeProps,
    SelectComponentsConfig,
    MenuListProps,
    OptionProps,
    PlaceholderProps,
    ValueContainerProps,
    OptionsOrGroups,
} from "react-select";
// TODO (xavier-charles): add slugify util
// import { slugify } from "src/api/utils/textUtils";
import { ReactComponent as CheckMarkSVG } from "src/assets/svg/checkmark.svg";
import { twMerge } from "tailwind-merge";
import { ReactComponent as HotSVG } from "../../assets/svg/hot.svg";
import { Spinner } from "../spinner/Spinner";
/**
 * for simplicity, all components types here are defined with IsMulti = true
 * Supporting an arbitrary value for IsMulti would require some additional refactoring
 */

interface IProps {
    disabled?: boolean;
    $uppercase?: boolean;
}

const { Input, NoOptionsMessage, MenuList, Option } = components;

const CustomInput = <Option,>(props: InputProps<Option>) => {
    const { isDisabled, value, hasValue } = props;
    return !isDisabled ? (
        <>
            <Input data-testid="searchbar-input" {...props} />
            {!value && hasValue && (
                <div className="text-primaryVariant100 w-full">Search...</div>
            )}
        </>
    ) : null;
};

const CustomPlaceholder = <Option,>(props: PlaceholderProps<Option>) => {
    const { isDisabled, children } = props;
    return !isDisabled ? (
        <div className="text-primaryVariant100 w-full">{children}</div>
    ) : null;
};

const CustomValueContainer = <Option,>(props: ValueContainerProps<Option>) => {
    const { isDisabled, children, hasValue } = props;
    return !isDisabled ? (
        <div
            className={`flex ${
                hasValue ? "" : "flex-row-reverse "
            }items-center`}
        >
            {children}
        </div>
    ) : null;
};

const CustomMenuList = (showTrending: boolean) => {
    return function Menu<Option>(props: MenuListProps<Option>) {
        return (
            <>
                {showTrending && (
                    <div className="text-primaryVariant100 fontGroup-mini flex w-full items-center mx-2 px-3 pt-3">
                        <span className="uppercase">Trending Keywords</span>
                        <HotSVG className="text-primaryVariant100 mb-0 ml-[3px] mr-0 mt-px h-3 w-2.5 pb-0.5" />
                    </div>
                )}
                <div data-testid="searchbar-menu" className="z-[1000]">
                    <MenuList {...props} />
                </div>
            </>
        );
    };
};

const CustomOption =
    <T,>(isOptionSelected: ((option: T) => boolean) | undefined) =>
    <Option,>({
        isSelected,
        ...props
    }: OptionProps<Option, true, GroupBase<Option>>) => {
        // @ts-ignore T and Option are the same
        const optionSelected = isOptionSelected?.(props.data);

        return (
            <div
            // data-testid={`searchbar-option-${slugify(props.label)}`}
            >
                <Option
                    isSelected={isSelected}
                    {...props}
                    className="flex justify-between items-center"
                >
                    <span>{props.label}</span>
                    {optionSelected && (
                        <CheckMarkSVG className="w-3 h-3 ml-1" />
                    )}
                </Option>
            </div>
        );
    };

const CustomNoOptionsMessage = (isFetching: boolean | undefined) => {
    return function Message<Option = unknown>(
        props: NoticeProps<Option, true, GroupBase<Option>>
    ) {
        return (
            <NoOptionsMessage {...props}>
                <div className="text-primary flex w-full max-w-[524px] items-center justify-center overscroll-contain font-bold text-[12px]">
                    {isFetching === true ? (
                        <div className="flex h-[70px] w-full items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        "No results"
                    )}
                </div>
            </NoOptionsMessage>
        );
    };
};

const Feedback: FC<{ message: string | null | undefined }> = ({ message }) => {
    return (
        <div
            className={twMerge(
                "absolute !font-medium w-full fontGroup-mini text-background rounded-t-lg bg-secondaryOrange px-5 pb-3 pt-[3px] ease-in duration-200",
                message && message !== ""
                    ? "opacity-100 -translate-y-5"
                    : "opacity-0"
            )}
        >
            {message}
        </div>
    );
};

export interface ISearchProps<Option = unknown> {
    options?: OptionsOrGroups<Option, GroupBase<Option>>;
    trendingOptions?: Option[] | undefined;
    disabled?: boolean;
    placeholder: string;
    initialInputValue?: string;
    initialSearchValues: Option[];
    closeMenuOnSelect?: boolean;
    updateSearch?: boolean;
    isFetchingKeywordResults?: boolean;
    isFetchingTrendingKeywordResults?: boolean;
    showBackdrop?: boolean;
    isOptionSelected?: (option: Option) => boolean;
    message?: string | null;
    customComponents?:
        | Partial<SelectComponentsConfig<Option, true, GroupBase<Option>>>
        | undefined;
    onChange: (
        o: Readonly<Option[]>,
        actionType: ActionMeta<Option>
    ) => void | ((o: Option[]) => Promise<void>);
    onInputChange?: (e: string) => void;

    componentClassNames?: Partial<
        ClassNamesConfig<Option, true, GroupBase<Option>>
    >;
}

export const SearchBar = <T,>({
    disabled,
    onChange,
    onInputChange,
    options,
    trendingOptions,
    placeholder,
    initialSearchValues,
    closeMenuOnSelect = false,
    updateSearch = true,
    componentClassNames,
    customComponents,
    initialInputValue,
    isFetchingKeywordResults,
    isFetchingTrendingKeywordResults,
    showBackdrop,
    isOptionSelected,
    message,
}: ISearchProps<T>): ReturnType<React.FC<ISearchProps>> => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchValues, setSearchValues] = useState<T[]>(initialSearchValues);
    const [inputValue, setInputValue] = useState("");

    // Close search dropdown if esc key pressed
    const [escKeyPressed, setEscKeyPressed] = useState(false);

    // reset state if initial search values changed
    useEffect(() => {
        setSearchValues(initialSearchValues);
    }, [initialSearchValues]);

    const handleSearchValues = (
        e: Readonly<T[]>,
        actionType: ActionMeta<T>
    ) => {
        onChange(e, actionType);
        if (updateSearch) setSearchValues([...e]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            setEscKeyPressed(true);
        }
    };

    const handleInputChange = useCallback(
        (value: string, meta: InputActionMeta) => {
            if (["input-blur", "menu-close"].indexOf(meta.action) === -1) {
                setInputValue(value);
                if (onInputChange) onInputChange(value);
                return value;
            }
            return inputValue;
        },
        [inputValue, onInputChange]
    );

    const selectStyles: StylesConfig<T, true, GroupBase<T>> & IProps = {
        control: () => ({}),
        placeholder: () => ({}),
        multiValue: () => ({}),
        valueContainer: () => ({}),
        input: () => ({}),
        indicatorSeparator: () => ({}),
        indicatorsContainer: () => ({}),
        menu: () => ({}),
        menuList: () => ({}),
        option: () => ({}),
    };

    const selectClasses: ClassNamesConfig<T, true, GroupBase<T>> & IProps = {
        ...componentClassNames,
        container: (props) =>
            `overflow-hidden ${componentClassNames?.container?.(props)}`,
        control: (props) =>
            `overflow-x-scroll flex justify-between items-center cursor-text bg-backgroundVariant200 hover:bg-backgroundVariant100 border-0 focus-within:border focus-within:bg-backgroundVariant100 border-borderLine shadow-none rounded-[10px] h-[41px] min-h-[41px] pl-1 ${componentClassNames?.control?.(
                props
            )}`,
        placeholder: (props) =>
            `ml-15 font-open-sans font-normal text-sm leading-4 tracking-[0.2] text-primaryVariant100 ${componentClassNames?.placeholder?.(
                props
            )}`,
        multiValue: (props) =>
            `bg-backgroundBlue rounded-[8px] m-[0_0_0_5px] leading-4 p-[6px] flex items-center cursor-pointer [&>div]:text-[12px] [&>div]:text-primary [&>div]:p-0 [&>div:first-child]:m-[0_0_0_5px] [&>div:hover]:bg-transparent [&>div:hover]:text-primary ${componentClassNames?.multiValue?.(
                props
            )}`,
        multiValueRemove: (props) =>
            `[&>svg]:h-[10px] ${componentClassNames?.multiValueRemove?.(
                props
            )}`,
        valueContainer: (props) =>
            `p-0 h-[41px] flex-nowrap overflow-x-scroll ms-overflow-style-none scrollbar-width-none [&>div]:min-w-[max-content] [&::-webkit-scrollbar]:hidden ${componentClassNames?.valueContainer?.(
                props
            )}`,
        input: (props) =>
            `m-0 ml-[10px] p-0 text-primary border-0 ${
                props.value ? "w-full" : "w-2"
            } ${componentClassNames?.input?.(props)}`,
        indicatorSeparator: (props) =>
            `hidden ${componentClassNames?.indicatorSeparator?.(props)}`,
        indicatorsContainer: (props) =>
            `cursor-pointer ${componentClassNames?.indicatorsContainer?.(
                props
            )}`,
        clearIndicator: (props) =>
            `cursor-pointer [&>svg]:text-primaryVariant100 ${componentClassNames?.clearIndicator?.(
                props
            )}`,
        menu: (props) =>
            `bg-background mt-2 rounded-md font-weight-bold text-sm leading-4 border-borderLine border-solid border overflow-hidden ${componentClassNames?.menu?.(
                props
            )}`,
        menuList: (props) =>
            `px-0 py-2 overflow-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar-track]:bg-background [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb:hover]:bg-primaryFiltered ${componentClassNames?.menuList?.(
                props
            )}`,
        option: (props) =>
            `text-primary bg-transparent mx-2 px-3 py-2 rounded hover:bg-backgroundVariant200 active:bg-transparent cursor-pointer capitalize fontGroup-normal ${componentClassNames?.option?.(
                props
            )}`,
    };

    if (escKeyPressed === true) {
        setEscKeyPressed(false);
    }

    const showTrending = inputValue === "" && trendingOptions !== undefined;

    const isFetching =
        inputValue === ""
            ? isFetchingTrendingKeywordResults
            : isFetchingKeywordResults;

    return (
        <div className="text-primary h-[41px] w-full max-w-[524px]">
            {isFocused && showBackdrop && (
                <div className="bg-black w-full h-full top-0 left-0 fixed opacity-40" />
            )}
            <Feedback message={message} />
            <Select
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
                onChange={(e, changeType) => handleSearchValues(e, changeType)}
                onInputChange={handleInputChange}
                isClearable
                isMulti
                options={showTrending ? trendingOptions : options}
                value={searchValues}
                closeMenuOnSelect={closeMenuOnSelect}
                components={{
                    DropdownIndicator: null,
                    NoOptionsMessage: CustomNoOptionsMessage(isFetching),
                    MenuList: CustomMenuList(showTrending),
                    Option: CustomOption<T>(isOptionSelected),
                    Input: CustomInput,
                    Placeholder: CustomPlaceholder,
                    ValueContainer: CustomValueContainer,
                    ...customComponents,
                }}
                styles={selectStyles}
                classNames={selectClasses}
                placeholder={placeholder}
                isDisabled={disabled}
                menuIsOpen={escKeyPressed === true ? false : undefined}
                onKeyDown={(e) => {
                    handleKeyDown(e);
                }}
                inputValue={initialInputValue}
            />
        </div>
    );
};
