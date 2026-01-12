import { FC } from "react";
import { SyncIndicator, EIndicatorState } from "@alphaday/ui-kit";
import { useResolvedView } from "src/api/hooks";
import { RTK_VIEW_CACHE_KEYS } from "src/api/hooks/useView";
import {
    useGetSubscribedViewsQuery,
    useSaveViewMutation,
    useSaveViewAsMutation,
    useDeleteViewMutation,
} from "src/api/services";
import { useAppSelector } from "src/api/store/hooks";

/**
 * SyncIndicatorContainer
 *
 * Monitors the synchronization state of view-related API operations and displays
 * a visual indicator to the user.
 *
 * This container tracks the following operations:
 * - Fetching subscribed views (GET /views/subscribed/)
 * - Resolving views by hash or slug (GET /views/resolve/?slug=SLUG)
 * - Saving existing views (PUT /views/:id/)
 * - Saving new views (POST /views/)
 * - Deleting views (DELETE /views/:id/)
 *
 * The indicator displays three states:
 * - Loading: When any monitored operation is in progress
 * - Error: When any operation fails or when offline
 * - Synced: When all operations are complete and successful
 *
 * Uses RTK Query's fixed cache keys to track mutation states across the application,
 * ensuring the indicator reflects the true state regardless of where operations are triggered.
 */
const SyncIndicatorContainer: FC = () => {
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    const {
        isFetching: isFetchingSubscribedViews,
        isError: isErrorSubscribedViewsRequest,
    } = useGetSubscribedViewsQuery(
        { lang: selectedLangCode },
        {
            skip: !navigator.onLine,
        }
    );

    const { isFetching: isFetchingResolvedView, isError: isErrorResolvedView } =
        useResolvedView();

    const [, { isLoading: isLoadingSaveView, isError: isErrorSaveView }] =
        useSaveViewMutation({
            fixedCacheKey: RTK_VIEW_CACHE_KEYS.SAVE_VIEW,
        });

    const [, { isLoading: isLoadingSaveViewAs, isError: isErrorSaveViewAs }] =
        useSaveViewAsMutation({
            fixedCacheKey: RTK_VIEW_CACHE_KEYS.SAVE_VIEW,
        });

    const [, { isLoading: isLoadingDeleteView, isError: isErrorDeleteView }] =
        useDeleteViewMutation({
            fixedCacheKey: RTK_VIEW_CACHE_KEYS.DELETE_VIEW,
        });

    const isError =
        isErrorSubscribedViewsRequest ||
        isErrorResolvedView ||
        isErrorSaveView ||
        isErrorSaveViewAs ||
        isErrorDeleteView;

    const isSyncing =
        isFetchingSubscribedViews ||
        isFetchingResolvedView ||
        isLoadingSaveView ||
        isLoadingSaveViewAs ||
        isLoadingDeleteView;

    const state = (() => {
        if (isError || !navigator.onLine) {
            return EIndicatorState.error;
        }
        if (isSyncing) return EIndicatorState.loading;
        return EIndicatorState.synced;
    })();

    return <SyncIndicator state={state} />;
};

export default SyncIndicatorContainer;
