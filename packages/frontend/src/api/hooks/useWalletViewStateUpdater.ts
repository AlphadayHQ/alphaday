import { EFeaturesRegistry } from "src/constants";
import { useWalletViewContext } from "../store/providers/wallet-view-context";
import { EWalletViewState } from "../types";
import { useAccount } from "./useAccount";
import { useFeatureFlags } from "./useFeatureFlags";
import { useView } from "./useView";

export const useWalletViewStateUpdater: () => EWalletViewState = () => {
    const { isAuthenticated, accountHasSmartTags, accountSmartTagsUpdated } =
        useAccount();
    const { subscribedViews } = useView();
    const isWalletBoardAllowed = useFeatureFlags(EFeaturesRegistry.WalletBoard);

    const { allowFetchWalletView, walletViewState, setWalletViewState } =
        useWalletViewContext();

    if (isAuthenticated && isWalletBoardAllowed) {
        if (subscribedViews?.some((view) => view.data.is_smart)) {
            setWalletViewState(EWalletViewState.Ready);
        } else if (accountSmartTagsUpdated && !accountHasSmartTags) {
            setWalletViewState(EWalletViewState.NoTags);
        } else if (allowFetchWalletView) {
            setWalletViewState(EWalletViewState.Fetching);
        } else setWalletViewState(EWalletViewState.Authenticated);
    } else {
        setWalletViewState(EWalletViewState.Disabled);
    }

    return walletViewState;
};
