import { FC, useState } from "react";
import { Dialog, DropdownSelect } from "@alphaday/ui-kit";
import { useControlledModal, useKeyPress } from "src/api/hooks";
import { toggleShowBalance as toggleShowBalanceInStore } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";

import { TPortfolio } from "src/api/types";
import { ENumberStyle, formatNumber } from "src/api/utils/format";
import { getAssetPrefix } from "src/api/utils/portfolioUtils";
import { ReactComponent as ArrowUpSVG } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as PlusSVG } from "src/assets/icons/plus.svg";
import { ReactComponent as ShowSVG } from "src/assets/icons/shown.svg";

import PagedMobileLayout from "src/layout/PagedMobileLayout";
import { portfolioData } from "src/mobile-components/portfolio/mockData";
import PortfolioChart from "src/mobile-components/portfolio/PortfolioChart";
import WalletConnectionOptions from "src/mobile-components/portfolio/WalletConnectionOptions";
import CONFIG from "src/config";

const { SMALL_PRICE_CUTOFF_LG } = CONFIG.WIDGETS.PORTFOLIO;

const UserWalletsInfo: FC<{ toggleBalance: () => void }> = ({
    toggleBalance,
}) => {
    return (
        <div className="flex flex-col flex-start w-full items-start mb-4 mx-5">
            <div className="flex">
                <img
                    src="https://tailwindui.com/img/avatar-3.jpg"
                    alt="username"
                    className="mr-3 w-[60px] h-[60px] rounded-full border border-solid border-green-400"
                />
                <div className="flex flex-col">
                    <p className="mb-0 inline-flex capitalize tracking-[0.5px] fontGroup-mini !text-sm text-primaryflex items-center">
                        Total Balance{" "}
                        <ShowSVG
                            onClick={toggleBalance}
                            className="cursor-pointer text-primary ml-1 w-3.5 h-3.5"
                        />
                    </p>
                    <p className="mb-0 inline-flex capitalize tracking-[0.5px] fontGroup-mini !text-sm text-primaryflex items-center">
                        $12,555
                    </p>
                    <p className="mb-0 inline-flex capitalize tracking-[0.5px] fontGroup-mini !text-xs items-center">
                        <span className="text-success">+58.54 (1.4%)</span> /
                        24h
                    </p>
                </div>
            </div>
        </div>
    );
};

const WalletsList: FC<{
    onAddWallet: () => void;
    wallets: {
        label: string;
        value: string;
    }[];
}> = ({ onAddWallet, wallets }) => {
    return (
        <div className="flex items-center mb-4 mx-5">
            <DropdownSelect items={wallets} />
            <button
                onClick={onAddWallet}
                className="bg-accentVariant100 text-white self-center rounded-md py-2 px-2 ml-2"
                type="button"
                title="Add Wallet"
            >
                <PlusSVG className="w-4 h-4" />
            </button>
        </div>
    );
};

