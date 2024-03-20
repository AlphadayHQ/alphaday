import { useGetFeaturesQuery } from "src/api/services";
import { useAppSelector } from "src/api/store/hooks";
import { selectIsAuthenticated } from "src/api/store/slices/user";
import { EFeatureStatus, EFeaturesRegistry } from "src/constants";

interface IFeatureFlag {
    /**
     * true if the feature is allowed for the current user/guest
     */
    enabled: boolean;
    isLoading: boolean;
}

/**
 * This hook checks if a feature is allowed for the current user/guest.
 * It relies on a notion that the list of features fetched from the backend contains a list of enabled features.
 * If the feature is not found in the list or if status is disabled, it is considered disabled.
 *
 * @param featureId - feature id to check
 * @returns IFeatureFlag
 */
export const useFeatureFlags = (
    featureId?: EFeaturesRegistry
): IFeatureFlag => {
    // this should only return cached results from the initial load
    const { data, isLoading } = useGetFeaturesQuery();
    const feature = data?.find((f) => f.slug === featureId);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    // should we allow guest/unauthenticated users to access this feature?
    const shouldGuestHaveAccess = feature?.status === EFeatureStatus.Enabled;

    // should we allow authenticated users to access this feature?
    const shouldUserHaveAccess =
        (feature?.status === EFeatureStatus.Restricted ||
            feature?.status === EFeatureStatus.Protected) &&
        isAuthenticated;

    return {
        enabled: shouldGuestHaveAccess || shouldUserHaveAccess,
        isLoading,
    };
};
