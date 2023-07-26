import { EWalletViewState } from "../types";
import { EToastRole, toast } from "./toastUtils";

export const getWalletViewStateMessages = (state: EWalletViewState) => {
    return {
        [EWalletViewState.Ready]: "Board personalised for your wallet.",
        [EWalletViewState.Fetching]:
            "Creating a board personalised for your wallet.",
        [EWalletViewState.NoTags]: "Your wallet seems empty",
        [EWalletViewState.Authenticated]:
            "Create a board personalised for your wallet.",
        [EWalletViewState.Disabled]:
            "Connect and verify your wallet to create a personalised board for your wallet.",
    }[state];
};

export const onClickDisabled = () => {
    toast("Connect and verify your wallet to create/view your wallet board", {
        type: EToastRole.Error,
        status: "alert",
    });
};

export const onClickNoTags = () => {
    toast(
        "Your wallet seems empty. You'll need some assets in your wallet to create this board",
        {
            type: EToastRole.Error,
            status: "alert",
        }
    );
};
