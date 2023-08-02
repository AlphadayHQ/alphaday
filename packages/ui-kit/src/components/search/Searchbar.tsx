import { useState, useEffect, useCallback } from "react";
import Select, {
    components,
    GroupBase,
    StylesConfig,
    ActionMeta,
    InputActionMeta,
    InputProps,
    NoticeProps,
    CSSObjectWithLabel,
    SelectComponentsConfig,
    MenuListProps,
    OptionProps,
    ClassNamesConfig,
} from "react-select";
// TODO (xavier-charles): add slugify util
// import { slugify } from "src/api/utils/textUtils";
import { ReactComponent as HotSVG } from "../../assets/svg/hot.svg";
import { darkColors } from "src/globalStyles/colors";
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
    const { isDisabled, value } = props;
    return !isDisabled ? (
        <>
            <Input data-testid="searchbar-input" {...props} />
            {!value && (
                <div className="text-primaryVariant100 fontGroup-normal w-full pt-[0.5px]">
                    Search...
                </div>
            )}
        </>
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

    // TODO use react-select classnames prop instead of this/
    const {
        backgroundVariant200,
        backgroundVariant400,
        primaryVariant100,
        backgroundVariant600,
        btnBackgroundVariant1400,
        primary,
    } = darkColors;

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
        container: (styles) => ({
            ...styles,
            ...themedStyles?.container,
        }),
        control: (styles, { isFocused }) => ({
            ...styles,
            cursor: "text",
            "&:hover": {
                backgroundColor: backgroundVariant200,
            },
            backgroundColor: isFocused
                ? backgroundVariant200
                : backgroundVariant400,
            border: 0,
            boxShadow: "none",
            borderRadius: "10px",
            height: "41px",
            minHeight: "41px",
            ...themedStyles?.control,
        }),
        placeholder: (styles) => {
            return {
                ...styles,
                marginLeft: "15px",
                fontFamily: "Open Sans",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "18px",
                letterSpacing: "0.2px",
                color: primaryVariant100,
                ...themedStyles?.placeholder,
            };
        },
        multiValue: (styles) => {
            return {
                ...styles,
                backgroundColor: btnBackgroundVariant1400,
                borderRadius: "8px",
                margin: "0",
                marginLeft: "6px",
                lineHeight: "16px",
                padding: "6px",
                "& div": {
                    color: primary,
                    fontSize: "12px",
                    padding: "0px",
                    margin: "0px 0px 0px 5px",
                    cursor: "pointer",
                },
                "& div:hover": { background: "transparent" },
                "& div:nth-of-type(2)": {
                    display: "contents",
                    margin: 0,
                    cursor: "pointer",
                    svg: {
                        fill: primary,
                        margin: "1px 0px",
                        width: "15px",
                        height: "14px",
                        padding: "3px 0px",
                    },
                },
                ...themedStyles?.multiValue,
            };
        },
        valueContainer: (styles) => {
            return {
                ...styles,
                padding: "0px 4px",
                height: "41px",
                flexWrap: "nowrap",
                overflowX: "scroll",
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                div: {
                    minWidth: "max-content",
                },
                ...themedStyles?.valueContainer,
            };
        },
        input: (styles) => {
            return {
                ...styles,
                margin: "0px 0px 0px 10px",
                padding: "0px",
                color: primary,
                border: 0,
                ...themedStyles?.input,
            };
        },
        indicatorSeparator: (styles) => {
            return {
                ...styles,
                display: "none",
            };
        },
        indicatorsContainer: (styles) => {
            return {
                ...styles,
                cursor: "pointer",
                svg: {
                    color: primaryVariant100,
                },
            };
        },

        menu: (styles) => {
            return {
                ...styles,
                background: backgroundVariant200,
                fontWeight: "bold",
                fontSize: "12px",
                lineHeight: "17px",
                boxShadow: "0px 0px 35px 14px rgba(19, 21, 27, 0.8)",
                ...themedStyles?.menu,
            };
        },
        menuList: (styles) => {
            return {
                ...styles,
                padding: "0 0 5px",

                "::-webkit-scrollbar": {
                    width: "4px",
                    height: "0px",
                },
                "::-webkit-scrollbar-track": {
                    background: "#1e2025",
                },
                "::-webkit-scrollbar-thumb": {
                    background: "#c1c5d6",
                },
                "::-webkit-scrollbar-thumb:hover": {
                    background: "#555555",
                },
                ...themedStyles?.menuList,
            };
        },
        option: (provided, { isFocused }) => ({
            ...provided,
            color: primary,
            backgroundColor: isFocused ? backgroundVariant600 : "transparent",
            "&:active": {
                backgroundColor: "transparent",
            },
            ...themedStyles?.option,
            cursor: "pointer",
            textTransform: "capitalize",
        }),
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
                    Input: CustomInput,
                    NoOptionsMessage: CustomNoOptionsMessage(isFetching),
                    MenuList: CustomMenuList(showTrending),
                    Option: CustomOption,
                    ...customComponents,
                }}
                styles={selectStyles}
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
