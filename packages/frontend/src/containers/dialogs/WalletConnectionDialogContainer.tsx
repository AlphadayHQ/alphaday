import { FC, memo } from "react";
import { Dialog, ErrorModal } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    useWallet,
    useAccount,
    useFeatureFlags,
    useActivityLogger,
    useKeyPress,
} from "src/api/hooks";
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
    const { t } = useTranslation();

    const { authWallet, resetAuthState } = useAccount();
    const { enabled: isWalletConnectFeatureAllowed } = useFeatureFlags(
        EFeaturesRegistry.WalletConnect
    );
    const { logWalletConnection } = useActivityLogger();

    const {
        connectWallet,
        verifyWallet,
        resetWalletConnection,
        resetWalletVerification,
    } = useWallet();

    const onConnect = (method: EWalletConnectionMethod) => () => {
        logWalletConnection(method);
        return connectWallet(method);
    };
    const translate = (key: string) => {
        return t(`portfolio.${key}`);
    };

    const wallets = [
        {
            id: "wallet-connect",
            onClick: onConnect(EWalletConnectionMethod.WalletConnect),
            disabled: !isWalletConnectFeatureAllowed,
            title: `${translate("modals.title")} ${
                isWalletConnectFeatureAllowed ? "" : translate("modals.soon")
            }`,
            icon: WalletConnectSVG,
        },
        {
            id: "metamask",
            onClick: onConnect(EWalletConnectionMethod.Metamask),
            title: translate("modals.metamask"),
            icon: MetamaskSVG,
        },
    ];

    const dialogPropsDict: TPropsDict = {
        [WalletConnectionState.SelectingMethod]: {
            title: translate("modals.selectingMethod.title"),
            onClose: resetWalletConnection,
            content: <WalletConnectionPicker walletButtons={wallets} />,
        },
        [WalletConnectionState.Prompted]: {
            title: translate("modals.prompted.title"),
            saveButtonText: translate("modals.prompted.saveButtonText"),
            onSave: verifyWallet,
            onClose: resetWalletVerification,
            buttonProps: {
                title: globalMessages.portfolio.verifyWallet,
            },
            content: translate("modals.prompted.content"),
        },
    };

    const errorPropsDict: TPropsDict = {
        [WalletConnectionState.ConnectionError]: {
            title: translate("modals.connectionError.title"),
            onClose: resetWalletConnection,
            content: translate("modals.connectionError.content"),
        },
        [WalletConnectionState.VerificationError]: {
            title: translate("modals.verificationError.title"),
            onClose: resetWalletVerification,
            content: translate("modals.verificationError.content"),
        },
        [WalletConnectionState.GenericError]: {
            title: translate("modals.genericError.title"),
            onClose: resetAuthState,
            content: translate("modals.genericError.content"),
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
                useKeyPress={
                    WalletConnectionState.Prompted ? useKeyPress : undefined
                }
                {...props}
            >
                {content}
            </Dialog>
            <ErrorModal
                size="sm"
                errorMessage={authWallet.error}
                isHidden={!(authWallet.status in errorPropsDict)}
                {...errorProps}
            >
                {errorContent}
            </ErrorModal>
        </>
    );
});

export default WalletConnectionDialogContainer;
