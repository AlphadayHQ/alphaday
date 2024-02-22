import { NavBottom, OutlineButton, Pager } from "@alphaday/ui-kit";
import { useHistory } from "react-router";
import { ReactComponent as MetamaskSVG } from "src/assets/icons/metamask.svg";
import { ReactComponent as WalletConnectSVG } from "src/assets/icons/wallet-connect.svg";

const PortfolioPage = () => {
    const history = useHistory();
    return (
        <>
            <Pager
                title="CONNECT WALLET"
                handleBack={() =>
                    history.length > 1 ? history.goBack() : history.push("/")
                }
            />
            <div className="w-full flex px-5 mt-4 fontGroup-highlight !font-bold">
                Select your preferred wallet provider to conect to your
                portfolio
            </div>
            <div className="flex flex-col items-center mt-4 mx-4">
                <OutlineButton
                    title="Wallet Connect"
                    subtext="Connect your wallet to get started"
                    icon={<WalletConnectSVG className="w-[24px] mr-1" />}
                    onClick={() => {}}
                    isAuthenticated
                />
                <OutlineButton
                    title="Metamask"
                    subtext="Connect your wallet to get started"
                    icon={<MetamaskSVG className="w-[22px] mr-1" />}
                    onClick={() => {}}
                    isAuthenticated
                />
            </div>
            <NavBottom />
        </>
    );
};

export default PortfolioPage;
