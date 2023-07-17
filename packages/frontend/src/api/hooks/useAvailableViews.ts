import { useMemo } from "react";
import * as viewsStore from "src/api/store/slices/views";
import { useAppSelector } from "../store/hooks";

/**
 * A list of all the views that are available to the user.
 * This includes system/owned(custom), and shared views(views user visited).
 * This list is not sorted and it is stored in cache. It is updated when new views are created or deleted.
 * @returns availableViews: ReadonlyArray<TCachedView> | undefined;
 */
export const useAvailableViews = () => {
    const userAndSharedViewsCache = useAppSelector(
        viewsStore.userAndSharedViewsCacheSelector
    );

    // note: availableViews also contains views that have been shared to
    // the user!
    return useMemo(
        () =>
            userAndSharedViewsCache
                ? Object.values(userAndSharedViewsCache)
                : undefined,
        [userAndSharedViewsCache]
    );
};
