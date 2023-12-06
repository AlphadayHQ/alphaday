import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import {
    useView,
    usePagination,
    useKeyPress,
    useViewRoute,
} from "src/api/hooks";
import {
    EItemsSortBy,
    TRemoteUserViewPreview,
    useGetSubscribedViewsQuery,
    useGetViewCategoriesQuery,
    useGetViewsQuery,
    useSubscribeViewMutation,
    useUnsubscribeViewMutation,
} from "src/api/services";
import { useAppSelector } from "src/api/store/hooks";
import { useWalletViewContext } from "src/api/store/providers/wallet-view-context";
import * as userStore from "src/api/store/slices/user";
import { TViewMeta } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { buildViewPath } from "src/api/utils/viewUtils";
import BoardsLibrary from "src/components/board-library/BoardsLibrary";
import CONFIG from "src/config/config";

interface IProps {
    isBoardsLibOpen: boolean;
    onToggleBoardsLib: () => void;
    onCreateNewView: () => void;
    onEditView: (viewId: number, viewHash: string) => void;
}

const INITIAL_PAGE = 1;

const BoardsLibraryContainer: FC<IProps> = ({
    isBoardsLibOpen,
    onToggleBoardsLib,
    onCreateNewView,
    onEditView,
}) => {
    const history = useHistory();

    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >();
    const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
    const [sortBy, setSortBy] = useState(EItemsSortBy.Name);

    const { routeInfo, pathContainsHashOrSlug } = useViewRoute();

    const { removeView, selectedView, removeViewFromCache, subscribedViews } =
        useView();

    const { setAllowFetchWalletView } = useWalletViewContext();

    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const { data: categories } = useGetViewCategoriesQuery();
    const { currentData: remoteSubscribedViews } = useGetSubscribedViewsQuery();

    const {
        data: viewsDataResponse,
        isSuccess,
        isFetching,
    } = useGetViewsQuery({
        limit: CONFIG.UI.BOARD_LIBRARY.LIMIT,
        page: currentPage,
        sortBy,
        category: selectedCategory,
    });

    const [allViews, setAllViews] = useState<TRemoteUserViewPreview[]>([]);

    // shallow copy necessary because response is read-only
    const viewsDataForCurrentPage = useMemo(
        () => [...(viewsDataResponse?.results ?? [])],
        [viewsDataResponse?.results]
    );
    const prevViewsDataRef = useRef<TRemoteUserViewPreview[]>();

    // if the current response changes, it means the user scrolled down
    // and a request for the next page has completed
    // In this case, we append the new data.
    // When user subscribed/unsubscribed from a view, the response may include
    // items that were already in a previous response, so we need to handle this
    // as well.
    if (
        viewsDataResponse?.results !== undefined &&
        prevViewsDataRef.current !== viewsDataForCurrentPage
    ) {
        setAllViews((prevState) => {
            const updatedViewArray = [...prevState];
            viewsDataForCurrentPage.forEach((updatedView) => {
                const existingViewIdx = prevState.findIndex(
                    (existingView) => existingView.id === updatedView.id
                );
                if (existingViewIdx !== -1) {
                    updatedViewArray[existingViewIdx] = {
                        ...updatedViewArray[existingViewIdx],
                        ...updatedView,
                    };
                } else {
                    updatedViewArray.push(updatedView);
                }
            });
            return updatedViewArray;
        });
        prevViewsDataRef.current = viewsDataForCurrentPage;
    }

    const [subscribeViewMut] = useSubscribeViewMutation();
    const [unsubscribeViewMut] = useUnsubscribeViewMutation();

    const handleRemoveView = useCallback(
        (removeViewRequest: TViewMeta) => {
            removeView(removeViewRequest);
            if (removeViewRequest.isWalletView) {
                setAllowFetchWalletView(false);
            }
        },
        [removeView, setAllowFetchWalletView]
    );

    const handleSelectView = useCallback(
        (viewId: number) => {
            const view = allViews.find((v) => v.id === viewId);
            if (view === undefined) {
                // this should never happen
                Logger.error(
                    "BoardsLibraryContainer::handleSelectView failed to find view with id:",
                    viewId
                );
                return;
            }
            history.push(buildViewPath(view));
        },
        [allViews, history]
    );

    const handleSubscribe = useCallback(
        (viewId: number) => {
            Logger.debug(
                "BoardsLibraryContainer::handleSubscribe called on view:",
                viewId
            );
            subscribeViewMut({ id: viewId })
                .unwrap()
                .then((r) => {
                    Logger.debug(
                        "BoardsLibraryContainer::handleSubscribe success",
                        r
                    );
                    toast("Your board preferences have been updated.");
                })
                .catch((e) => {
                    Logger.error(
                        "BoardsLibraryContainer::handleSubscribe failed",
                        e
                    );
                    toast(
                        "Your board preferences could not be updated. Please try again later.",
                        {
                            type: EToastRole.Error,
                        }
                    );
                });
        },
        [subscribeViewMut]
    );

    const handleUnsubscribe = useCallback(
        (viewId: number) => {
            Logger.debug(
                "BoardsLibraryContainer::handleUnsubscribe called on view:",
                viewId
            );
            if (subscribedViews === undefined) {
                Logger.error(
                    "BoardsLibraryContainer::handleUnsubscribe failed to find view with id:",
                    viewId
                );
                return;
            }
            const [view] = subscribedViews.filter((v) => v.data.id === viewId);
            unsubscribeViewMut({ id: viewId })
                .unwrap()
                .then((r) => {
                    removeViewFromCache(viewId);
                    if (
                        pathContainsHashOrSlug &&
                        [view.data.hash, view.data.slug].indexOf(
                            routeInfo?.value
                        ) !== -1
                    ) {
                        history.push("/");
                    }
                    Logger.debug(
                        "BoardsLibraryContainer::handleUnsubscribe success",
                        r
                    );
                    toast("Your board preferences have been updated.");
                })
                .catch((e) => {
                    Logger.error(
                        "BoardsLibraryContainer::handleUnsubscribe failed",
                        e
                    );
                    toast(
                        "Your board preferences could not be updated. Please try again later.",
                        {
                            type: EToastRole.Error,
                        }
                    );
                });
        },
        [
            subscribedViews,
            unsubscribeViewMut,
            removeViewFromCache,
            pathContainsHashOrSlug,
            routeInfo?.value,
            history,
        ]
    );

    const handleSortBy = (sort: EItemsSortBy): void => {
        if (isFetching || sortBy === sort) return;
        if (allViews.length > 0) setAllViews([]);
        if (currentPage !== INITIAL_PAGE) setCurrentPage(INITIAL_PAGE);
        setSortBy(sort);
    };

    const handleCategorySelect = (newCategory: string | undefined): void => {
        if (isFetching || newCategory === selectedCategory) return;
        if (allViews.length > 0) setAllViews([]);
        if (currentPage !== INITIAL_PAGE) setCurrentPage(INITIAL_PAGE);
        setSelectedCategory(newCategory);
    };

    const { nextPage, handleNextPage } = usePagination(
        viewsDataResponse?.links,
        CONFIG.UI.BOARD_LIBRARY.MAX_PAGE_NUMBER,
        isSuccess
    );

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
    useEffect(() => {
        if (nextPage === undefined) return () => null;
        const timeout = setTimeout(() => {
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    useKeyPress({
        targetKey: "Escape",
        callback: onToggleBoardsLib,
        skip: !isBoardsLibOpen,
    });

    return (
        <BoardsLibrary
            selectedCategory={selectedCategory}
            boards={allViews}
            subscribedViews={remoteSubscribedViews}
            categories={categories}
            isBoardsLibOpen={isBoardsLibOpen}
            selectedViewId={selectedView?.data.id}
            onToggleBoardsLib={onToggleBoardsLib}
            onSelectView={handleSelectView}
            onSubscribeView={handleSubscribe}
            onUnsubscribeView={handleUnsubscribe}
            onCategorySelect={handleCategorySelect}
            onCreateEmptyBoard={() => onCreateNewView()}
            sortBy={sortBy}
            onSortBy={handleSortBy}
            handlePaginate={handleNextPage}
            onRemoveView={handleRemoveView}
            onEditView={onEditView}
            isAuthenticated={isAuthenticated}
        />
    );
};

export default BoardsLibraryContainer;
