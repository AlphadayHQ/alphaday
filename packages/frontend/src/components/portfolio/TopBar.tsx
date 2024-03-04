import { FC } from "react";
import { Switch, TabButton } from "@alphaday/ui-kit";
import { ReactComponent as PlusSVG } from "src/assets/icons/plus.svg";
import { EPortfolioType } from "./types";

interface ITopBarProps {
    switchPortfolioType: () => void;
    portfolioType: EPortfolioType;
    handleShowEnterAddress: () => void;
    onConnectWallet: () => void;
    onDisconnectWallet: () => MaybeAsync<void>;
    selectedIsAuthWallet: boolean;
    isWalletConnected: boolean;
}

const TopBar: FC<ITopBarProps> = ({
    switchPortfolioType,
    portfolioType,
    handleShowEnterAddress,
    onDisconnectWallet,
    onConnectWallet,
    selectedIsAuthWallet,
    isWalletConnected,
}) => {
    return (
        <div className="m-0 mx-2 flex justify-between pt-4 h-[42px]">
            <Switch
                options={["Assets", "NFTs"]}
                onChange={switchPortfolioType}
                checked={portfolioType === EPortfolioType.Nft}
            />
            <span className="my-0 pr-1 flex ml-1 gap-1.5">
                <TabButton
                    variant="extraSmall"
                    open={false}
                    uppercase={false}
                    onClick={handleShowEnterAddress}
                    className="portfolio-addWallet border border-borderLine text-primary"
                >
                    <PlusSVG
                        style={{
                            marginRight: "5px",
                        }}
                    />{" "}
                    Add New Wallet
                </TabButton>
                {(selectedIsAuthWallet || !isWalletConnected) && (
                    <TabButton
                        variant="extraSmall"
                        open={false}
                        uppercase={false}
                        onClick={
                            isWalletConnected
                                ? onDisconnectWallet
                                : onConnectWallet
                        }
                        className="portfolio-addWallet border border-borderLine text-primary"
                    >
                        {isWalletConnected
                            ? "Disconnect wallet"
                            : "Connect wallet"}
                    </TabButton>
                )}
            </span>
        </div>
    );
};

export default TopBar;
