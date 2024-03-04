import { FC, useMemo, useState } from "react";
import { Dialog, DropdownSelect } from "@alphaday/ui-kit";
import { IonPage } from "@ionic/react";
import { useHistory } from "react-router";
import { useKeyPress } from "src/api/hooks";
import { toggleShowBalance as toggleShowBalanceInStore } from "src/api/store";
import { useAppDispatch } from "src/api/store/hooks";

import { ReactComponent as ArrowUpSVG } from "src/assets/icons/arrow-up.svg";
import { ReactComponent as PlusSVG } from "src/assets/icons/plus.svg";
import { ReactComponent as ShowSVG } from "src/assets/icons/shown.svg";

import PortfolioChart from "src/mobile-components/portfolio/PortfolioChart";
import WalletConnectionOptions from "src/mobile-components/portfolio/WalletConnectionOptions";

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
            <DropdownSelect wallets={wallets} />
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

const PortfolioHoldings: React.FC = () => {
    const dispatch = useAppDispatch();
    const [showDialog, setShowDialog] = useState(false);
    const history = useHistory();

    const toggleBalance = () => {
        dispatch(toggleShowBalanceInStore());
    };
    const wallets = [
        { label: "All Assets", value: "all" },
        {
            label: "xavier-Charles",
            value: "0xe70d4BdacC0444CAa973b0A05CB6f2974C34aF0c",
        },
        {
            label: "pipe",
            value: "0x93450d4BdacC0444CAa973b0A05CB6f2974C34DDc",
        },
    ];
    return (
        <IonPage className="justify-start">
            <div className="w-full flex justify-between items-center px-4 py-5">
                <div className="flex flex-grow justify-center uppercase font-bold text-base">
                    PORTFOLIO
                </div>
            </div>
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
                <div className="">
                    <div className="w-full text-center px-5 fontGroup-highlight !font-semibold">
                        <span>Choose A Method</span>
                    </div>
                    <WalletConnectionOptions
                        isAuthenticated
                        onClick={(path: string) => {
                            history.push(path);
                        }}
                    />
                </div>
            </Dialog>
        </IonPage>
    );
};

export default PortfolioHoldings;
