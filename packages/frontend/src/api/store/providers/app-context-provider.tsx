import { FC } from "react";
import { ChatProvider } from "./chat-context";
import { DimensionsProvider } from "./dimensions-context";
import { TutorialProvider } from "./tutorial-context";
import { WalletViewProvider } from "./wallet-view-context";

interface Props {
    components: Array<
        React.JSXElementConstructor<React.PropsWithChildren<unknown>>
    >;
    children: React.ReactNode;
}

function Compose(props: Props) {
    const { components = [], children } = props;

    return (
        <>
            {components.reduceRight((acc, Comp) => {
                return <Comp>{acc}</Comp>;
            }, children)}
        </>
    );
}

export const AppContextProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => (
    <Compose
        components={[
            TutorialProvider,
            DimensionsProvider,
            ChatProvider,
            WalletViewProvider,
        ]}
    >
        {children}
    </Compose>
);
