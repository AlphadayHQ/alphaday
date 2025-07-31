import { useCallback, useState, useMemo, useRef, memo } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import {
    useView,
    useAvailableViews,
    useWidgetLib,
    useViewUpdater,
    useTutorial,
    useWindowSize,
} from "src/api/hooks";
import useMousePosition from "src/api/hooks/useMousePosition";
import {
    removeWidgetFromView,
    removeWidgetStateFromCache,
    selectIsMinimised,
    toggleLanguageModal,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { ETutorialTipId, TUserViewWidget } from "src/api/types";
import {
    computeLayoutGrid,
    getDraggedWidget,
    recomputeWidgetsPos,
    getColType,
    EColumnType,
} from "src/api/utils/layoutUtils";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import CONFIG from "src/config/config";
import { AboutUsModalContainer } from "src/containers/AboutUsModalContainer";
import ModuleWrapper from "src/containers/base/ModuleWrapper";
import CookieDisclaimerContainer from "src/containers/cookie-disclaimer/CookieDisclaimerContainer";
import AuthContainer from "src/containers/dialogs/AuthContainer";
import WalletConnectionDialogContainer from "src/containers/dialogs/WalletConnectionDialogContainer";
import KasandraContainer from "src/containers/kasandra/KasandraContainer";
import { LanguageModalContainer } from "src/containers/LanguageModalContainer";
import TutorialContainer from "src/containers/tutorial/TutorialContainer";
import MainLayout from "src/layout/MainLayout";
import { ETemplateNameRegistry } from "src/constants";
import { TTemplateSlug } from "src/types";

const { UI, VIEWS, WIDGETS } = CONFIG;

function BasePage({ isFullsize }: { isFullsize: boolean | undefined }) {
    const dispatch = useAppDispatch();

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

    const { toggleWidgetLib } = useWidgetLib();
    const { currentTutorial, setTutFocusElemRef } = useTutorial();
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const windowSize = useWindowSize();
    const { showTutorial } = useTutorial();

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

    const KasandraWidgetTemplateSlug = `${ETemplateNameRegistry.Kasandra.toLowerCase()}_template`;
    const layoutGrid = useMemo(() => {
        if (selectedView?.data.widgets.length === 0) {
            return undefined;
        }
        return computeLayoutGrid(
            selectedView?.data.widgets.filter(
                (w) => w.widget.template.slug !== KasandraWidgetTemplateSlug
            )
        );
    }, [KasandraWidgetTemplateSlug, selectedView?.data.widgets]);

    const kasandraModuleData = useMemo(() => {
        const widgetData = selectedView?.data.widgets.find(
            (w) => w.widget.template.slug === KasandraWidgetTemplateSlug
        );
        return widgetData;
    }, [KasandraWidgetTemplateSlug, selectedView?.data.widgets]);

    const isKasandraModuleCollapsed = useAppSelector((state) =>
        kasandraModuleData?.hash
            ? selectIsMinimised(kasandraModuleData.hash)(state)
            : false
    );

    /**
     * The current layout state according to the screen size
     * IMPORTANT: checking that layoutGrid.<layout> != null is necessary
     * because an issue after user logout. Namely, views data may not be updated
     * which causes layoutGrid to remain undefined.
     */
    const layoutState = useMemo<TUserViewWidget[][] | undefined>(() => {
        const colType = getColType(windowSize.width);
        if (colType === EColumnType.SingleCol && layoutGrid?.singleCol) {
            return layoutGrid.singleCol;
        }
        if (colType === EColumnType.TwoCol && layoutGrid?.twoCol) {
            return layoutGrid.twoCol;
        }
        if (colType === EColumnType.ThreeCol && layoutGrid?.threeCol) {
            return layoutGrid.threeCol;
        }

        if (layoutGrid?.fourCol) {
            return layoutGrid.fourCol;
        }
        return undefined;
    }, [windowSize.width, layoutGrid]);

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
    const preferredDragTutorialWidget = useMemo(() => {
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

    return (
        <MainLayout
            toggleWidgetLib={toggleWidgetLib}
            toggleLanguageModal={onToggleLanguageModal}
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
                <div className="two-col:grid-cols-2 relative three-col:grid-cols-3 four-col:grid-cols-4 grid w-full grid-cols-1 gap-5 px-4">
                    {kasandraModuleData && (
                        <div className="two-col:grid-cols-2 absolute three-col:grid-cols-3 four-col:grid-cols-4 grid w-full grid-cols-1 gap-5 px-4">
                            <div className="col-span-2">
                                <KasandraContainer
                                    moduleData={kasandraModuleData}
                                    toggleAdjustable={() => {}}
                                />
                            </div>
                        </div>
                    )}
                    {layoutState?.map((widgets, colIndex) => (
                        <Droppable
                            // eslint-disable-next-line react/no-array-index-key
                            key={colIndex.toString()}
                            droppableId={colIndex.toString()}
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        marginTop:
                                            kasandraModuleData &&
                                            (colIndex === 0 || colIndex === 1)
                                                ? `${(((isKasandraModuleCollapsed ? WIDGETS.KASANDRA.COLLAPSED_WIDGET_HEIGHT : WIDGETS.KASANDRA.WIDGET_HEIGHT) as number) || 0) + 14}px`
                                                : "0px",
                                    }}
                                >
                                    {widgets.map((widget, rowIndex) => (
                                        <ModuleWrapper
                                            key={widget.hash}
                                            moduleData={widget}
                                            rowIndex={rowIndex}
                                            colIndex={colIndex}
                                            fullSizeWidgetConfig={
                                                fullSizeWidgetConfig
                                            }
                                            preferredDragTutorialWidget={
                                                preferredDragTutorialWidget
                                            }
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
            <CookieDisclaimerContainer />
            <AuthContainer />
            <TutorialContainer />
            <WalletConnectionDialogContainer />
            <AboutUsModalContainer />
            <LanguageModalContainer />
        </MainLayout>
    );
}

export default memo(BasePage);