const AssetsList: FC<{ assets: TPortfolio[] }> = ({ assets }) => {
    if (assets.length > 0) {
        return (
            <div>
                <div>
                    {assets.map((asset) => {
                        const assetKey = `single-
                        ${asset.address}-${asset.network}-${asset.updatedAt}-${asset.token.id}`;

                        return (
                            <div
                                className="flex flex-col mx-2 py-3 px-2 justify-between fontGroup-normal border-t border-borderLine first-of-type:border-t-0 rounded-sm"
                                key={assetKey}
                            >
                                <div className="flex flex-1 justify-start mb-2">
                                    <span className="flex flex-wrap">
                                        {asset.token.tokenImage && (
                                            <img
                                                alt=""
                                                src={asset.token.tokenImage}
                                                className="w-5 h-5 rounded-full mr-[10px]"
                                            />
                                        )}
                                        <span className="mr-0.5 font-bold">
                                            {asset.token.symbol}
                                        </span>{" "}
                                        <span className="text-primaryVariant100 mx-0.5">
                                            {asset.token.name}
                                        </span>
                                        <span className="secondCol text-primaryVariant100 ml-0.5">
                                            {getAssetPrefix(asset)}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex flex-1 flex-end">
                                        <div className="flex flex-col">
                                            <p className="capitalize text-end tracking-[0.5px] fontGroup-mini text-primaryVariant100 mb-0">
                                                Balance
                                            </p>
                                            <span>
                                                {
                                                    formatNumber({
                                                        value: asset.token
                                                            .balance,
                                                    }).value
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-end">
                                        <div className="flex flex-col w-full">
                                            <p className="capitalize ml-[30%] text-start tracking-[0.5px] fontGroup-mini text-primaryVariant100 mb-0">
                                                Price
                                            </p>
                                            <span className="ml-[30%]">
                                                {
                                                    formatNumber({
                                                        value:
                                                            asset.token.price ||
                                                            0,
                                                        style: ENumberStyle.Currency,
                                                        currency: "USD",
                                                        useEllipsis: true,
                                                        ellipsisCutoff:
                                                            SMALL_PRICE_CUTOFF_LG,
                                                    }).value
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-end">
                                        <div className="flex flex-col w-full">
                                            <p className="capitalize text-end tracking-[0.5px] fontGroup-mini text-primaryVariant100 mb-0">
                                                Value
                                            </p>
                                            <span className="text-end">
                                                {
                                                    formatNumber({
                                                        value:
                                                            asset.token
                                                                .balanceUSD ||
                                                            0,
                                                        style: ENumberStyle.Currency,
                                                        currency: "USD",
                                                    }).value
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
};

const PortfolioHoldings: React.FC = () => {
    const dispatch = useAppDispatch();
    const [showDialog, setShowDialog] = useState(false);
    const { setActiveModal } = useControlledModal();

    const toggleBalance = () => {
        dispatch(toggleShowBalanceInStore());
    };
    const wallets = [
        { label: "All Assets", value: "all" },
        {
            label: "xavier-charles",
            value: "0xe70d4BdacC0444CAa973b0A05CB6f2974C34aF0c",
        },
        {
            label: "brine",
            value: "0x93450d4BdacC0444CAa973b0A05CB6f2974C34DDc",
        },
    ];
    return (
        <PagedMobileLayout title="Portfolio">
            {/* // TODO (xavier-charles) update classname */}
            <div className="portfolio-widget w-full mb-20">
                <UserWalletsInfo toggleBalance={toggleBalance} />
                <WalletsList
                    wallets={wallets}
                    onAddWallet={() => {
                        setShowDialog(true);
                    }}
                />
                <div className="mx-5">
                    <div className="mb-0.5">
                        <p className="mb-0 inline-flex capitalize tracking-[0.5px] fontGroup-mini !text-sm text-primaryflex items-center">
                            Balance
                        </p>
                        <p className="mb-0 inline-flex capitalize tracking-[0.5px] fontGroup-mini !text-xs text-primaryflex items-center">
                            <span className="text-success inline-flex self-center">
                                <ArrowUpSVG className="w-3 h-3 ml-2 mr-1 self-center" />{" "}
                                (1.4%)
                            </span>{" "}
                            / 24h
                        </p>
                    </div>
                    <p className="mb-0 fontGroup-major items-center">$12,555</p>
                </div>
                <PortfolioChart />
                <AssetsList assets={portfolioData.assets} />
                <Dialog
                    size="xs"
                    showXButton
                    showDialog={showDialog}
                    useKeyPress={useKeyPress}
                    closeButtonProps={{
                        className: "border-0 [&_svg]:w-3 [&_svg]:h-3",
                    }}
                    onClose={() => setShowDialog(false)}
                >
                    <div className="w-full">
                        <div className="w-full text-center px-5 fontGroup-highlight !font-semibold">
                            <span>Choose A Method</span>
                        </div>
                        <WalletConnectionOptions
                            isAuthenticated
                            onClick={(path: string) => {
                                setActiveModal(path);
                            }}
                        />
                    </div>
                </Dialog>
            </div>
        </PagedMobileLayout>
    );
};

export default PortfolioHoldings;
