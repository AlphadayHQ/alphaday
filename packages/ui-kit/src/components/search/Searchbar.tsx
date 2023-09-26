import { useState, useEffect, useCallback } from "react";
import Select, {
    components,
    GroupBase,
    StylesConfig,
    ClassNamesConfig,
    ActionMeta,
    InputActionMeta,
    InputProps,
    NoticeProps,
    CSSObjectWithLabel,
    SelectComponentsConfig,
    MenuListProps,
    OptionProps,
    PlaceholderProps,
    ValueContainerProps,
} from "react-select";
// TODO (xavier-charles): add slugify util
// import { slugify } from "src/api/utils/textUtils";
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
                <div className="text-primaryVariant100 fontGroup-normal w-full">
                    Search...
                </div>
            )}
        </>
    ) : null;
};

const CustomPlaceholder = <Option,>(props: PlaceholderProps<Option>) => {
    const { isDisabled, children } = props;
    return !isDisabled ? (
        <div className="text-primaryVariant100 fontGroup-normal w-full">
            {children}
        </div>
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
                    <div className="border-b-btnRingVariant300 text-primaryVariant100 fontGroup-mini flex w-full items-center border-b border-solid px-3 pb-2.5 pt-3">
                        Trending Keywords
                        <HotSVG className="text-primaryVariant100 mb-0 ml-0.5 mr-0 mt-px h-3 w-2.5 pb-0.5" />
                    </div>
                )}
                <div data-testid="searchbar-menu">
                    <MenuList {...props} />
                </div>
            </>
        );
    };
};

const CustomOption = <Option,>(
    props: OptionProps<Option, true, GroupBase<Option>>
) => {
    return (
        <div
        // data-testid={`searchbar-option-${slugify(props.label)}`}
        >
            <Option {...props} />
        </div>
    );
};

const CustomNoOptionsMessage = (isFetching: boolean | undefined) => {
    return function Message<Option = unknown>(
        props: NoticeProps<Option, true, GroupBase<Option>>
    ) {
        return (
            <NoOptionsMessage {...props}>
                <div className="fontGroup-normal text-primary flex w-full max-w-[524px] items-center justify-center overscroll-contain font-[bold]">
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

export interface ISearchProps<Option = unknown> {
    options?: Option[];
    trendingOptions?: Option[] | undefined;
    disabled?: boolean;
    // TODO (xavier-charles): handle/remove prop if not needed
    // uppercase?: boolean;
    // label?: string;
    placeholder: string;
    initialInputValue?: string;
    initialSearchValues: Option[];
    closeMenuOnSelect?: boolean;
    updateSearch?: boolean;
    isFetchingKeywordResults?: boolean;
    isFetchingTrendingKeywordResults?: boolean;
    customComponents?:
        | Partial<SelectComponentsConfig<Option, true, GroupBase<Option>>>
        | undefined;
    onChange: (
        o: Readonly<Option[]>,
        actionType: ActionMeta<Option>
    ) => void | ((o: Option[]) => Promise<void>);
    onInputChange?: (e: string) => void;

    customStyles?: () => Partial<
        Record<
            keyof StylesConfig<Option, true, GroupBase<Option>>,
            CSSObjectWithLabel
        >
    > &
        IProps;
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
    customStyles,
    customComponents,
    initialInputValue,
    isFetchingKeywordResults,
    isFetchingTrendingKeywordResults,
}: ISearchProps<T>): ReturnType<React.FC<ISearchProps>> => {
    const themedStyles = customStyles?.();

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
        control: () => ({
            ...themedStyles?.control,
        }),
        placeholder: () => ({
            ...themedStyles?.placeholder,
        }),
        multiValue: () => ({
            ...themedStyles?.multiValue,
        }),
        valueContainer: () => ({
            ...themedStyles?.valueContainer,
        }),
        input: () => ({
            ...themedStyles?.input,
        }),
        indicatorSeparator: () => ({
            ...themedStyles?.indicatorSeparator,
        }),
        indicatorsContainer: () => ({
            ...themedStyles?.indicatorsContainer,
        }),
        menu: () => ({
            ...themedStyles?.menu,
        }),
        menuList: () => ({
            ...themedStyles?.menuList,
        }),
        option: () => ({
            ...themedStyles?.option,
        }),
    };

    const selectClasses: ClassNamesConfig<T, true, GroupBase<T>> & IProps = {
        control: () =>
            "flex justify-between items-center cursor-text bg-backgroundVariant400 hover:bg-backgroundVariant200 border-0 shadow-none rounded-10 h-[41px] min-h-[41px] rounded-lg",
        placeholder: () =>
            "ml-15 font-open-sans font-normal text-sm leading-4 tracking-[0.2] text-primaryVariant100",
        multiValue: () =>
            "bg-btnBackgroundVariant1400 rounded-md m-0 ml-[6px] leading-4 p-[4px] px-[6px] flex items-center fontGroup-normal cursor-pointer [&>div]:text-[12px] [&>div]:text-primary [&>div]:p-0 [&>div]:m-0 [&>div:hover]:bg-transparent [&>div:hover]:text-primary",
        multiValueRemove: () => "[&>svg]:h-[10px]",
        valueContainer: () =>
            "p-0 h-[41px] flex-nowrap overflow-x-scroll ms-overflow-style-none scrollbar-width-none [&>div]:min-w-[max-content] [&::-webkit-scrollbar]:hidden",
        input: () =>
            "m-0 ml-[10px] p-0 text-primary border-0 fontGroup-normal w-2",
        indicatorSeparator: () => "hidden",
        indicatorsContainer: () => "cursor-pointer",
        clearIndicator: () => "cursor-pointer text-primaryVariant100",
        menu: () =>
            "bg-backgroundVariant200 mt-2 rounded-md font-weight-bold text-sm leading-4 shadow-[0_0_35px_14px_rgba(19,21,27,0.8)] overflow-hidden",
        menuList: () =>
            "p-0 pb-[5px] overflow-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar-track]:bg-[#1e2025] [&::-webkit-scrollbar-thumb]:bg-[#c1c5d6] [&::-webkit-scrollbar-thumb:hover]:bg-[#555555]",
        option: () =>
            "text-primary bg-transparent px-3 py-2 hover:bg-backgroundVariant600 active:bg-transparent cursor-pointer text-capitalize fontGroup-highlight",
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
            <Select
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
                    Option: CustomOption,
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
