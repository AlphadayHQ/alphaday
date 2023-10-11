import { FC, memo } from "react";
import { Dialog, ErrorModal } from "@alphaday/ui-kit";
import { useWallet, useAccount, useFeatureFlags } from "src/api/hooks";
import { WalletConnectionState, EWalletConnectionMethod } from "src/api/types";
import { ReactComponent as MetamaskSVG } from "src/assets/icons/metamask.svg";
import { ReactComponent as WalletConnectSVG } from "src/assets/icons/wallet-connect.svg";
import type { IDialog } from "src/components/dialog/Dialog";
import WalletConnectionPicker from "src/components/wallet-connection/WalletConnectionPicker";
import { EFeaturesRegistry } from "src/constants";
import globalMessages from "src/globalMessages";

type TPropsDict = Partial<
    Record<
        WalletConnectionState,
        Partial<IDialog> & {
            content: React.ReactNode;
        }
    >
>;

const WalletConnectionDialogContainer: FC = memo(() => {
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

    const dialogPropsDict: TPropsDict = {
        [WalletConnectionState.SelectingMethod]: {
            title: "Choose a Wallet Provider",
            onClose: resetWalletConnection,
            content: <WalletConnectionPicker walletButtons={wallets} />,
        },
        [WalletConnectionState.Prompted]: {
            title: "Verify Wallet",
            saveButtonText: "Verify Wallet",
            onSave: verifyWallet,
            onClose: resetWalletVerification,
            buttonProps: {
                title: globalMessages.portfolio.verifyWallet,
            },
            content:
                "Your wallet has been connected successfully. To save your customized boards please login to Alphaday by signing a text message.",
        },
    };
    const errorPropsDict: TPropsDict = {
        [WalletConnectionState.ConnectionError]: {
            title: "Wallet Connection Error",
            onClose: resetWalletConnection,
            content:
                "An error ocurred trying to connect to your wallet provider. Please make sure your wallet is correctly setup.",
        },
        [WalletConnectionState.VerificationError]: {
            title: "Wallet Verification Error",
            onClose: resetWalletVerification,
            content:
                "Authentication failed. Is your wallet unlocked? Have you switched accounts?",
        },
        [WalletConnectionState.GenericError]: {
            title: "Unexpected Error",
            onClose: resetAuthState,
            content: "Oops! Something went wrong. Please try again later.",
        },
    };

    const { content, ...props } = dialogPropsDict[authWallet.status] ?? {};
    const { content: errorContent, ...errorProps } =
        errorPropsDict[authWallet.status] ?? {};

    return (
        <>
            <Dialog
                size="sm"
                showXButton
                showDialog={authWallet.status in dialogPropsDict}
                {...props}
            >
                {content}
            </Dialog>
            <ErrorModal
                size="sm"
                errorMessage={authWallet.error}
                isHidden={!authWallet.error}
                {...errorProps}
            >
                {errorContent}
            </ErrorModal>
        </>
    );
});

export default WalletConnectionDialogContainer;
