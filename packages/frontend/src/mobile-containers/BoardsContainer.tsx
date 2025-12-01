import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useView, usePagination, useViewRoute } from "src/api/hooks";
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
import { getSortOptionValue } from "src/api/utils/sortOptions";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { buildViewPath } from "src/api/utils/viewUtils";
import CONFIG from "src/config/config";
import MobileBoardsList from "src/mobile-components/MobileBoardsList";

const INITIAL_PAGE = 1;

const BoardsContainer: FC = () => {
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
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );

    const { data: categories } = useGetViewCategoriesQuery();
    const { currentData: remoteSubscribedViews } = useGetSubscribedViewsQuery({
        lang: selectedLangCode,
    });

    const {
        data: viewsDataResponse,
        isSuccess,
        isFetching,
    } = useGetViewsQuery({
        limit: CONFIG.UI.BOARD_LIBRARY.LIMIT,
        page: currentPage,
        sortBy,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        lang: selectedLangCode,
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
                    "BoardsContainer::handleSelectView failed to find view with id:",
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
                "BoardsContainer::handleSubscribe called on view:",
                viewId
            );
            subscribeViewMut({ id: viewId })
                .unwrap()
                .then((r) => {
                    Logger.debug("BoardsContainer::handleSubscribe success", r);
                    toast("Your board preferences have been updated.");
                })
                .catch((e) => {
                    Logger.error("BoardsContainer::handleSubscribe failed", e);
                    toast(
                        "You have reached the limit to pinned boards, please unpin some boards to pin others.",
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
                "BoardsContainer::handleUnsubscribe called on view:",
                viewId
            );
            if (subscribedViews === undefined) {
                Logger.error(
                    "BoardsContainer::handleUnsubscribe failed to find view with id:",
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
                        "BoardsContainer::handleUnsubscribe success",
                        r
                    );
                    toast("Your board preferences have been updated.");
                })
                .catch((e) => {
                    Logger.error(
                        "BoardsContainer::handleUnsubscribe failed",
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

    const handleSortBy = (sortValue: string): void => {
        const sort = getSortOptionValue(sortValue);
        if (isFetching || sort === null || sortBy === sort) return;
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

    const handleCreateBoard = useCallback(() => {
        if (isAuthenticated) {
            // Navigate to create a new board - this will be handled by the desktop flow
            toast("Board creation is available on desktop", {
                type: EToastRole.Error,
            });
        } else {
            toast("Sign up to create custom boards", {
                type: EToastRole.Error,
            });
        }
    }, [isAuthenticated]);

    const handleEditView = useCallback(
        (_viewId: number, viewHash: string) => {
            // Navigate to the board in edit mode
            history.push(`/b/${viewHash}?edit=true`);
        },
        [history]
    );

    return (
        <MobileBoardsList
            selectedCategory={selectedCategory}
            boards={allViews}
            subscribedViews={remoteSubscribedViews}
            categories={categories}
            selectedViewId={selectedView?.data.id}
            onSelectView={handleSelectView}
            onSubscribeView={handleSubscribe}
            onUnsubscribeView={handleUnsubscribe}
            onCategorySelect={handleCategorySelect}
            onCreateEmptyBoard={handleCreateBoard}
            sortBy={sortBy}
            onSortBy={handleSortBy}
            handlePaginate={handleNextPage}
            onRemoveView={handleRemoveView}
            onEditView={handleEditView}
            isAuthenticated={isAuthenticated}
            isFetching={isFetching}
        />
    );
};

export default BoardsContainer;
