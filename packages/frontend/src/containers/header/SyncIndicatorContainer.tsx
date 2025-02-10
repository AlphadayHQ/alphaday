import { FC } from "react";
import { SyncIndicator, EIndicatorState } from "@alphaday/ui-kit";
import { RTK_VIEW_CACHE_KEYS } from "src/api/hooks/useView";
import {
    useGetSubscribedViewsQuery,
    useSaveViewMutation,
    useSaveViewAsMutation,
    useDeleteViewMutation,
} from "src/api/services";
import { useAppSelector } from "src/api/store/hooks";

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
        isErrorSaveView ||
        isErrorSaveViewAs ||
        isErrorDeleteView;

    const isSyncing =
        isFetchingSubscribedViews ||
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
