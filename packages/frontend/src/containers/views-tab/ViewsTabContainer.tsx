import { FC, useState } from "react";
import { ViewDialog } from "@alphaday/ui-kit";
import { useView, useAccount, useFeatureFlags } from "src/api/hooks";
import { useTutorial } from "src/api/hooks/useTutorial";
import { useWalletViewContext } from "src/api/store/providers/wallet-view-context";
import { TSubscribedView, TViewMeta } from "src/api/types";
import ViewsTab from "src/components/views-tab/ViewsTab";
import { EFeaturesRegistry } from "src/constants";
import CONFIG from "../../config";
import BoardsLibraryContainer from "../board-library/BoardsLibraryContainer";

const { VIEW_NAME_LIMT } = CONFIG.VIEWS;

interface IViewsTab {
    mobileOpen?: boolean;
    headerRef: React.RefObject<HTMLDivElement>;
    // eslint-disable-next-line react/no-unused-prop-types
    isBoardsLibOpen: boolean;
    // eslint-disable-next-line react/no-unused-prop-types
    onToggleBoardsLib: () => void;
    handleMobileOpen: () => void;
}
const ViewsTabContainer: FC<IViewsTab> = ({
    mobileOpen,
    isBoardsLibOpen,
    onToggleBoardsLib,
    headerRef,
    handleMobileOpen,
}) => {
    const {
        selectedView,
        subscribedViews,
        dialogState,
        dialogErrorMessage,
        closeViewDialog,
        openSaveViewDialog,
        saveViewAs,
        saveSelectedView,
        saveViewMeta,
        openRemoveViewDialog,
        removeView,
        isViewModified,
        allowEmptyView,
        toggleAllowEmptyView,
        navigateToView,
    } = useView();
    const { isAuthenticated, isStaff } = useAccount();
    const { currentTutorial, setTutFocusElemRef } = useTutorial();
    const { setAllowFetchWalletView, walletViewState } = useWalletViewContext();
    const isWalletBoardAllowed = useFeatureFlags(EFeaturesRegistry.WalletBoard);

    const [targetViewMeta, setTargetViewMeta] = useState<TViewMeta | undefined>(
        undefined
    );

    const saveAs = {
        title: "+ Save as",
        disabled: !isAuthenticated,
        handler: () => openSaveViewDialog(),
    };

    const onAllowFetchWalletView = () =>
        isAuthenticated && setAllowFetchWalletView(true);

    const extraOptions = !isStaff
        ? [saveAs]
        : [
              {
                  title: "Save",
                  disabled:
                      selectedView?.data.is_system_view !== true ||
                      !isViewModified ||
                      !!selectedView?.isReadOnly,
                  handler: () =>
                      saveSelectedView(selectedView?.data.is_system_view),
              },
              saveAs,
          ];

    const handleSelectTab = (view: TSubscribedView) => {
        if (selectedView?.data.hash === view.data.hash) {
            // prevent unnecessary state change/navigation
            return;
        }
        if (headerRef.current !== null) {
            // this read/scrollTo would only happen when the user clicks on a tab
            window.scrollTo(0, headerRef.current.offsetTop);
        }
        // the views tab is open on mobile, so we need to close it
        handleMobileOpen();
        navigateToView(view.data);
    };

    return (
        <>
            {!mobileOpen && (
                <BoardsLibraryContainer
                    isBoardsLibOpen={isBoardsLibOpen}
                    onToggleBoardsLib={onToggleBoardsLib}
                    onCreateNewView={() => {
                        toggleAllowEmptyView();
                        openSaveViewDialog();
                    }}
                    onEditView={(viewId: number, viewHash: string) => {
                        setTargetViewMeta({ id: viewId, hash: viewHash });
                        openSaveViewDialog();
                    }}
                />
            )}
            <ViewsTab
                selectedView={selectedView}
                subscribedViews={subscribedViews}
                extraOptions={extraOptions}
                walletViewState={walletViewState}
                onRemoveView={({
                    id,
                    isReadOnly,
                    hash,
                    slug,
                    isWalletView,
                }: TViewMeta) => {
                    if (isReadOnly) {
                        removeView({ id, isReadOnly, hash, slug });
                        return;
                    }
                    setTargetViewMeta({
                        id,
                        isReadOnly,
                        hash,
                        slug,
                        isWalletView,
                    });
                    openRemoveViewDialog();
                }}
                handleSelectTab={handleSelectTab}
                handleEditView={() => openSaveViewDialog()}
                mobileOpen={!!mobileOpen}
                onAllowFetchWalletView={onAllowFetchWalletView}
                currentTutorialTipId={currentTutorial.tip?.id}
                setTutFocusElemRef={setTutFocusElemRef}
                isWalletBoardAllowed={isWalletBoardAllowed}
            />
            <ViewDialog
                key={targetViewMeta?.id}
                viewName={
                    subscribedViews.find(
                        (v) => v.data.id === targetViewMeta?.id
                    )?.data.name
                }
                dialogState={dialogState}
                isCreateNewView={allowEmptyView}
                onClose={() => closeViewDialog()}
                onSave={(viewName) => {
                    if (targetViewMeta !== undefined) {
                        // update the view name
                        saveViewMeta(targetViewMeta.id, { name: viewName });
                        setTargetViewMeta(undefined);
                        return;
                    }
                    saveViewAs(viewName);
                }}
                onRemove={() => {
                    if (targetViewMeta !== undefined) {
                        removeView(targetViewMeta);
                        setTargetViewMeta(undefined);
                        if (targetViewMeta.isWalletView) {
                            setAllowFetchWalletView(false);
                        }
                    }
                }}
                errorMessage={dialogErrorMessage}
                viewNameLimit={VIEW_NAME_LIMT}
            />
        </>
    );
};

export default ViewsTabContainer;
