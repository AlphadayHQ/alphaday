/**
 *
 * Add here any logic that needs to be executed during app initialization
 *
 */
import {
    useGetFeaturesQuery,
    useGetSubscribedViewsQuery,
} from "src/api/services";
import * as userStore from "src/api/store/slices/user";
import { useAppDispatch } from "../store/hooks";
import { getRtkErrorCode } from "../utils/errorHandling";
import { Logger } from "../utils/logging";
import { usePreferredLanguage } from "./usePreferredLanguage";

export const useAppInit = () => {
    const dispatch = useAppDispatch();
    usePreferredLanguage();

    /**
     * Fetch the features on app load, then we rely on redux cache to
     * ensure subsequent calls are cached.
     */
    const { error } = useGetFeaturesQuery();
    useGetSubscribedViewsQuery();

    if (getRtkErrorCode(error) === 401) {
        /**
         * If the status check or the subscribed views endpoint gives a 401 unauthorized error,
         * we need to reset the auth state and reload the app
         */
        Logger.debug("App::AppRoutes: 401 received");
        dispatch(userStore.resetAuthState());
        location.reload();
    }
};
