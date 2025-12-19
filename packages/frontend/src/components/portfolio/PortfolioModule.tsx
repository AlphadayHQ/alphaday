import { FC, useState, useMemo } from "react";
import { Button, ModuleLoader } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import useHeaderScroll from "src/api/hooks/useHeaderScroll";
import { TCryptoAccount } from "src/api/types";
import { validateHexOrEnsAddr } from "src/api/utils/accountUtils";
import globalMessages from "src/globalMessages";
import AddressInput from "./AddressInput";
import AddressTabSelect from "./AddressTabSelect";
import NftList from "./nfts/NftList";
import PortfolioStats from "./PortfolioStats";
import TopBar from "./TopBar";
import {
    TPortfolioDataForAddress,
    TPortfolioNFTDataForAddress,
    TPortfolioTabAccount,
    EPortfolioType,
} from "./types";

interface IPortfolio {
    isLoading: boolean;
    accounts: Array<TPortfolioTabAccount>;
    authAccount: TCryptoAccount | undefined;
    isWalletConnected: boolean;
    selectedAddress: string | null;
    onConnectWallet: () => void;
    onDisconnectWallet: () => MaybeAsync<void>;
    showVerify: boolean;
    onVerifyWallet: () => MaybeAsync<void>;
    onAddAddress: (address: string) => void;
    onRemoveAddress: (address: string) => void;
    onSelectAddress: (address: string) => void;
    portfolioDataForAddresses: TPortfolioDataForAddress;
    nftBalanceForAddresses: TPortfolioNFTDataForAddress;
    portfolioDataForAddress: TPortfolioDataForAddress | undefined;
    balancesQueryFailed: boolean;
    toggleBalance: () => void;
    showBalance: boolean;
    toggleShowAllAssets: () => void;
    showAllAssets: boolean;
    switchPortfolioType: () => void;
    portfolioType: EPortfolioType;
    ethPrice?: number | undefined;
    widgetHeight: number;
    nftsQueryFailed: boolean;
    moduleId: string;
}

const Portfolio: FC<IPortfolio> = ({
    selectedAddress,
    accounts,
    onConnectWallet,
    onDisconnectWallet,
    showVerify,
    onVerifyWallet,
    portfolioDataForAddress,
    portfolioDataForAddresses,
    ethPrice,
    isLoading,
    onAddAddress,
    onRemoveAddress,
    onSelectAddress,
    balancesQueryFailed,
    toggleBalance,
    showBalance,
    toggleShowAllAssets,
    showAllAssets,
    widgetHeight,
    portfolioType,
    switchPortfolioType,
    nftBalanceForAddresses,
    nftsQueryFailed,
    authAccount,
    isWalletConnected,
    moduleId,
}) => {
    const [showEnterAddress, setShowEnterAddress] = useState(false);
    const [disableAddAddressInput, setDisableAddAddressInput] = useState(true);

    const { t } = useTranslation();

    const portfolioData = useMemo(
        () =>
            !showAllAssets
                ? portfolioDataForAddress
                : portfolioDataForAddresses,
        [showAllAssets, portfolioDataForAddress, portfolioDataForAddresses]
    );

    const {
        squareRef,
        setHeaderRef,
        handleClickScroll,
        hideLeftPan,
        hideRightPan,
    } = useHeaderScroll();

    const handleShowEnterAddress = () => setShowEnterAddress((prev) => !prev);

    const onInputChange = (addr: string) =>
        setDisableAddAddressInput(!validateHexOrEnsAddr(addr.toLowerCase()));

    return (
        <div className="h-full" ref={squareRef}>
            <div className="h-full" data-testid="portfolio-widget">
                {isLoading ? (
                    <ModuleLoader $height={`${String(widgetHeight)}px`} />
                ) : (
                    <>
                        {/* fragment to avoid nested tenary lint error */}
                        {selectedAddress ? (
                            <>
                                {showVerify && (
                                    <div className="flex my-4 mx-auto justify-center">
                                        <Button
                                            variant="primaryXL"
                                            onClick={onVerifyWallet}
                                            title={
                                                globalMessages.portfolio
                                                    .verifyWallet
                                            }
                                        >
                                            {t("buttons.verifyWallet")}
                                        </Button>
                                    </div>
                                )}
                                <AddressTabSelect
                                    accounts={accounts}
                                    authAccount={authAccount}
                                    setHeaderRef={setHeaderRef}
                                    handleClickScroll={handleClickScroll}
                                    hideLeftPan={hideLeftPan}
                                    hideRightPan={hideRightPan}
                                    showAllAssets={showAllAssets}
                                    toggleShowAllAssets={toggleShowAllAssets}
                                    selectedAddress={selectedAddress}
                                    onSelectAddress={onSelectAddress}
                                    onRemoveAddress={onRemoveAddress}
                                />
                                <TopBar
                                    portfolioType={portfolioType}
                                    switchPortfolioType={switchPortfolioType}
                                    handleShowEnterAddress={
                                        handleShowEnterAddress
                                    }
                                    onDisconnectWallet={onDisconnectWallet}
                                    onConnectWallet={onConnectWallet}
                                    selectedIsAuthWallet={
                                        authAccount?.address === selectedAddress
                                    }
                                    isWalletConnected={isWalletConnected}
                                />
                                {portfolioType === EPortfolioType.Ft ? (
                                    <PortfolioStats
                                        showBalance={showBalance}
                                        showAllAssets={showAllAssets}
                                        portfolioData={portfolioData}
                                        ethPrice={ethPrice}
                                        balancesQueryFailed={
                                            balancesQueryFailed
                                        }
                                        toggleBalance={toggleBalance}
                                        moduleId={moduleId}
                                        selectedAddress={selectedAddress}
                                        widgetHeight={widgetHeight}
                                    />
                                ) : (
                                    <NftList
                                        nftData={nftBalanceForAddresses}
                                        widgetHeight={widgetHeight}
                                        nftsQueryFailed={nftsQueryFailed}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="flex my-4 mx-auto justify-center">
                                <div className="mt-10 two-col:mt-0 flex w-[315px] justify-between tiny:scale-95">
                                    <Button
                                        variant="primaryXL"
                                        title="Connect your Wallet"
                                        onClick={onConnectWallet}
                                        className=" max-w-[49%]"
                                    >
                                        {t("buttons.connectWallet")}
                                    </Button>
                                    <Button
                                        variant="secondaryXL"
                                        title="Enter a wallet address"
                                        onClick={handleShowEnterAddress}
                                        className=" max-w-[49%]"
                                    >
                                        {t("buttons.enterAddress")}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <AddressInput
                    onChange={onInputChange}
                    onAddAddress={onAddAddress}
                    show={showEnterAddress}
                    onClose={() => setShowEnterAddress(false)}
                    disabled={disableAddAddressInput}
                />
            </div>
        </div>
    );
};

export default Portfolio;
