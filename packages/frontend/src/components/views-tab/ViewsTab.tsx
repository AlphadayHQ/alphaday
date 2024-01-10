import { FC, memo, useState, useCallback } from "react";
import {
    TViewTabMenuOption,
    breakpoints,
    twMerge,
    ViewTabButton,
    ShareViewDialog,
} from "@alphaday/ui-kit";
import { useWindowSize } from "src/api/hooks";
import {
    ETutorialTipId,
    TCachedView,
    TSubscribedView,
    EWalletViewState,
    TViewMeta,
} from "src/api/types";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { buildViewUrl, isViewModified } from "src/api/utils/viewUtils";
import WalletViewTabButton from "./WalletViewTabButton";

interface IViewsTabProps {
    selectedView: TCachedView | undefined;
    subscribedViews: ReadonlyArray<TSubscribedView>;
    extraOptions?: {
        title: string;
        disabled: boolean;
        handler: () => MaybeAsync<void>;
    }[];
    handleSelectTab: (view: TSubscribedView) => void;
    walletViewState: EWalletViewState;
    handleEditView: () => void;
    onRemoveView: ({
        id,
        isReadOnly,
        hash,
        slug,
        isWalletView,
    }: TViewMeta) => MaybeAsync<void>;
    mobileOpen: boolean;
    onAllowFetchWalletView: () => void;
    setTutFocusElemRef: React.Dispatch<
        React.SetStateAction<HTMLElement | null>
    >;
    currentTutorialTipId: ETutorialTipId | undefined;
    isWalletBoardAllowed: boolean;
}
const ViewsTab: FC<IViewsTabProps> = memo(function ViewsTab({
    selectedView,
    subscribedViews,
    extraOptions,
    onRemoveView,
    mobileOpen,
    currentTutorialTipId,
    setTutFocusElemRef,
    handleSelectTab,
    onAllowFetchWalletView,
    walletViewState,
    isWalletBoardAllowed,
}) {
    const [sharedView, setSharedView] = useState<TSubscribedView | undefined>(
        undefined
    );
    const [showShareViewDialog, setShowShareViewDialog] =
        useState<boolean>(false);

    const isSelectedViewModified = selectedView && isViewModified(selectedView);
    const tabsCount = subscribedViews.length + (extraOptions?.length || 0);
    const { width } = useWindowSize();
    // +0.5 so we have extra space, otherwise the ui would look too crowded
    // 145 is the minimum width of the tab button
    const columnWidth = Math.min(width / (tabsCount + 0.5), 145);

    const walletView = subscribedViews.find(
        (view: TSubscribedView) => view.data.is_smart
    );

    const filteredSubscribedViews = subscribedViews.filter(
        (view: TSubscribedView) => view.data.is_smart === false
    );

    const onWalletViewTabClick = useCallback(() => {
        if (walletView && walletViewState === EWalletViewState.Ready) {
            handleSelectTab(walletView);
        }
        if (walletViewState === EWalletViewState.Authenticated) {
            onAllowFetchWalletView();
        }
    }, [walletView, walletViewState, handleSelectTab, onAllowFetchWalletView]);

    const handleShareView = (view: TSubscribedView) => {
        setShowShareViewDialog(true);
        setSharedView(view);
    };

    const sharedViewUrl = sharedView
        ? buildViewUrl(sharedView?.data.hash || "")
        : undefined;

    const handleCopyViewUrl = () => {
        if (sharedViewUrl) {
            navigator.clipboard
                .writeText(sharedViewUrl)
                .then(() => toast("Board URL copied!"))
                .catch(() =>
                    toast("Failed to copy board URL!", {
                        type: EToastRole.Error,
                    })
                );
        }
    };

    const columnPercent = 100 / tabsCount;
    const tabButtonWrapperStyle =
        width >= breakpoints.TwoColMinWidth
            ? {
                  flex: `0 1 ${columnPercent}%`,
                  maxWidth: `min(${
                      columnPercent < 15
                          ? "100%"
                          : `max(${columnWidth}px, ${columnPercent}%)`
                  },${columnPercent > 8 ? `${columnWidth}px` : "100px"})`,
              }
            : {};

    return (
        <div
            id="views-tab"
            data-testid="views-tab"
            className={twMerge(
                "h-auto w-screen bg-background two-col:max-h-[44px]",
                mobileOpen && "border-b-2 border-b-background"
            )}
        >
            <div className="flex gap-1.5 h-full py-0 px-3 two-col:px-4 overflow-auto [&>.tabButton]:max-h-10 two-col:w-full two-col:flex two-col:justify-start">
                {subscribedViews.length !== 0 && isWalletBoardAllowed && (
                    <span
                        style={
                            walletViewState === EWalletViewState.Ready
                                ? tabButtonWrapperStyle
                                : {}
                        }
                        ref={(ref) =>
                            currentTutorialTipId ===
                                ETutorialTipId.WalletView &&
                            ref &&
                            setTutFocusElemRef(ref)
                        }
                    >
                        <WalletViewTabButton
                            walletViewState={walletViewState}
                            onClick={onWalletViewTabClick}
                            isSelected={
                                selectedView?.data.hash ===
                                walletView?.data.hash
                            }
                            isModified={
                                walletView ? isViewModified(walletView) : false
                            }
                            walletViewName={walletView?.data.name}
                            options={[
                                {
                                    handler:
                                        walletView &&
                                        walletViewState ===
                                            EWalletViewState.Ready
                                            ? () => handleShareView(walletView)
                                            : undefined,
                                    icon: "share",
                                    title: "Share board",
                                    key: "share-board",
                                },
                                {
                                    handler: walletView
                                        ? () =>
                                              onRemoveView({
                                                  id: walletView.data.id,
                                                  isReadOnly:
                                                      walletView.isReadOnly,
                                                  hash: walletView.data.hash,
                                                  slug: walletView.data.slug,
                                              })
                                        : undefined,
                                    icon: "trash",
                                    title: "Remove board",
                                    key: "remove-board",
                                },
                            ]}
                        />
                    </span>
                )}
                {filteredSubscribedViews.map((view, index) => {
                    /**
                     *  note: only including actions allowed for custom views for now
                     */
                    const viewMenuOptions: TViewTabMenuOption[] | undefined =
                        view.data.is_system_view
                            ? undefined
                            : [
                                  {
                                      handler: !view.data.is_system_view
                                          ? () => handleShareView(view)
                                          : undefined,
                                      icon: "share",
                                      title: "Share board",
                                      key: "share-board",
                                  },
                                  {
                                      handler: view.data.is_system_view
                                          ? undefined
                                          : () =>
                                                onRemoveView({
                                                    id: view.data.id,
                                                    isReadOnly: view.isReadOnly,
                                                    hash: view.data.hash,
                                                    slug: view.data.slug,
                                                }),
                                      icon: "trash",
                                      title: "Remove board",
                                      key: "remove-board",
                                  },
                              ];
                    return (
                        <span
                            key={view.data.hash}
                            ref={(ref) =>
                                index ===
                                    Math.floor(subscribedViews.length / 2) && // set the tut focus to the view in the middle
                                currentTutorialTipId ===
                                    ETutorialTipId.SwitchView &&
                                ref &&
                                setTutFocusElemRef(ref)
                            }
                            style={tabButtonWrapperStyle}
                        >
                            <ViewTabButton
                                className={
                                    selectedView?.data.hash !== view.data.hash
                                        ? "tabButton"
                                        : "tabButton selected"
                                }
                                onClick={() => handleSelectTab(view)}
                                title={`Open ${view.data.name}`}
                                selected={
                                    selectedView?.data.hash === view.data.hash
                                }
                                modified={isViewModified(view)}
                                options={viewMenuOptions}
                            >
                                <span className="name">{view.data.name}</span>
                            </ViewTabButton>
                        </span>
                    );
                })}
                {extraOptions &&
                    !mobileOpen &&
                    extraOptions.map((option) => (
                        <span key={option.title} style={tabButtonWrapperStyle}>
                            <ViewTabButton
                                className={
                                    isSelectedViewModified
                                        ? "opacity-80 hover:[&:not(.selected)]:bg-backgroundVariant200"
                                        : "opacity-40 hover:[&:not(.selected)]:bg-backgroundVariant200"
                                }
                                onClick={option.handler}
                                selected={false}
                                title="Save current board"
                                disabled={option.disabled}
                            >
                                <span className="name">{option.title}</span>
                            </ViewTabButton>
                        </span>
                    ))}
            </div>
            <ShareViewDialog
                title={`Share your "${truncateWithEllipsis(
                    sharedView?.data?.name ?? "",
                    12
                )}" Board`}
                viewUrl={sharedViewUrl ?? ""}
                onCopyUrl={handleCopyViewUrl}
                show={showShareViewDialog && sharedViewUrl !== undefined}
                onClose={() => {
                    setShowShareViewDialog(false);
                    setSharedView(undefined);
                }}
            />
        </div>
    );
});

export default ViewsTab;
