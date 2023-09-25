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
import { darkColors } from "../../globalStyles/colors";
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
                <div className="text-primaryVariant100 fontGroup-normal">
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
                <div className="text-primary flex w-full max-w-[524px] items-center justify-center overscroll-contain font-[bold]">
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
    // eslint-disable-next-line react/no-unused-prop-types
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
    // customStyles,
    customComponents,
    initialInputValue,
    isFetchingKeywordResults,
    isFetchingTrendingKeywordResults,
}: ISearchProps<T>): ReturnType<React.FC<ISearchProps>> => {
    // const themedStyles = customStyles?.();

    // TODO (xavier-charles): use react-select classnames prop instead of this
    const { primary } = darkColors;

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

    const selectClasses: ClassNamesConfig<T, true, GroupBase<T>> & IProps = {
        control: () =>
            "cursor-text hover:bg-backgroundVariant200 bg-backgroundVariant400 border-0 box-shadow-none rounded-10 h-41 min-h-41",
        placeholder: () =>
            "ml-15 font-open-sans font-normal text-sm line-height-18 tracking-0.2 text-primaryVariant100",
        multiValue: () =>
            `bg-btnBackgroundVariant1400 rounded-8 m-0 ml-6 line-height-16 p-6 div { color: ${primary}; font-size: 12px; padding: 0px; margin: 0px 0px 0px 5px; cursor: pointer; } div:hover { background: transparent; } [&>div:nth-of-type(2)] { display: contents; margin: 0; cursor: pointer; svg { fill: ${primary}; margin: 1px 0px; width: 15px; height: 14px; padding: 3px 0px; } }`,
        valueContainer: () =>
            "p-0 h-41 flex-nowrap overflow-x-scroll ms-overflow-style-none scrollbar-width-none [&>div]:min-w-full [&::-webkit-scrollbar]:hidden",
        input: () => "m-0 ml-10 p-0 text-primary border-0",
        indicatorSeparator: () => "hidden",
        indicatorsContainer: () =>
            "cursor-pointer [&>svg]:text-primaryVariant100",
        menu: () =>
            "bg-backgroundVariant200 font-weight-bold text-sm line-height-17 shadow-[0-0-35-14-rgba(19-21-27-0.8)]",
        menuList: () =>
            "p-0 pb-5 [&::-webkit-scrollbar]:w-4 [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar-track]:bg-[#1e2025] &::-webkit-scrollbar-thumb { background: #c1c5d6; } &::-webkit-scrollbar-thumb:hover { background: #555555; }",
        option: () =>
            "text-primary bg-transparent hover:backgroundVariant600 active:bg-transparent cursor-pointer text-transform-capitalize",
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
                // styles={themedStyles}
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
