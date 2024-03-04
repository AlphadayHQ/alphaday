import { useState } from "react";
import { FormInput, MiniDialog, Pager } from "@alphaday/ui-kit";
import { useHistory } from "react-router";
import { usePortfolioAccount } from "src/api/hooks";
import { validateEthAddr } from "src/api/utils/accountUtils";
import { ReactComponent as GreenCheckSVG } from "src/assets/icons/green-check.svg";

type TWalletInfo = {
    name: string;
    address: string;
};

const AddWalletPage = () => {
    const history = useHistory();
    const [isWalletAdded, setIsWalletAdded] = useState(false);
    const [walletInfo, setwalletInfo] = useState<TWalletInfo>({
        name: "",
        address: "",
    });

    // const handleAddNewWallet = (w: TWalletInfo) => {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setwalletInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const { addPortfolioAccount } = usePortfolioAccount();

    const handleAddWallet = () => {
        addPortfolioAccount(walletInfo);
        setIsWalletAdded(true);
    };
    return (
        <>
            <Pager
                title="Add wallet address"
                handleClose={() =>
                    history.length > 1 ? history.goBack() : history.push("/")
                }
            />
            <div className="flex flex-col items-center mt-4 mx-4">
                <FormInput
                    type="text"
                    label="Wallet name"
                    placeholder="Enter your wallet name"
                    value={walletInfo.name}
                    onChange={handleChange}
                    name="name"
                    className="outline-none px-4 py-3"
                />
                <div className="mt-5 w-full">
                    <FormInput
                        type="text"
                        label="Wallet address"
                        placeholder="Enter wallet address"
                        value={walletInfo.address}
                        onChange={handleChange}
                        name="address"
                        className="outline-none px-4 py-3"
                        errorMsg={
                            validateEthAddr(walletInfo.address)
                                ? undefined
                                : "Invalid wallet address"
                        }
                    />
                </div>
            </div>
            <div className="flex justify-center mt-5">
                <button
                    type="button"
                    className="px-4 py-3 w-full mx-4 bg-accentVariant100 hover:bg-accentVariant200 text-primary  rounded-md fontGroup-highlightSemi cursor-pointer disabled:bg-gray-600 disabled:opacity-30"
                    onClick={handleAddWallet}
                    disabled={
                        !validateEthAddr(walletInfo.address) ||
                        walletInfo.name === ""
                    }
                >
                    Add Wallet
                </button>
            </div>
            <MiniDialog
                show={isWalletAdded}
                icon={<GreenCheckSVG />}
                title="CONGRATS"
                onActionClick={() => {
                    setIsWalletAdded(false);
                    history.push("/portfolio");
                }}
            >
                <div className="text-center text-sm font-normal leading-tight tracking-tight text-slate-300">
                    Your account has been created!
                </div>
            </MiniDialog>
        </>
    );
};

export default AddWalletPage;
