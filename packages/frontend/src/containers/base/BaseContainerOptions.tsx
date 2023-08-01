import { FC, useRef, useState } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import {
    components,
    GroupBase,
    OptionProps,
    SelectComponentsConfig,
} from "react-select";
import { useWidgetHeight } from "src/api/hooks";
import { useKeywordSearch } from "src/api/hooks/useKeywordSearch";
import {
    ETag,
    useGetCoinsQuery,
    useGetPinnedCoinsQuery,
    useTogglePinnedCoinMutation,
} from "src/api/services";
import { selectIsAuthenticated } from "src/api/store";
import { useAppSelector } from "src/api/store/hooks";
import {
    TCoin,
    TTag,
    TUserViewWidget,
    TUserViewWidgetSetting,
    TKeyword,
    TBaseEntity,
} from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as PinSVG } from "src/assets/icons/pin.svg";
import { ReactComponent as PinnedSVG } from "src/assets/icons/pinned.svg";
import { ReactComponent as TrashSVG } from "src/assets/icons/trash.svg";
import ScrollBar from "src/components/scrollbar";
import { AlphaButton } from "src/components/widgets/buttons/AlphaButton";
import { AlphaSearchBar } from "src/components/widgets/search/AlphaSearchBar";
import { AlphaTabButton } from "src/components/widgets/tabButtons/AlphaTabButton";
import { EWidgetSettingsRegistry } from "src/constants";
import {
    StyledModuleWrapper,
    StyledModuleHeader,
    StyledModuleBody,
    StyledModuleTitle,
    StyledModuleFooter,
    StyledSvgWrapper,
} from "./BaseContainer.style";
import BaseContainerMenu from "./BaseContainerMenu";

interface IBaseContainerOptions {
    dragProps: DraggableProvidedDragHandleProps | undefined;
    headerRef: React.RefObject<HTMLDivElement>;
    moduleData: TUserViewWidget;
    showSettings: boolean | undefined;
    onIncludeTag: (hash: string, tag: TTag) => void;
    onRemoveTag: (hash: string, tag: number) => void;
    removeWidget: () => void;
    toggleCollapse: () => void;
    toggleSettings: () => void;
}

type TOptions = {
    tag: TCoin | TKeyword;
    value: number;
    label: string;
};

interface ITagsOptions extends TUserViewWidgetSetting {
    searchState: string;
    searchResults: TCoin[] | TKeyword[] | undefined;
    placeholder: string;
    customComponents?: Partial<
        SelectComponentsConfig<TOptions, true, GroupBase<TOptions>>
    >;
    disabled?: boolean;
    title?: string;
    setSearchState: (s: string) => void;
    onIncludeTag: (kw: TBaseEntity) => void;
    onRemoveTag: (tagId: number) => void;
}

const CoinOption: FC<OptionProps<TOptions, true> & { coins?: TCoin[] }> = ({
    coins,
    children,
    ...props
}) => {
    const isPinned = !!coins?.find((coin) => coin.id === props.data.value);
    return (
        <components.Option {...props}>
            <StyledSvgWrapper>
                {isPinned ? <PinnedSVG /> : <PinSVG />}
            </StyledSvgWrapper>
            {children}
        </components.Option>
    );
};

