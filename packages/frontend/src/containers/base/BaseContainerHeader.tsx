import { FC } from "react";
import { TBaseTag } from "src/api/services";
import { TUserViewWidget } from "src/api/types";
import { ReactComponent as CloseSVG } from "src/assets/icons/close3.svg";
import { AlphaTabButton } from "src/components/widgets/tabButtons/AlphaTabButton";
import { StyledModuleHeader, StyledModuleTitle } from "./BaseContainer.style";
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
        <StyledModuleHeader ref={headerRef}>
            <div className="header">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={toggleCollapse}
                    className="wrap"
                >
                    <StyledModuleTitle>{title}</StyledModuleTitle>
                    {tags && (
                        <span
                            data-testid="module-search-tags"
                            className="searchTags"
                        >
                            {tags.map((tag) => (
                                <span
                                    role="button"
                                    key={tag.id}
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Doing this on StyledButton doesn't work.
                                    }}
                                >
                                    <AlphaTabButton
                                        variant="transparent"
                                        open={false}
                                        onClose={() => {
                                            removeTagFromViewWidget(
                                                moduleData.hash,
                                                tag.id
                                            );
                                        }}
                                        title={tag.name}
                                    >
                                        {tag.name}
                                    </AlphaTabButton>
                                </span>
                            ))}
                        </span>
                    )}
                </div>
                {showFullSize ? (
                    <div
                        className="button"
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
        </StyledModuleHeader>
    );
};

export default BaseContainerHeader;
