import { FC } from "react";
import { BaseModuleHeader, TabButton } from "@alphaday/ui-kit";
import { TBaseTag } from "src/api/services";
import { TUserViewWidget } from "src/api/types";
import { ReactComponent as CloseSVG } from "src/assets/icons/close3.svg";
import BaseContainerMenu from "./BaseContainerMenu";

interface IBaseContainerHeader {
    headerRef: React.RefObject<HTMLDivElement>;
    toggleCollapse: () => void;
    tags: TBaseTag[] | undefined;
    handleShowFullSize: () => void;
    title: string;
    removeTagFromViewWidget: (viewHash: string, tagId: number) => void;
    widgetDescription: string;
    removeWidget: () => void;
    toggleSettings: (() => void) | undefined;
    alreadyCollapsed: boolean;
    showFullSize: boolean | undefined;
    allowFullSize: boolean | undefined;
    moduleData: TUserViewWidget<unknown>;
}
const BaseContainerHeader: FC<IBaseContainerHeader> = ({
    headerRef,
    toggleCollapse,
    tags,
    handleShowFullSize,
    title,
    removeTagFromViewWidget,
    widgetDescription,
    removeWidget,
    toggleSettings,
    alreadyCollapsed,
    moduleData,
    showFullSize,
    allowFullSize,
}) => {
    return (
        <BaseModuleHeader ref={headerRef}>
            <div className="flex w-full items-start justify-between">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={toggleCollapse}
                    className="flex h-[inherit] w-full pb-0.5 focus-visible:outline-none"
                >
                    <h6 className="text-primaryVariant100 fontGroup-highlightSemi m-0 inline-flex uppercase">
                        {title}
                    </h6>
                    {tags && (
                        <span
                            data-testid="module-search-tags"
                            className="leading-[18px]"
                        >
                            {tags.map((tag) => (
                                <span
                                    role="button"
                                    className="items-end [&>svg]:self-end [&>svg]:pb-[3px] fontGroup-supportBold ml-1.5"
                                    key={tag.id}
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Doing this on StyledButton doesn't work.
                                    }}
                                >
                                    <TabButton
                                        variant="transparent"
                                        open={false}
                                        onClose={() => {
                                            removeTagFromViewWidget(
                                                moduleData.hash,
                                                tag.id
                                            );
                                        }}
                                        title={tag.name}
                                        uppercase
                                        className="pb-[1.85px]"
                                    >
                                        {tag.name}
                                    </TabButton>
                                </span>
                            ))}
                        </span>
                    )}
                </div>
                {showFullSize ? (
                    <div
                        className="fill-primaryVariant100 flex h-[30px] cursor-pointer items-center self-center pr-1.5"
                        onClick={handleShowFullSize}
                        role="button"
                        title="Close full-size view"
                        tabIndex={0}
                    >
                        <CloseSVG />
                    </div>
                ) : (
                    <BaseContainerMenu
                        widgetDescription={widgetDescription}
                        // Having a collapsed widget options should never happen, so this is safe
                        toggleSettings={
                            moduleData.settings.length === 0
                                ? undefined
                                : toggleSettings
                        }
                        toggleMaximize={
                            allowFullSize ? handleShowFullSize : undefined
                        }
                        toggleExpand={
                            alreadyCollapsed ? toggleCollapse : undefined
                        }
                        toggleMinimize={
                            alreadyCollapsed
                                ? undefined
                                : (showFullSize && handleShowFullSize) ||
                                  toggleCollapse
                        }
                        takeScreenshot={undefined}
                        removeWidget={removeWidget}
                    />
                )}
            </div>
        </BaseModuleHeader>
    );
};

export default BaseContainerHeader;
