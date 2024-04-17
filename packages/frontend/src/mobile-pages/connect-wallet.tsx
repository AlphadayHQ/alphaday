import { OutlineButton, Pager } from "@alphaday/ui-kit";
import { useControlledModal } from "src/api/hooks";
import { ReactComponent as MetamaskSVG } from "src/assets/icons/metamask.svg";
import { ReactComponent as WalletConnectSVG } from "src/assets/icons/wallet-connect.svg";

const ConnectWalletPage = () => {
    const { closeModal } = useControlledModal();
    return (
        <>
            <Pager title="Connect wallet" handleBack={closeModal} />
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
        </>
    );
};

export default ConnectWalletPage;