const TagsOptions: FC<ITagsOptions> = ({
    setting,
    onIncludeTag,
    onRemoveTag,
    tags,
    searchState,
    setSearchState,
    searchResults,
    placeholder,
    customComponents,
    disabled,
    title,
}) => {
    const options = searchResults
        ?.map((tag) => ({
            tag,
            label: tag.name,
            value: tag.id,
        }))
        // remove tags that are already included
        .filter(
            ({ tag }) =>
                !tags.some(
                    (t) =>
                        t.id === tag.id || ("tag" in tag && t.id === tag.tag.id) // handle both coin and keyword tags
                )
        );

    return (
        <div key={setting.slug} className="setting" title={title}>
            <div className="setting-title">{setting.name}:</div>
            <AlphaSearchBar
                initialInputValue={searchState}
                options={searchState ? options : undefined}
                updateSearch={false}
                initialSearchValues={[]}
                closeMenuOnSelect
                onInputChange={setSearchState}
                placeholder={placeholder}
                onChange={(keywords) => {
                    if (!keywords || keywords.length === 0) {
                        return;
                    }
                    const [{ tag }] = keywords;
                    if (!tag) {
                        return;
                    }
                    if ("tag" in tag) {
                        onIncludeTag(tag.tag);
                    } else {
                        onIncludeTag(tag);
                    }
                    setSearchState("");
                }}
                customStyles={(theme) => ({
                    container: {
                        maxWidth: "300px",
                    },
                    control: {
                        padding: "0 10px",
                        backgroundColor: disabled
                            ? theme?.colors?.backgroundVariant800
                            : theme?.colors?.backgroundVariant400,
                    },
                    menuList: {
                        maxHeight: "100px",
                    },
                    input: {
                        margin: "0px",
                    },
                    placeholder: {
                        marginLeft: "0px",
                    },
                })}
                customComponents={customComponents}
                disabled={disabled}
            />
            <div className="searchTags">
                {tags.map((tag) => (
                    <span
                        role="button"
                        key={tag.id}
                        tabIndex={0}
                        onClick={(e) => {
                            e.stopPropagation(); // Doing this on StyledButton doesn't work.
                        }}
                        className={
                            tag.tag_type === ETag.Local ? "persisted" : ""
                        }
                    >
                        <AlphaTabButton
                            variant="transparent"
                            open={false}
                            onClose={() => {
                                onRemoveTag(tag.id);
                            }}
                        >
                            {tag.name}
                        </AlphaTabButton>
                    </span>
                ))}
            </div>
        </div>
    );
};

