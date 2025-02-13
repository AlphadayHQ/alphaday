import {
    alphadayApi,
    useGetSubscribedViewsQuery,
    useGetViewForWalletQuery,
} from "src/api/services";
import CONFIG from "src/config/config";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useWalletViewContext } from "../store/providers/wallet-view-context";
import { useAccount } from "./useAccount";

const pollingInterval = CONFIG.USER.POLLING_INTERVAL * 1000;

export const useWalletView: () => void = () => {
    const dispatch = useAppDispatch();
    const { allowFetchWalletView } = useWalletViewContext();
    const selectedLangCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    const {
        data: remoteSubscribedViews,
        isFetching: isFetchingSubscribedViews,
    } = useGetSubscribedViewsQuery({ lang: selectedLangCode });
    const isWalletViewAvailable = remoteSubscribedViews?.some(
        (view) => view.is_smart
    );
    const { isAuthenticated, accountHasSmartTags } = useAccount();

    const { currentData: walletView } = useGetViewForWalletQuery(undefined, {
        skip:
            !isAuthenticated ||
            isWalletViewAvailable ||
            !allowFetchWalletView ||
            !accountHasSmartTags,
        refetchOnMountOrArgChange: true,
        pollingInterval,
    });

    if (
        walletView !== undefined &&
        !isWalletViewAvailable &&
        !isFetchingSubscribedViews
    ) {
        dispatch(alphadayApi.util.invalidateTags(["SubscribedViews", "Views"]));
    }
};
