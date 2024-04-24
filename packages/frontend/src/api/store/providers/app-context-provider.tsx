import { FC } from "react";
import { ChatProvider } from "./chat-context";
import ControlledModalProvider from "./controlled-modal-provider";
import { DimensionsProvider } from "./dimensions-context";
import { OauthProvider } from "./oauth-provider";
import { PWAInstallProvider } from "./pwa-install-provider";
import { TutorialProvider } from "./tutorial-context";
import { WalletViewProvider } from "./wallet-view-context";

interface Props {
    providers: Array<
        React.JSXElementConstructor<React.PropsWithChildren<unknown>>
    >;
    children: React.ReactNode;
}

function Compose(props: Props) {
    const { providers = [], children } = props;

    return providers.reduceRight((childComponent, Provider) => {
        return <Provider>{childComponent}</Provider>;
    }, children);
}

const providers = [
    PWAInstallProvider,
    TutorialProvider,
    DimensionsProvider,
    ChatProvider,
    WalletViewProvider,
    OauthProvider,
    ControlledModalProvider,
];

export const AppContextProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => <Compose providers={providers}>{children}</Compose>;
