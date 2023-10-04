import { FC } from "react";
import { Dialog, ErrorModal } from "@alphaday/ui-kit";
import { useWallet, useAccount, useFeatureFlags } from "src/api/hooks";
import { WalletConnectionState, EWalletConnectionMethod } from "src/api/types";
import { ReactComponent as MetamaskSVG } from "src/assets/icons/metamask.svg";
import { ReactComponent as WalletConnectSVG } from "src/assets/icons/wallet-connect.svg";
import WalletConnectionPicker from "src/components/wallet-connection/WalletConnectionPicker";
import { EFeaturesRegistry } from "src/constants";
import globalMessages from "src/globalMessages";

const WalletConnectionDialogContainer: FC = () => {
    const { authWallet, resetAuthState } = useAccount();
    const isWalletConnectFeatureAllowed = useFeatureFlags(
        EFeaturesRegistry.WalletConnect
    );

    const {
        connectWallet,
        verifyWallet,
        resetWalletConnection,
        resetWalletVerification,
    } = useWallet();

    const onConnect = (method: EWalletConnectionMethod) => () =>
        connectWallet(method);

    const wallets = [
        {
            id: "wallet-connect",
            onClick: onConnect(EWalletConnectionMethod.WalletConnect),
            disabled: !isWalletConnectFeatureAllowed,
            title: `Wallet Connect ${
                isWalletConnectFeatureAllowed ? "" : "(soon)"
            }`,
            icon: WalletConnectSVG,
        },
        {
            id: "metamask",
            onClick: onConnect(EWalletConnectionMethod.Metamask),
            title: `Metamask`,
            icon: MetamaskSVG,
        },
    ];

    switch (authWallet.status) {
        case WalletConnectionState.SelectingMethod:
            return (
                <Dialog
                    title="Choose a Wallet Provider"
                    onClose={resetWalletConnection}
                    showXButton
                    showDialog
                    size="sm"
                >
                    <WalletConnectionPicker walletButtons={wallets} />
                </Dialog>
            );
        case WalletConnectionState.ConnectionError:
            return (
                <ErrorModal
                    title="Wallet Connection Error"
                    onClose={resetWalletConnection}
                    errorMessage={authWallet.error}
                    size="sm"
                >
                    An error ocurred trying to connect to your wallet provider.
                    Please make sure your wallet is correctly setup.
                </ErrorModal>
            );
        case WalletConnectionState.VerificationError:
            return (
                <ErrorModal
                    title="Wallet Verification Error"
                    onClose={resetWalletVerification}
                    errorMessage={authWallet.error}
                    size="sm"
                >
                    Authentication failed. Is your wallet unlocked? Have you
                    switched accounts?
                </ErrorModal>
            );
        // we can have this state handle future prompts as well
        case WalletConnectionState.Prompted:
            return (
                <Dialog
                    title="Verify Wallet"
                    onClose={resetWalletVerification}
                    onSave={verifyWallet}
                    saveButtonText="Verify Wallet"
                    buttonProps={{
                        title: globalMessages.portfolio.verifyWallet,
                    }}
                    showXButton
                    showDialog
                    size="sm"
                >
                    <p>
                        Your wallet has been connected successfully. To save
                        your customized boards please login to Alphaday by
                        signing a text message.
                    </p>
                </Dialog>
            );
        case WalletConnectionState.GenericError:
            return (
                <ErrorModal
                    title="Unexpected Error"
                    onClose={resetAuthState}
                    errorMessage={authWallet.error}
                    size="sm"
                >
                    Oops! Something went wrong. Please try again later.
                </ErrorModal>
            );
        default:
            return null;
    }
};

export default WalletConnectionDialogContainer;
