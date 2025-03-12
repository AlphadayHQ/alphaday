/* eslint-disable react/no-unstable-nested-components */
import { FC, useRef, useState } from "react";
import {
    BaseModuleBody,
    BaseModuleHeader,
    BaseModuleOptionsFooter,
    BaseModuleWrapper,
    ScrollBar,
    SearchBar,
    TabButton,
} from "@alphaday/ui-kit";
import { ReactComponent as PinSVG } from "@alphaday/ui-kit/src/assets/svg/pin.svg";
import { ReactComponent as PinnedSVG } from "@alphaday/ui-kit/src/assets/svg/pinned.svg";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
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
import { EWidgetSettingsRegistry } from "src/constants";
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
            <div className="mr-2 [&>svg]:h-2.5">
                {isPinned ? <PinnedSVG /> : <PinSVG />}
            </div>
            {children}
        </components.Option>
    );
};

const TagsOptions: FC<ITagsOptions> = ({
    widget_setting,
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
        <div
            key={widget_setting.setting.slug}
            className="setting"
            title={title}
        >
            <div className="mb-2.5 fontGroup-highlightSemi">
                {widget_setting.setting.name}:
            </div>
            <SearchBar
                options={searchState ? options : undefined}
                updateSearch={false}
                initialSearchValues={[]}
                closeMenuOnSelect
                onInputChange={setSearchState}
                placeholder={placeholder}
                onChange={(keywords) => {
                    if (!keywords || keywords.length === 0) return;
                    const [{ tag }] = keywords;
                    if (!tag) return;
                    if ("tag" in tag) {
                        onIncludeTag(tag.tag);
                    } else {
                        onIncludeTag(tag);
                    }
                    setSearchState("");
                }}
                componentClassNames={{
                    container: () => "max-w-[300px] z-10",
                    control: () =>
                        `p-0 h-[41px] cursor-text bg-background hover:bg-background border-0 shadow-none min-h-[41px] ${
                            disabled ? "bg-background" : "bg-background"
                        }`,
                    menuList: () => "max-h-[100px]",
                    input: () => "m-0 ml-[10px] p-0 text-primary border-0",
                    placeholder: () => "ml-0",
                }}
                customComponents={customComponents}
                disabled={disabled}
            />
            <div className="m-2.5 flex items-center">
                {tags.map((tag) => (
                    <span
                        role="button"
                        key={tag.id}
                        tabIndex={0}
                        onClick={(e) => {
                            e.stopPropagation(); // Doing this on StyledButton doesn't work.
                        }}
                        className={
                            tag.tag_type === ETag.Local
                                ? "[&>*]:text-secondaryOrange50 opacity-90"
                                : ""
                        }
                    >
                        <TabButton
                            variant="transparent"
                            className="[&>.close]:stroke-secondaryOrange100 mr-1.5 uppercase fontGroup-supportBold"
                            open={false}
                            onClose={() => {
                                onRemoveTag(tag.id);
                            }}
                        >
                            {tag.name}
                        </TabButton>
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
    const { t: translate } = useTranslation();
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
        <BaseModuleWrapper
            height={
                widgetHeight < headerHeight + footerHeight
                    ? headerHeight + footerHeight
                    : widgetHeight
            }
            className={`[transform:rotateX(180deg)] [backface-visibility:hidden] w-full ${
                showSettings ? "" : "hidden"
            }`}
        >
            <div ref={headerRef} {...dragProps}>
                <BaseModuleHeader>
                    <div className="flex w-full items-center justify-between">
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                toggleSettings();
                                toggleCollapse();
                            }}
                            className="flex h-[inherit] w-full pb-0.5"
                        >
                            <h6 className="text-primaryVariant100 fontGroup-highlightSemi m-0 inline-flex uppercase">
                                {widgetTitle} OPTIONS
                            </h6>
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
                </BaseModuleHeader>
            </div>
            <BaseModuleBody>
                <ScrollBar className="shrink p-4">
                    {settings?.map((group) => {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        const { widget_setting, tags } = group;
                        if (
                            widget_setting.setting.slug ===
                            EWidgetSettingsRegistry.IncludedTags
                        ) {
                            return (
                                <TagsOptions
                                    key={widget_setting.setting.slug}
                                    searchResults={keywordResults}
                                    searchState={searchState}
                                    setSearchState={setSearchState}
                                    // placeholder="ethereum, bitcoin, etc."
                                    placeholder={translate(
                                        "others.tagOptions.auth"
                                    )}
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
                            widget_setting.setting.slug ===
                            EWidgetSettingsRegistry.PinnedCoins
                        ) {
                            const coins = (pinnedCoins?.results || []).map(
                                (coin) => ({
                                    ...coin,
                                    tag_type: ETag.Local, // default all pinned coins to local
                                })
                            );
                            return (
                                <TagsOptions
                                    key={widget_setting.setting.slug}
                                    searchResults={coinsRawResults?.results}
                                    searchState={coinSearch}
                                    setSearchState={setCoinSearch}
                                    placeholder={
                                        isAuthenticated
                                            ? translate(
                                                  "others.tagOptions.auth"
                                              )
                                            : translate(
                                                  "others.tagOptions.unAuth"
                                              )
                                    }
                                    title={
                                        isAuthenticated
                                            ? widget_setting.setting.name
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
            </BaseModuleBody>
            <BaseModuleOptionsFooter
                removeWidget={removeWidget}
                text={translate("widget.removeWidget")}
                ref={footerWrapRef}
            />
        </BaseModuleWrapper>
    );
};

export default BaseContainerOptions;