const BaseContainerOptions: FC<IBaseContainerOptions> = ({
    moduleData,
    onIncludeTag,
    toggleCollapse,
    toggleSettings,
    removeWidget,
    onRemoveTag,
    showSettings,
    headerRef,
    dragProps,
}) => {
    const { name, settings, widget } = moduleData;
    const widgetTitle = (name || widget.name).toUpperCase();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const { searchState, setSearchState, keywordResults } = useKeywordSearch();

    const [coinSearch, setCoinSearch] = useState("");
    const { data: coinsRawResults } = useGetCoinsQuery();
    const { data: pinnedCoins } = useGetPinnedCoinsQuery();

    const [togglePinnedCoinMutation] = useTogglePinnedCoinMutation();

    const footerWrapRef = useRef<HTMLDivElement>(null);
    const widgetHeight = useWidgetHeight(moduleData);
    const headerHeight = headerRef.current?.clientHeight ?? 0;
    const footerHeight = footerWrapRef.current?.clientHeight ?? 0;

    return (
        <StyledModuleWrapper
            className={`flip ${!showSettings ? "flipped" : ""}`}
            $height={
                widgetHeight < headerHeight + footerHeight
                    ? headerHeight + footerHeight
                    : widgetHeight
            }
        >
            <div ref={headerRef} {...dragProps}>
                <StyledModuleHeader>
                    <div className="header">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                toggleSettings();
                                toggleCollapse();
                            }}
                            className="wrap"
                        >
                            <StyledModuleTitle>
                                {widgetTitle} OPTIONS
                            </StyledModuleTitle>
                        </div>
                        <BaseContainerMenu
                            widgetDescription={widget.description}
                            isWidgetOptions
                            // Expand the widget before showing the settings
                            toggleSettings={
                                settings.length === 0
                                    ? undefined
                                    : toggleSettings
                            }
                            // You shouldn't be able to maximize the widget options
                            toggleMaximize={undefined}
                            toggleExpand={undefined}
                            // flip back to widget before minimize
                            toggleMinimize={() => {
                                toggleSettings();
                                toggleCollapse();
                            }}
                            takeScreenshot={undefined}
                            removeWidget={removeWidget}
                        />
                    </div>
                </StyledModuleHeader>
            </div>
            <StyledModuleBody>
                <ScrollBar className="settings">
                    {settings?.map((group) => {
                        const { setting, tags } = group;
                        if (
                            setting.slug ===
                            EWidgetSettingsRegistry.IncludedTags
                        ) {
                            return (
                                <TagsOptions
                                    key={setting.slug}
                                    searchResults={keywordResults}
                                    searchState={searchState}
                                    setSearchState={setSearchState}
                                    placeholder="ethereum, bitcoin, etc."
                                    onIncludeTag={(tag) => {
                                        const tagExists = tags.find(
                                            (t) => t.id === tag.id
                                        );
                                        if (tagExists) {
                                            return;
                                        }
                                        onIncludeTag(moduleData.hash, {
                                            slug: "",
                                            ...tag,
                                            tagType: ETag.Local,
                                        });
                                    }}
                                    onRemoveTag={(tagId) => {
                                        onRemoveTag(moduleData.hash, tagId);
                                    }}
                                    {...group}
                                />
                            );
                        }
                        if (
                            setting.slug === EWidgetSettingsRegistry.PinnedCoins
                        ) {
                            const coins = (pinnedCoins?.results || []).map(
                                (coin) => ({
                                    ...coin,
                                    tag_type: ETag.Local, // default all pinned coins to local
                                })
                            );
                            /* eslint-disable react/no-unstable-nested-components */
                            return (
                                <TagsOptions
                                    key={setting.slug}
                                    searchResults={coinsRawResults?.results}
                                    searchState={coinSearch}
                                    setSearchState={setCoinSearch}
                                    placeholder={
                                        isAuthenticated
                                            ? "eth, btc, etc."
                                            : "Sign up to pin coins and more"
                                    }
                                    title={
                                        isAuthenticated
                                            ? setting.name
                                            : "Sign up to pin coins and more"
                                    }
                                    disabled={!isAuthenticated}
                                    onIncludeTag={(coin) => {
                                        togglePinnedCoinMutation({
                                            coinId: coin.id,
                                        })
                                            .then((r) => {
                                                Logger.debug(
                                                    "BaseContainerOptions::togglePinnedCoin: success",
                                                    r
                                                );
                                            })
                                            .catch((e) => {
                                                Logger.error(
                                                    "BaseContainerOptions::togglePinnedCoin: failed",
                                                    e
                                                );
                                            });
                                    }}
                                    onRemoveTag={(coinId) => {
                                        togglePinnedCoinMutation({
                                            coinId,
                                        })
                                            .then((r) => {
                                                Logger.debug(
                                                    "BaseContainerOptions::togglePinnedCoin: success",
                                                    r
                                                );
                                            })
                                            .catch((e) => {
                                                Logger.error(
                                                    "BaseContainerOptions::togglePinnedCoin: failed",
                                                    e
                                                );
                                            });
                                    }}
                                    {...group}
                                    tags={coins}
                                    customComponents={{
                                        Option(props) {
                                            return (
                                                <CoinOption
                                                    coins={pinnedCoins?.results}
                                                    {...props}
                                                />
                                            );
                                        },
                                    }}
                                />
                            );
                        }
                        return null; // we don't support other settings types yet
                    })}
                </ScrollBar>
            </StyledModuleBody>
            <div ref={footerWrapRef}>
                <StyledModuleFooter>
                    <AlphaButton
                        variant="small"
                        onClick={removeWidget}
                        title="Removes this widget from the current board"
                    >
                        <TrashSVG width="15px" fill="inherit" /> &nbsp; Remove
                        Widget
                    </AlphaButton>
                </StyledModuleFooter>
            </div>
        </StyledModuleWrapper>
    );
};

export default BaseContainerOptions;
