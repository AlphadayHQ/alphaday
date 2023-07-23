import { FC } from "react";
import { ChatProvider } from "./chat-context";
import { DimensionsProvider } from "./dimensions-context";
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

    return (

            providers.reduceRight((childComponent, Provider) => {
                return <Provider>{childComponent}</Provider>;
            }, children)

    );
}

export const AppContextProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => (
    <Compose
        providers={[
            TutorialProvider,
            DimensionsProvider,
            ChatProvider,
            WalletViewProvider,
        ]}
    >
        {children}
    </Compose>
);
