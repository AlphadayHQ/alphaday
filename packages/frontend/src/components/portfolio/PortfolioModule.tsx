import { FC, useState, useMemo } from "react";
import { Button, ModuleLoader } from "@alphaday/ui-kit";
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
    selectedAddress: string | null;
    onConnectWallet: () => MaybeAsync<void>;
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
    moduleId,
}) => {
    const [showEnterAddress, setShowEnterAddress] = useState(false);
    const [disableAddAddressInput, setDisableAddAddressInput] = useState(true);

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
                                    <div className="flex my-[15px] mx-auto justify-center">
                                        <Button
                                            variant="primaryXL"
                                            onClick={onVerifyWallet}
                                            title={
                                                globalMessages.portfolio
                                                    .verifyWallet
                                            }
                                        >
                                            Verify Wallet
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
                            <div className="flex my-[15px] mx-auto justify-center">
                                <div className="flex w-[315px] justify-between tiny:scale-95">
                                    <Button
                                        variant="primaryXL"
                                        title="Connect your Wallet"
                                        onClick={onConnectWallet}
                                    >
                                        Connect Wallet
                                    </Button>
                                    <Button
                                        variant="secondaryXL"
                                        title="Enter a wallet address"
                                        onClick={handleShowEnterAddress}
                                    >
                                        Enter Address
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
