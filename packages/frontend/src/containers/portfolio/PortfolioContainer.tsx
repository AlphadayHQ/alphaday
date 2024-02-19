import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
    useWallet,
    usePortfolioAccount,
    useAccount,
    useWidgetHeight,
} from "src/api/hooks";
import {
    useResolveEnsQuery,
    useGetNftBalanceForAddressesQuery,
    TNftBalanceForAddress,
    computeNftAssetTotal,
    useGetMarketDataQuery,
    useGetBalancesQuery,
} from "src/api/services";
import {
    toggleShowBalance as toggleShowBalanceInStore,
    toggleShowAllAssets as toggleShowAllAssetsInStore,
    selectShowAllAssets,
    setWidgetHeight,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import {
    EWalletConnectionMethod,
    TPortfolio,
    WalletConnectionState,
} from "src/api/types";
import {
    mapAccountsToAddressArray,
    validateENSAddr,
    mapAccountToTabAccount,
} from "src/api/utils/accountUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import PortfolioModule from "src/components/portfolio/PortfolioModule";
import {
    EPortfolioType,
    TPortfolioDataForAddress,
} from "src/components/portfolio/types";
import CONFIG from "src/config";
import { IModuleContainer } from "src/types";

// this is set to `10` as a requirement to be fulfilled for BE to load and cache the portfolio data
const PORTFOLIO_DATA_WAIT_TIME = 10_000; // 10 seconds

const computeAssetTotal: (a: TPortfolio[] | null) => number = (a) => {
    return a?.reduce((prev, cur) => prev + cur.token.balanceUSD, 0) ?? 0;
};

const PortfolioContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();

    const { authWallet } = useAccount();
    const { openWalletConnectionDialog, verifyWallet } = useWallet();
    const {
        portfolioAccounts,
        addPortfolioAccount,
        selectedPortfolioAccount,
        setSelectedPortfolioAccount,
        removePortfolioAccount,
    } = usePortfolioAccount();

    const [balancesQueryFailed, setBalancesQueryFailed] = useState(false);
    const [enteredEnsAddress, setEnteredEnsAddress] = useState<string>("");

    const [portfolioType, setPortfolioType] = useState<EPortfolioType>(
        EPortfolioType.Ft
    );
    const widgetHeight = useWidgetHeight(moduleData);
    const [balancePollingInterval, setBalancePollingInterval] = useState(
        PORTFOLIO_DATA_WAIT_TIME
    );
    const pollIntervalRef = useRef<NodeJS.Timer | null>(null);

    const switchPortfolioType = () =>
        setPortfolioType((prev) =>
            prev === EPortfolioType.Ft ? EPortfolioType.Nft : EPortfolioType.Ft
        );

    const selectedAddress = selectedPortfolioAccount?.address ?? null;

    const accounts = mapAccountToTabAccount(
        portfolioAccounts,
        authWallet.account
    );

    const { showBalance } = useAppSelector((state) => state.ui);
    const toggleBalance = () => {
        dispatch(toggleShowBalanceInStore());
    };

    const showAllAssets = useAppSelector(selectShowAllAssets(moduleData.hash));
    const toggleShowAllAssets = () => {
        dispatch(toggleShowAllAssetsInStore({ widgetHash: moduleData.hash }));
    };

    const { currentData: ensAddressData, isError: isErrorUseResolveEnsQuery } =
        useResolveEnsQuery(
            { ens: enteredEnsAddress },
            { skip: enteredEnsAddress === "" }
        );

    const pollingIntervalLimit =
        (moduleData.widget.refresh_interval ||
            CONFIG.WIDGETS.PORTFOLIO.POLLING_INTERVAL) * 1000;

    const {
        data: tokensBalanceForAddresses,
        isError: isErrorTokensBalanceForAddresses,
        isLoading: isLoadingTokensBalanceForAddresses,
    } = useGetBalancesQuery(
        {
            addresses: mapAccountsToAddressArray(portfolioAccounts),
        },
        {
            skip: portfolioAccounts.length === 0,
            pollingInterval: balancePollingInterval,
            refetchOnMountOrArgChange: true,
        }
    );

    const {
        data: nftBalanceForAddresses,
        isLoading: isLoadingNftBalanceForAddresses,
        isError: isErrorNftBalanceForAddresses,
    } = useGetNftBalanceForAddressesQuery(
        {
            addresses: mapAccountsToAddressArray(
                showAllAssets || selectedPortfolioAccount === null
                    ? portfolioAccounts
                    : [selectedPortfolioAccount]
            ),
        },
        {
            skip: selectedAddress === null,
        }
    );

    const { data: ethPriceResponse, isLoading: isLoadingEthPrice } =
        useGetMarketDataQuery(
            {
                tags: "ethereum",
                limit: 1,
            },
            {
                pollingInterval: pollingIntervalLimit,
            }
        );

    const isConnectingWallet =
        authWallet.status === WalletConnectionState.Connecting;

    const showVerify = authWallet.status === WalletConnectionState.Connected;

    const portfolioDataForAddress =
        tokensBalanceForAddresses !== undefined && selectedAddress
            ? {
                  assets: tokensBalanceForAddresses[selectedAddress] ?? [],
                  totalValue: computeAssetTotal(
                      tokensBalanceForAddresses[selectedAddress]
                  ),
              }
            : undefined;

    const portfolioDataForAddresses = useMemo(() => {
        const balances: TPortfolioDataForAddress = {
            assets: [],
            totalValue: 0,
        };

        if (tokensBalanceForAddresses) {
            Object.keys(tokensBalanceForAddresses).forEach((addr) => {
                balances.assets = [
                    ...balances.assets,
                    ...(tokensBalanceForAddresses[addr] ?? []),
                ];
            });
        }

        balances.totalValue = computeAssetTotal(balances.assets);
        // merge assets with similar address
        balances.assets = balances.assets.reduce((allAssets, curAsset) => {
            const existingAssetIndex = allAssets.findIndex(
                (asset) =>
                    asset.network === curAsset.network &&
                    asset.token.address === curAsset.token.address
            );
            // Update the existing asset if an asset with the same address and network is found
            if (existingAssetIndex !== -1) {
                const assetsCopy = [...allAssets];
                const existingAsset = assetsCopy[existingAssetIndex];
                assetsCopy[existingAssetIndex] = {
                    ...existingAsset,
                    token: {
                        ...existingAsset.token,
                        balance:
                            existingAsset.token.balance +
                            curAsset.token.balance,
                        balanceUSD:
                            existingAsset.token.balanceUSD +
                            curAsset.token.balanceUSD,
                    },
                };
                return assetsCopy;
            }
            return [...allAssets, curAsset];
        }, [] as TPortfolio[]);
        return balances;
    }, [tokensBalanceForAddresses]);

    const portfolioNftDataForAddresses = useMemo(() => {
        const balances: TNftBalanceForAddress = {
            items: [],
            totalValue: 0,
        };

        if (nftBalanceForAddresses) {
            balances.items = [
                ...balances.items,
                ...nftBalanceForAddresses.items,
            ];
        }

        balances.totalValue = computeNftAssetTotal(balances.items);
        return balances;
    }, [nftBalanceForAddresses]);

    useEffect(() => {
        /**
         * This condition will only pass while: tokensBalance.assets is undefined,
         * there is a selected address, and nothing is loading and
         *
         * timeout is reset on rerender
         * */
        let timeout: number | undefined;

        if (
            (selectedAddress &&
                !tokensBalanceForAddresses?.[selectedAddress]) ||
            isErrorTokensBalanceForAddresses
        ) {
            // tokensBalanceForAddresses is undefined at first
            timeout = window.setTimeout(
                () => setBalancesQueryFailed(true),
                PORTFOLIO_DATA_WAIT_TIME
            );
        }
        if (selectedAddress && tokensBalanceForAddresses?.[selectedAddress]) {
            clearTimeout(timeout);
            if (balancesQueryFailed) setBalancesQueryFailed(false);
        }

        return () => {
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isConnectingWallet,
        isLoadingTokensBalanceForAddresses,
        isLoadingEthPrice,
        selectedAddress,
        tokensBalanceForAddresses,
    ]);

    useEffect(() => {
        if (isErrorUseResolveEnsQuery) {
            toast(
                "Sorry, we were not able to resolve your ENS address. Please try again later",
                { type: EToastRole.Error }
            );
            setEnteredEnsAddress("");
        }
        if (ensAddressData) {
            addPortfolioAccount({
                address: ensAddressData.address,
                ens: ensAddressData.ens,
            });
            setEnteredEnsAddress("");
        }
    }, [addPortfolioAccount, ensAddressData, isErrorUseResolveEnsQuery]);

    /**
     * Keep increasing the balancePollingInterval exponentially until pollingInterval is reached
     * If any of the address return a null data
     */
    useEffect(() => {
        if (tokensBalanceForAddresses === undefined) {
            return () => {};
        }
        pollIntervalRef.current = setInterval(() => {
            if (
                Object.values(tokensBalanceForAddresses).some(
                    (account) => account === null
                ) &&
                balancePollingInterval < pollingIntervalLimit
            ) {
                setBalancePollingInterval((prevInterval) => {
                    if (prevInterval < pollingIntervalLimit / 2) {
                        return prevInterval * 2;
                    }
                    return pollingIntervalLimit; // if prevInterval is already greater than pollingIntervalLimit/2, then set it to pollingIntervalLimit
                });
            } else if (
                Object.values(tokensBalanceForAddresses).every(
                    (account) => account !== null
                ) &&
                balancePollingInterval < pollingIntervalLimit
            ) {
                // if all the accounts are not null, then set the balancePollingInterval to pollingIntervalLimit
                setBalancePollingInterval(pollingIntervalLimit);
            } else if (
                Object.values(tokensBalanceForAddresses).some(
                    (account) => account === null
                ) &&
                balancePollingInterval >= pollingIntervalLimit // if any of the accounts is null and balancePollingInterval is greater than pollingIntervalLimit
            ) {
                // reset the balancePollingInterval to PORTFOLIO_DATA_WAIT_TIME
                setBalancePollingInterval(PORTFOLIO_DATA_WAIT_TIME);
            }
        }, balancePollingInterval);

        return () => {
            if (pollIntervalRef.current !== null) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [
        pollingIntervalLimit,
        balancePollingInterval,
        tokensBalanceForAddresses,
    ]);

    const isLoading =
        isConnectingWallet ||
        isLoadingTokensBalanceForAddresses ||
        isLoadingNftBalanceForAddresses || // TODO: separate nft isLoading state
        isLoadingEthPrice; // At first, isLoading is true & portfolioDataForAddress is undefined

    useEffect(() => {
        // Reset the widget height to 90px when the selectedAddress is null and isLoading is false
        dispatch(
            setWidgetHeight({
                widgetHash: moduleData.hash,
                widgetHeight: selectedAddress === null && !isLoading ? 90 : 432,
            })
        );
        // This should only run when the selectedAddress is null and isLoading is false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAddress === null && !isLoading]);

    return (
        <PortfolioModule
            isLoading={isLoading}
            accounts={accounts}
            authAccount={authWallet.account}
            selectedAddress={selectedAddress}
            onConnectWallet={openWalletConnectionDialog}
            showVerify={showVerify}
            onVerifyWallet={verifyWallet}
            onAddAddress={(address: string) => {
                if (validateENSAddr(address)) {
                    setEnteredEnsAddress(address);
                } else {
                    addPortfolioAccount({ address });
                }
            }}
            onRemoveAddress={(address: string) =>
                removePortfolioAccount({ address })
            }
            onSelectAddress={(address: string) =>
                setSelectedPortfolioAccount({ address })
            }
            portfolioDataForAddresses={portfolioDataForAddresses}
            portfolioDataForAddress={portfolioDataForAddress}
            nftBalanceForAddresses={portfolioNftDataForAddresses}
            ethPrice={ethPriceResponse?.results[0]?.price}
            balancesQueryFailed={balancesQueryFailed}
            nftsQueryFailed={isErrorNftBalanceForAddresses}
            toggleBalance={toggleBalance}
            showBalance={showBalance}
            toggleShowAllAssets={toggleShowAllAssets}
            showAllAssets={showAllAssets}
            widgetHeight={widgetHeight}
            portfolioType={portfolioType}
            switchPortfolioType={switchPortfolioType}
            moduleId={`module-${moduleData.hash}`}
        />
    );
};

export default PortfolioContainer;
