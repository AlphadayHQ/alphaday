import { FC } from "react";
import { OutlineButton, twMerge } from "@alphaday/ui-kit";
import { ReactComponent as CopySVG } from "src/assets/icons/copy.svg";
import { ReactComponent as HandSVG } from "src/assets/icons/hand.svg";
import { ReactComponent as WalletSVG } from "src/assets/icons/wallet.svg";
import { EMobileModalIds } from "src/routes";

const WalletConnectionOptions: FC<{
    isAuthenticated: boolean;
    onClick: (path: string) => void;
    className?: string;
}> = ({ isAuthenticated, onClick, className }) => {
    return (
        <div className={twMerge("flex flex-col items-center mt-4", className)}>
            <OutlineButton
                title="Add Wallet"
                subtext="Add your wallet manually to get started"
                icon={<WalletSVG className="w-[24px] mr-1" />}
                onClick={() => onClick(EMobileModalIds.PortfolioAddWallet)}
                isAuthenticated={isAuthenticated}
            />
            <OutlineButton
                title="Connect Wallet"
                subtext="Connect your wallet to get started"
                icon={<CopySVG className="w-[22px] mr-1" />}
                onClick={() => onClick(EMobileModalIds.PortfolioConnectWallet)}
                isAuthenticated={isAuthenticated}
            />
            <OutlineButton
                title="Add Holdings Manually"
                subtext="Add your holdings manually"
                icon={<HandSVG className="w-[20px] mr-1" />}
                onClick={() => onClick(EMobileModalIds.PortfolioAddHolding)}
                isAuthenticated={isAuthenticated}
            />
        </div>
    );
};

export default WalletConnectionOptions;
