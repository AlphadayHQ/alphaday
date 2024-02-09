/**
 *
 * Add here any logic that needs to be executed during app initialization
 *
 */
import {
    useGetFeaturesQuery,
    useGetSubscribedViewsQuery,
} from "src/api/services";

export const useAppInit: () => void = () => {
    /**
     * Fetch the features on app load, then we rely on redux cache to
     * ensure subsequent calls are cached.
     */
    useGetFeaturesQuery();
    useGetSubscribedViewsQuery();
};
