import { useMemo } from "react";
import { useViewRoute } from "src/api/hooks";
import { useGetViewByHashQuery } from "src/api/services";
import { useAppSelector } from "../store/hooks";
import { useAvailableViews } from "./useAvailableViews";

/**
 * Just a wrapper around useGetViewByHashQuery()
 * @returns RTK query function response
 */
export const useResolvedView = (): ReturnType<typeof useGetViewByHashQuery> => {
    const { routeInfo, pathContainsHashOrSlug, isViewHash } = useViewRoute();
    const availableViews = useAvailableViews();
    const selectedViewId = useAppSelector(
        (state) => state.views.selectedViewId
    );
    const selectedView = availableViews?.find(
        (v) => v.data.id === selectedViewId
    );
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );

    // if the current view hash/slug is already in the views cache, avoid fetching this view data
    const skipViewFetch = useMemo(() => {
        const isViewAvailable =
            routeInfo !== undefined &&
            !!availableViews?.find((v) => v.data.hash === routeInfo.value);
        const isSystemOrSharedView =
            selectedView?.data.is_system_view || selectedView?.isReadOnly;

        return (
            isViewAvailable ||
            // if there's no slug/hash and the selected view is not a system/shared view, we should skip fetch as well
            // this means we would definitely want to fetch if the selected view is a system/shared view
            (!pathContainsHashOrSlug && !isSystemOrSharedView)
        );
    }, [
        routeInfo,
        pathContainsHashOrSlug,
        availableViews,
        selectedView?.data.is_system_view,
        selectedView?.isReadOnly,
    ]);

    return useGetViewByHashQuery(
        {
            lang: selectedLangCode,
            ...(isViewHash
                ? { hash: routeInfo?.value }
                : // if the route is not a hash, it's a slug.
                  // if the route info has no slug, we'll use the selected view slug
                  // this should pose no issues if the selected view is not a system view
                  // and should work as expected if the selected view is a system view
                  { slug: routeInfo?.value ?? selectedView?.data.slug }),
        },
        {
            skip: skipViewFetch,
        }
    );
};

export default useResolvedView;
