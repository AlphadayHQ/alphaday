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
    toggleLanguageModal,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { ETutorialTipId } from "src/api/types";
import {
    computeLayoutGrid,
    getDraggedWidget,
    recomputeWidgetsPos,
    getColType,
    EColumnType,
    TWidgetOrPlaceholder,
    isTwoColPlaceholder,
    getWidgetSettings,
} from "src/api/utils/layoutUtils";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { isTwoColWidget } from "src/api/utils/viewUtils";
import CONFIG from "src/config/config";
import { AboutUsModalContainer } from "src/containers/AboutUsModalContainer";
import ModuleWrapper from "src/containers/base/ModuleWrapper";
import CookieDisclaimerContainer from "src/containers/cookie-disclaimer/CookieDisclaimerContainer";
import AuthContainer from "src/containers/dialogs/AuthContainer";
import WalletConnectionDialogContainer from "src/containers/dialogs/WalletConnectionDialogContainer";
import { LanguageModalContainer } from "src/containers/LanguageModalContainer";
import TutorialContainer from "src/containers/tutorial/TutorialContainer";
import MainLayout from "src/layout/MainLayout";
import { TTemplateSlug } from "src/types";

const { UI, VIEWS } = CONFIG;

function BasePage({ isFullSize }: { isFullSize: boolean | undefined }) {
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
            isFullSize
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
        [isFullSize, selectedView?.data.widgets]
    );

    const twoColWidgets = useMemo(() => {
        return selectedView?.data.widgets.filter((w) =>
            isTwoColWidget(w.widget.template.slug)
        );
    }, [selectedView?.data.widgets]);

    const layoutGrid = useMemo(() => {
        const filteredWidgets = selectedView?.data.widgets.filter(
            (widget) => !isTwoColWidget(widget.widget.template.slug)
        );
        return computeLayoutGrid(filteredWidgets, twoColWidgets);
    }, [selectedView?.data.widgets, twoColWidgets]);

    /**
     * The current layout state according to the screen size
     * IMPORTANT: checking that layoutGrid.<layout> != null is necessary
     * because an issue after user logout. Namely, views data may not be updated
     * which causes layoutGrid to remain undefined.
     */
    const layoutState = useMemo<TWidgetOrPlaceholder[][] | undefined>(() => {
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
            currLayoutState: TWidgetOrPlaceholder[][] | undefined
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

            // Prevent dropping widgets into two-column widget positions
            if (twoColWidgets && twoColWidgets.length > 0) {
                const colType = getColType(windowSize.width);
                const isTwoColLayout =
                    colType === EColumnType.TwoCol ||
                    colType === EColumnType.ThreeCol ||
                    colType === EColumnType.FourCol;
                const destinationWidget =
                    currLayoutState[destPos.col][destPos.row];

                let isDestTwoColWidget = false;
                if (destinationWidget) {
                    if (isTwoColPlaceholder(destinationWidget)) {
                        isDestTwoColWidget = isTwoColWidget(
                            destinationWidget.twoColWidget.widget.template.slug
                        );
                    } else {
                        isDestTwoColWidget = isTwoColWidget(
                            destinationWidget.widget.template.slug
                        );
                    }
                }

                // prevent dropping into two col widget
                if (destinationWidget && isTwoColLayout && isDestTwoColWidget) {
                    return;
                }
            }

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
            const newLayoutState: TWidgetOrPlaceholder[][] = [[]];
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
            twoColWidgets,
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
                    {(() => {
                        const renderedElements: JSX.Element[] = [];
                        const renderedTwoColWidgets = new Set<string>();
                        let twoColWidgetCount = 0;

                        // Calculate how many two-column widgets can fit per row based on screen size
                        const colType = getColType(windowSize.width);
                        const maxTwoColPerRow =
                            colType === EColumnType.FourCol ? 2 : 1; // FourCol can fit 2 two-column widgets

                        // Track two-column widget heights for margin calculation
                        let totalTwoColHeight = 0;

                        // First pass: render all two-column widgets and track their positions
                        layoutState?.forEach((widgets) => {
                            widgets.forEach((widget) => {
                                if (
                                    isTwoColPlaceholder(widget) &&
                                    !renderedTwoColWidgets.has(widget.hash)
                                ) {
                                    const rowIndex = Math.floor(
                                        twoColWidgetCount / maxTwoColPerRow
                                    );
                                    const colPositionInRow =
                                        twoColWidgetCount % maxTwoColPerRow;
                                    const settings =
                                        getWidgetSettings(
                                            widget.twoColWidget.widget.template
                                                .slug
                                        ) ?? {};
                                    const WIDGET_HEIGHT =
                                        "WIDGET_HEIGHT" in settings
                                            ? Number(settings.WIDGET_HEIGHT)
                                            : 500;
                                    const topMargin = rowIndex
                                        ? rowIndex * (WIDGET_HEIGHT + 20) // Add gap between two-col widgets
                                        : 0;

                                    // Calculate total height needed for all two-column widgets
                                    const bottomPosition =
                                        topMargin + WIDGET_HEIGHT + 20;
                                    totalTwoColHeight = Math.max(
                                        totalTwoColHeight,
                                        bottomPosition
                                    );

                                    renderedElements.push(
                                        <div
                                            key={`two-col-${widget.hash}`}
                                            className="two-col:absolute w-full three-col:grid three-col:grid-cols-3 four-col:grid-cols-4"
                                            style={{
                                                top: `${topMargin}px`,
                                                left:
                                                    maxTwoColPerRow > 1 &&
                                                    colPositionInRow === 1
                                                        ? "50%"
                                                        : "0",
                                                width:
                                                    maxTwoColPerRow > 1
                                                        ? "50%"
                                                        : "100%",
                                            }}
                                        >
                                            <div className="two-col:col-span-2 two-col:mx-4">
                                                <ModuleWrapper
                                                    moduleData={
                                                        widget.twoColWidget
                                                    }
                                                    rowIndex={rowIndex}
                                                    colIndex={colPositionInRow}
                                                    fullSizeWidgetConfig={
                                                        fullSizeWidgetConfig
                                                    }
                                                    preferredDragTutorialWidget={
                                                        preferredDragTutorialWidget
                                                    }
                                                />
                                            </div>
                                        </div>
                                    );
                                    renderedTwoColWidgets.add(widget.hash);
                                    twoColWidgetCount += 1;
                                }
                            });
                        });

                        // Second pass: render columns with appropriate margins
                        layoutState?.forEach((widgets, colIndex) => {
                            // Only apply margin in two-column layout where two-col widgets are absolutely positioned
                            // In 3+ column layouts, two-col widgets use CSS grid and don't need margin on normal columns
                            const columnMargin =
                                colType === EColumnType.TwoCol
                                    ? totalTwoColHeight
                                    : 0;

                            renderedElements.push(
                                <Droppable
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`column-${colIndex}`}
                                    droppableId={colIndex.toString()}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="flex flex-col gap-5"
                                            style={{
                                                marginTop: columnMargin,
                                            }}
                                        >
                                            {widgets.map(
                                                (widget, widgetIndex) => {
                                                    if (
                                                        isTwoColPlaceholder(
                                                            widget
                                                        )
                                                    ) {
                                                        return null; // Skip placeholders in columns
                                                    }
                                                    return (
                                                        <ModuleWrapper
                                                            key={widget.hash}
                                                            moduleData={widget}
                                                            rowIndex={Math.floor(
                                                                widgetIndex / 2
                                                            )}
                                                            colIndex={colIndex}
                                                            fullSizeWidgetConfig={
                                                                fullSizeWidgetConfig
                                                            }
                                                            preferredDragTutorialWidget={
                                                                preferredDragTutorialWidget
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            );
                        });

                        return renderedElements;
                    })()}
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
