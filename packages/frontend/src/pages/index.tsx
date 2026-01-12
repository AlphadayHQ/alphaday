import { useCallback, useState, useMemo, useRef, memo } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import {
    useView,
    useAvailableViews,
    useWidgetLib,
    useViewUpdater,
    useTutorial,
    useWindowSize,
    useImageWidget,
    useRecipeLibraryHash,
    useRecipes,
} from "src/api/hooks";
import useMousePosition from "src/api/hooks/useMousePosition";
import {
    removeWidgetFromView,
    removeWidgetStateFromCache,
    selectIsMinimised,
    toggleLanguageModal,
    toggleRecipeLibrary,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { ETutorialTipId, TUserViewWidget } from "src/api/types";
import {
    getDraggedWidget,
    recomputeWidgetsPos,
    getColType,
    useTwoColWidgets,
    getLayoutStateFromView,
} from "src/api/utils/layoutUtils";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import DesktopWidgetsView from "src/components/widgets/DesktopWidgetsView";
import CONFIG from "src/config/config";
import { AboutUsModalContainer } from "src/containers/AboutUsModalContainer";
import CookieDisclaimerContainer from "src/containers/cookie-disclaimer/CookieDisclaimerContainer";
import AuthContainer from "src/containers/dialogs/AuthContainer";
import WalletConnectionDialogContainer from "src/containers/dialogs/WalletConnectionDialogContainer";
import { LanguageModalContainer } from "src/containers/LanguageModalContainer";
import { RecipeLibraryContainer } from "src/containers/recipe-library/RecipeLibraryContainer";
import TutorialContainer from "src/containers/tutorial/TutorialContainer";
import { deviceBreakpoints } from "src/globalStyles/breakpoints";
import MainLayout from "src/layout/MainLayout";
import MobileWidgetsView from "src/mobile-components/widgets/MobileWidgetsView";
import { TTemplateSlug } from "src/types";

const { UI, VIEWS } = CONFIG;

function BasePage({ isFullsize }: { isFullsize: boolean | undefined }) {
    const dispatch = useAppDispatch();
    const { enabled: isRecipesEnabled } = useRecipes();

    const {
        selectedView,
        addWidgetsToCache,
        hasWidgetInCache,
        subscribedViews,
    } = useView();

    const availableViews = useAvailableViews();

    const removeWidget = useCallback(
        (widgetHash: string) => {
            dispatch(removeWidgetFromView({ widgetHash }));
            dispatch(removeWidgetStateFromCache({ widgetHash }));
        },
        [dispatch]
    );

    const onToggleLanguageModal = () => dispatch(toggleLanguageModal());
    const { toggleModal: hashToggleRecipeLibrary } = useRecipeLibraryHash();
    const onToggleRecipeLibrary = UI.USE_URL_HASH_FOR_RECIPE_MODAL
        ? hashToggleRecipeLibrary
        : () => dispatch(toggleRecipeLibrary());

    const { toggleWidgetLib } = useWidgetLib();
    const { currentTutorial, setTutFocusElemRef, showTutorial } = useTutorial();
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const windowSize = useWindowSize();
    const isMobile = windowSize.width < deviceBreakpoints.twoCol;
    const {
        imageWidgetSize,
        aspectRatios: twoColWidgetAspectRatios,
        handleAspectRatioDetected,
    } = useImageWidget(selectedView);

    const [isDraggedWidgetInView, setIsDraggedWidgetInView] = useState(false);

    const trashRef = useRef<HTMLDivElement | null>(null);
    const mousePos = useMousePosition({
        includeTouch: true,
        trackPosition: isDraggedWidgetInView,
    });
    const TrashtoMouseRelPos = useMemo(() => {
        const { x, y } = mousePos;
        const trashRect = trashRef.current?.getBoundingClientRect();

        if (trashRect && x && y) {
            return {
                x: trashRect.x + trashRect.width - x,
                y: trashRect.y + trashRect.height - y,
                // if mouse & ref intersects
                intersects:
                    trashRect.x <= x &&
                    x <= trashRect.x + trashRect.width &&
                    trashRect.y <= y &&
                    y <= trashRect.y + trashRect.width,
            };
        }
        return { ...mousePos, intersects: false };
    }, [mousePos]);

    /**
     * A full-size module is a module/widget that takes the whole width of the page.
     * It is not draggable and is not part of the layout grid.
     *
     * Full-size modules are resolved from the location pathname in App.tsx
     */
    const fullSizeWidgetConfig:
        | {
              slug: TTemplateSlug;
              hash: string | undefined;
          }
        | undefined = useMemo(
        () =>
            isFullsize
                ? {
                      slug: UI.FULL_SIZE_WIDGET_SLUG as TTemplateSlug,
                      // we should not check the hash if `fullSizeWidgetSlug` is undefined.
                      hash: selectedView?.data.widgets.find(
                          (w) =>
                              w.widget.template.slug ===
                              UI.FULL_SIZE_WIDGET_SLUG
                      )?.hash,
                  }
                : undefined,
        [isFullsize, selectedView?.data.widgets]
    );

    const { widgets: twoColWidgets } = useTwoColWidgets(selectedView);

    const twoColWidgetCollapsedStates = useAppSelector((state) => {
        const collapsedStates: Record<string, boolean> = {};
        Object.entries(twoColWidgets).forEach(([key, moduleData]) => {
            if (moduleData?.hash) {
                collapsedStates[key] = selectIsMinimised(moduleData.hash)(
                    state
                );
            }
        });
        return collapsedStates;
    });

    /**
     * The current layout state according to the screen size
     */
    const layoutState = useMemo<TUserViewWidget[][] | undefined>(() => {
        return getLayoutStateFromView(selectedView, windowSize.width);
    }, [windowSize.width, selectedView]);

    const widgetsCount = selectedView?.data.widgets.length;

    const handleOnDragEnd = useCallback(
        (
            result: DropResult,
            currLayoutState: TUserViewWidget[][] | undefined
        ) => {
            /**
             * result has the following props:
             *   draggableId: id of the element being dragged
             *   source/destination: {
             *    droppableId: string (column number)
             *    index: number (row index)
             *   }
             */

            const isNewWidget = result.draggableId.includes(
                UI.NEW_WIDGET_IDENTIFIER
            );

            // once we stop dragging, we reset the dragged widget state
            setIsDraggedWidgetInView(false);

            const maxWidgets =
                selectedView?.data.max_widgets ?? VIEWS.MAX_WIDGETS;

            if (
                widgetsCount !== undefined &&
                widgetsCount >= maxWidgets &&
                isNewWidget
            ) {
                toast(
                    `A maximum of ${maxWidgets} widgets is allowed per board`,
                    {
                        type: EToastRole.Error,
                        status: "alert",
                    }
                );
                return;
            }

            const { source, destination } = result;

            if (!destination || currLayoutState === undefined) {
                Logger.warn(
                    "home::handleOnDragEnd: destination or layout undefined, exiting..."
                );
                return;
            }

            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) {
                return;
            }

            const sourcePos = {
                col: Number(source.droppableId),
                row: source.index,
            };

            const destPos = {
                col: Number(destination.droppableId),
                row: destination.index,
            };

            const colType = getColType(windowSize.width);

            const draggedWidget = getDraggedWidget(
                currLayoutState,
                sourcePos,
                destPos,
                colType
            );

            if (!draggedWidget) {
                Logger.warn(
                    "home::handleOnDragEnd: could not retrieve dragged widget, should never happen"
                );
                return;
            }

            // clone previous layout state
            const newLayoutState: TUserViewWidget[][] = [[]];
            for (let i = 0; i < currLayoutState.length; i += 1) {
                newLayoutState[i] = [...currLayoutState[i]];
            }

            // remove the element from its original position
            newLayoutState[sourcePos.col].splice(sourcePos.row, 1);
            // insert element in new position
            newLayoutState[destPos.col].splice(destPos.row, 0, draggedWidget);

            addWidgetsToCache(recomputeWidgetsPos(newLayoutState));

            if (widgetsCount === maxWidgets - 1 && isNewWidget) {
                toast(
                    `A maximum of ${maxWidgets} widgets is allowed per board. You now have ${maxWidgets}`,
                    {
                        type: EToastRole.Warning,
                        status: "alert",
                    }
                );
            }
        },
        [
            addWidgetsToCache,
            selectedView?.data.max_widgets,
            widgetsCount,
            windowSize.width,
        ]
    );

    /**
     * Returns available widgets for the Rearrange widgets tutorial tip
     *
     * There is always going to be an a widget at the top row of a view
     * unless the view is empty
     *
     * the function checks these widgets exist.
     */
    const preferredDragTutorialWidget = useMemo<
        [number, number] | undefined
    >(() => {
        if (!layoutState) return undefined;
        if (layoutState[0][1]) return [1, 0]; // second widget first row
        if (layoutState[0][2]) return [2, 0]; // third widget first row
        if (layoutState[0][0]) return [0, 0]; // first widget first row
        return undefined;
    }, [layoutState]);

    useViewUpdater();

    if (
        subscribedViews.length === 0 &&
        isAuthenticated &&
        selectedView === undefined
    ) {
        return (
            <MainLayout
                toggleWidgetLib={toggleWidgetLib}
                toggleLanguageModal={onToggleLanguageModal}
                hideFooter
                setTutFocusElemRef={
                    currentTutorial.tip?.id === ETutorialTipId.UseWidgetLib
                        ? setTutFocusElemRef
                        : undefined
                }
            >
                You do not have any pinned boards. You can add some from the
                boards manager.
            </MainLayout>
        );
    }

    // Mobile view: Show widgets in a tabbed interface, one at a time
    if (isMobile && selectedView?.data.widgets) {
        return (
            <MainLayout
                toggleWidgetLib={toggleWidgetLib}
                toggleLanguageModal={onToggleLanguageModal}
                hideFooter
                viewName={selectedView?.data.name}
            >
                <MobileWidgetsView widgets={selectedView.data.widgets} />
                <CookieDisclaimerContainer />
                <AuthContainer />
                <WalletConnectionDialogContainer />
                <AboutUsModalContainer />
                <LanguageModalContainer />
            </MainLayout>
        );
    }

    // Desktop view: Show drag and drop grid layout
    return (
        <MainLayout
            toggleWidgetLib={toggleWidgetLib}
            toggleLanguageModal={onToggleLanguageModal}
            toggleRecipeLibrary={onToggleRecipeLibrary}
            layoutState={layoutState}
            hideFooter={
                (showTutorial && !!availableViews?.length) || // do not show the tutorial if there are no views
                fullSizeWidgetConfig !== undefined
            }
            setTutFocusElemRef={
                currentTutorial.tip?.id === ETutorialTipId.UseWidgetLib
                    ? setTutFocusElemRef
                    : undefined
            }
        >
            <DragDropContext
                onDragEnd={(result) => {
                    handleOnDragEnd(result, layoutState);
                    if (
                        TrashtoMouseRelPos?.intersects &&
                        hasWidgetInCache(result.draggableId)
                    ) {
                        removeWidget(result.draggableId);
                        toast("Widget has been removed from board");
                    }
                }}
            >
                <DesktopWidgetsView
                    layoutState={layoutState}
                    twoColWidgets={twoColWidgets}
                    twoColWidgetCollapsedStates={twoColWidgetCollapsedStates}
                    imageWidgetSize={imageWidgetSize}
                    twoColWidgetAspectRatios={twoColWidgetAspectRatios}
                    handleAspectRatioDetected={handleAspectRatioDetected}
                    fullSizeWidgetConfig={fullSizeWidgetConfig}
                    preferredDragTutorialWidget={preferredDragTutorialWidget}
                />
            </DragDropContext>
            <CookieDisclaimerContainer />
            <AuthContainer />
            <TutorialContainer />
            <WalletConnectionDialogContainer />
            <AboutUsModalContainer />
            <LanguageModalContainer />
            {isRecipesEnabled && <RecipeLibraryContainer />}
        </MainLayout>
    );
}

export default memo(BasePage);
