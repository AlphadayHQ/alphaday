import { useRef } from "react";
import { TRemoteProfile, useGetUserProfileQuery } from "src/api/services";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { TAuthWallet, TUserProfile } from "src/api/types";
import CONFIG from "src/config/config";
import { EFeaturesRegistry } from "src/constants";
import { useFeatureFlags } from "./useFeatureFlags";

const pollingInterval = CONFIG.USER.POLLING_INTERVAL * 1000;

interface IAccount {
    /**
     * The wallet that is currently logged in.
     */
    authWallet: TAuthWallet;
    /**
     * Whether or not the user is authenticated.
     */
    isAuthenticated: boolean;
    /**
     * Whether or not the user is a staff member.
     */
    isStaff: boolean;
    /**
     * Resets the auth state.
     */
    resetAuthState: () => void;
    /**
     * remove auth token but keep portfolio accounts
     */
    cleanAuthState: () => void;
    /**
     * Whether or not the account has smart tags.
     */
    accountHasSmartTags: boolean;
    /**
     * Whether or not the account smart tags have been updated.
     */
    accountSmartTagsUpdated: boolean;
    userProfile: TUserProfile | undefined;
}

/**
 * Hook to get account information
 * Accounts on alphaday information are stored in the redux store.
 * This hook will return the account information from the redux store.
 */
export const useAccount: () => IAccount = () => {
    const dispatch = useAppDispatch();
    const authWallet = useAppSelector(userStore.selectAuthWallet);
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);
    const remoteProfileRef = useRef<TRemoteProfile>();
    const localProfile = remoteProfileRef.current;
    const isWalletBoardAllowed = useFeatureFlags(EFeaturesRegistry.WalletBoard);

    /**
     * Fetch the remote profile if the user is authenticated.
     * Poll for updates when the profile is authenticated but the smartTags have not been added.
     */
    const { currentData: remoteProfile } = useGetUserProfileQuery(undefined, {
        skip: !isAuthenticated,
        refetchOnMountOrArgChange: true,
        pollingInterval:
            isWalletBoardAllowed &&
            isAuthenticated &&
            localProfile?.smart_tags_last_updated === null
                ? pollingInterval
                : undefined,
    });

    const accountHasSmartTags = localProfile?.smart_tags?.length !== 0;
    const accountSmartTagsUpdated =
        localProfile?.smart_tags_last_updated !== null;

    const isStaff = localProfile?.user.is_staff ?? false;

    const resetAuthState = () => {
        dispatch(userStore.resetAuthState());
    };

    // remove auth token but keep portfolio accounts
    const cleanAuthState = () => {
        dispatch(userStore.setSelectedPortfolioAccount(null));
        dispatch(userStore.setAuthToken(undefined));
    };

    if (isAuthenticated && remoteProfile?.id !== undefined) {
        remoteProfileRef.current = remoteProfile;
    }
    if (!isAuthenticated) {
        remoteProfileRef.current = undefined;
    }

    return {
        authWallet,
        isAuthenticated,
        isStaff,
        resetAuthState,
        accountHasSmartTags,
        accountSmartTagsUpdated,
        userProfile: localProfile,
        cleanAuthState,
    };
};
