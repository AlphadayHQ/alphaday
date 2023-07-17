import {
    createContext,
    FC,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { EWalletViewState } from "src/api/types";
import { toast } from "src/api/utils/toastUtils";

function useWalletViewProviderValue() {
    // Why this should be a state and not a ref https://reactjs.org/docs/refs-and-the-dom.html
    const [allowFetchWalletView, setAllowFetchWalletView] = useState(false);
    const [walletViewState, setWalletViewState] = useState(
        EWalletViewState.Disabled
    );

    const walletViewStateRef = useRef<EWalletViewState>();

    useEffect(() => {
        if (
            allowFetchWalletView &&
            walletViewStateRef.current !== walletViewState
        ) {
            if (walletViewState === EWalletViewState.Ready) {
                toast("Your wallet board is ready", {
                    status: "alert",
                });
            }
            if (walletViewState === EWalletViewState.NoTags) {
                toast("Your wallet seems empty", {
                    status: "alert",
                });
            }
            if (walletViewState === EWalletViewState.Fetching) {
                toast("Fetching your wallet board", {
                    status: "alert",
                });
            }
        }

        walletViewStateRef.current = walletViewState;
    }, [allowFetchWalletView, walletViewState]);

    const value = useMemo(
        () => ({
            allowFetchWalletView,
            setAllowFetchWalletView,
            walletViewState,
            setWalletViewState,
        }),
        [allowFetchWalletView, walletViewState]
    );
    return value;
}

type Context = ReturnType<typeof useWalletViewProviderValue>;

const WalletViewContext = createContext<Context | undefined>(undefined);

export const WalletViewProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const value = useWalletViewProviderValue();
    return (
        <WalletViewContext.Provider value={value}>
            {children}
        </WalletViewContext.Provider>
    );
};

export const useWalletViewContext = (): Context => {
    const context = useContext(WalletViewContext);
    if (context === undefined) {
        throw new Error(
            "wallet-view-context:useWalletViewContext: useContext must be used within a Provider"
        );
    }
    return context;
};
