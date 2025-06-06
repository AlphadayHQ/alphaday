import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
    Dialog,
    Modal,
    BaseModuleWrapper,
    breakpoints,
    BaseModuleBody,
} from "@alphaday/ui-kit";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import {
    useCallbackState,
    useView,
    useWidgetHeight,
    useWindowSize,
} from "src/api/hooks";
import {
    toggleCollapse as toggleCollapseInStore,
    selectIsMinimised,
    removeWidgetFromView,
    removeWidgetStateFromCache,
    setWidgetHeight,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { TUserViewWidget } from "src/api/types";
import { IPromptEditorProps } from "src/components/kasandra/types";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import BaseContainerHeader from "./BaseContainerHeader";
import BaseContainerOptions from "./BaseContainerOptions";

const { HEADER_HEIGHT } = CONFIG.WIDGETS.COMMON;
interface IBaseContainerProps {
    adjustable?: boolean;
    visible?: boolean;
    children?: React.ReactNode;
    moduleData: TUserViewWidget;
    uiProps: {
        onToggleShowFullSize?: (val: "open" | "close") => void;
        showFullSize?: boolean;
        allowFullSize?: boolean;
        dragProps: DraggableProvidedDragHandleProps | undefined;
        isDragging?: boolean;
        setTutFocusElemRef:
            | React.Dispatch<React.SetStateAction<HTMLElement | null>>
            | undefined;
    };
    promptProps?: IPromptEditorProps;
    onToggleCollapse?: () => void;
    onRemoveWidget?: (hash: string) => void;
}

/**
 * BaseContainer Component that should be reused by most app modules (market,
 * news, tvl, etc.)
 */
const BaseContainer: FC<IBaseContainerProps> = ({
    uiProps,
    promptProps,
    children,
    onToggleCollapse,
    moduleData,
    onRemoveWidget,
    adjustable = true,
    visible,
}) => {
    const {
        onToggleShowFullSize,
        showFullSize,
        allowFullSize,
        dragProps,
        setTutFocusElemRef,
    } = uiProps;
    const dispatch = useAppDispatch();
    const { width } = useWindowSize();
    const moduleWrapRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const widgetHeight = useWidgetHeight(moduleData);

    const title = (moduleData.name || moduleData.widget.name).toUpperCase();
    const widgetDescription = moduleData.widget.description;
    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );
    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    const isCollapsed = useAppSelector(selectIsMinimised(moduleData.hash));
    const [alreadyCollapsed, setAlreadyCollapsed] =
        useCallbackState(isCollapsed);
    const { removeTagFromViewWidget, includeTagInViewWidget } = useView();

    const adjustWidgetHeight = (height: number) => {
        dispatch(
            setWidgetHeight({
                widgetHash: moduleData.hash,
                widgetHeight: height,
            })
        );
    };
    const [showMobileDialog, setShowMobileDialog] = useState(
        width <= breakpoints.TwoColMinWidth && showFullSize
    );
    const [showSettings, setShowSettings] = useState<boolean | undefined>();
    const handleShowDialog = () => {
        setShowMobileDialog(false);
    };
    const toggleCollapse = useCallback(() => {
        dispatch(toggleCollapseInStore({ widgetHash: moduleData.hash }));
        if (onToggleCollapse != null) onToggleCollapse();
    }, [dispatch, moduleData.hash, onToggleCollapse]);

    const toggleSettings = useCallback(() => {
        // widget options uses the height of the widget. The widget must be expanded before the options can be shown
        if (isCollapsed) {
            // Change the state of the widget to expanded before showing the options
            setAlreadyCollapsed(false, () => {
                toggleCollapse();
                setShowSettings((showSetting) => !showSetting);
            });
        } else setShowSettings((showSetting) => !showSetting);
    }, [isCollapsed, setAlreadyCollapsed, toggleCollapse]);

    useEffect(() => {
        setAlreadyCollapsed(isCollapsed);
    }, [isCollapsed, setAlreadyCollapsed]);

    const handleShowFullSize = useCallback(() => {
        if (
            width !== undefined &&
            width < breakpoints.TwoColMinWidth &&
            showFullSize === false
        ) {
            setShowMobileDialog(true);
            return;
        }
        // expand regular size module since full-size modal is already open
        if (onToggleShowFullSize) {
            onToggleShowFullSize(showFullSize ? "close" : "open");
        }
    }, [onToggleShowFullSize, showFullSize, width]);

    const removeWidget = useCallback(() => {
        dispatch(removeWidgetFromView({ widgetHash: moduleData.hash }));
        dispatch(removeWidgetStateFromCache({ widgetHash: moduleData.hash }));
        if (onRemoveWidget) onRemoveWidget(moduleData.hash);
    }, [dispatch, onRemoveWidget, moduleData.hash]);

    const adjustHeight = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.stopPropagation();
        event.preventDefault();
        if (!moduleWrapRef.current) return;
        const startHeight = moduleWrapRef.current.clientHeight; // Current widget Height
        const { pageY: startPosY } = event;

        const resize = (e: MouseEvent) => {
            const dy = e.pageY - startPosY;
            const headerHeight =
                headerRef.current?.clientHeight || HEADER_HEIGHT;
            adjustWidgetHeight(startHeight - headerHeight + dy);
        };

        const stopResize = () => {
            document?.removeEventListener("mousemove", resize, false);
            document?.removeEventListener("mouseup", stopResize, false);
            document?.removeEventListener("mouseleave", stopResize, false);
        };

        document.addEventListener("mouseup", stopResize, false);
        document.addEventListener("mouseleave", stopResize, false);
        document.addEventListener("mousemove", resize, false);
    };

    const moduleId = `module-${moduleData.hash}`;

    // TODO(elcharitas): Review this, Do we need to hide the module if it is not visible?
    if (visible === false) {
        return <div id={moduleId} {...dragProps} hidden />;
    }

    return (
        <>
            <div
                id={moduleData.hash}
                className="flex flex-col [&>div:only-child:not(:empty)]:rounded-bl-none [&>div:only-child:not(:empty)]:rounded-br-none"
            >
                <div className="mb-4 w-full [perspective:1000px]">
                    <div
                        ref={moduleWrapRef}
                        className={`w-full h-full transition-all duration-[0.5s] [transform-style:preserve-3d] ${
                            showSettings ? "[transform:rotateX(180deg)]" : ""
                        }`}
                    >
                        <BaseModuleWrapper
                            className={showSettings ? "hidden" : ""}
                        >
                            <div
                                ref={(ref) =>
                                    setTutFocusElemRef &&
                                    ref &&
                                    setTutFocusElemRef(ref)
                                }
                                id={moduleId}
                                {...dragProps}
                            >
                                <BaseContainerHeader
                                    headerRef={headerRef}
                                    toggleCollapse={toggleCollapse}
                                    tags={tags}
                                    handleShowFullSize={handleShowFullSize}
                                    title={title}
                                    removeTagFromViewWidget={
                                        removeTagFromViewWidget
                                    }
                                    widgetDescription={widgetDescription}
                                    removeWidget={removeWidget}
                                    toggleSettings={toggleSettings}
                                    alreadyCollapsed={alreadyCollapsed}
                                    moduleData={moduleData}
                                    showFullSize={showFullSize}
                                    allowFullSize={allowFullSize}
                                />
                            </div>
                            {!alreadyCollapsed && !showFullSize && (
                                <BaseModuleBody
                                    style={{
                                        height: adjustable
                                            ? `${widgetHeight}px`
                                            : undefined,
                                    }}
                                >
                                    {children}
                                </BaseModuleBody>
                            )}
                        </BaseModuleWrapper>
                        <BaseContainerOptions
                            showSettings={showSettings}
                            onIncludeTag={includeTagInViewWidget}
                            onRemoveTag={removeTagFromViewWidget}
                            toggleCollapse={toggleCollapse}
                            toggleSettings={toggleSettings}
                            headerRef={headerRef}
                            removeWidget={removeWidget}
                            moduleData={moduleData}
                            dragProps={dragProps}
                            promptProps={promptProps}
                        />
                    </div>
                    {adjustable && !isCollapsed && (
                        <div
                            onMouseDown={adjustHeight}
                            className="absolute bottom-[-18px] left-[-3px] h-4 w-[calc(100%_+_6px)] cursor-row-resize border-[none]"
                            role="button"
                            title="Adjust widget height"
                            tabIndex={-1}
                        />
                    )}
                </div>
            </div>
            {onToggleShowFullSize &&
                allowFullSize &&
                width > breakpoints.TwoColMinWidth && (
                    <Modal
                        size="max"
                        showModal={!!showFullSize}
                        onClose={handleShowFullSize}
                    >
                        <BaseContainerHeader
                            headerRef={headerRef}
                            toggleCollapse={toggleCollapse}
                            tags={tags}
                            handleShowFullSize={handleShowFullSize}
                            title={title}
                            removeTagFromViewWidget={removeTagFromViewWidget}
                            widgetDescription={widgetDescription}
                            removeWidget={removeWidget}
                            toggleSettings={toggleSettings}
                            alreadyCollapsed={alreadyCollapsed}
                            moduleData={moduleData}
                            showFullSize={showFullSize}
                            allowFullSize={allowFullSize}
                        />
                        {children}
                        <div className="foot-block" />
                    </Modal>
                )}
            <Dialog
                title="Alphaday"
                showXButton
                saveButtonText="Close"
                showDialog={showMobileDialog}
                onSave={handleShowDialog}
                onClose={() => {
                    handleShowDialog();
                    handleShowFullSize();
                }}
                size="sm"
            >
                <p>Switch to Desktop to get the best experience of {title}</p>
            </Dialog>
        </>
    );
};

export default BaseContainer;
