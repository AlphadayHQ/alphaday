import React, { FC } from "react";
import { NavBottom, Pager, twMerge } from "@alphaday/ui-kit";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "src/api/hooks";
import { ReactComponent as MetamaskSVG } from "src/assets/icons/metamask.svg";
import { ReactComponent as UserSVG } from "src/assets/icons/user.svg";
import { ReactComponent as WalletConnectSVG } from "src/assets/icons/wallet-connect.svg";

const Option: FC<{
    title: string;
    subtext: string;
    icon: React.ReactNode;
    onClick: () => void;
    isAuthenticated: boolean;
}> = ({ onClick, title, subtext, icon, isAuthenticated }) => {
    return (
        <div
            onClick={onClick}
            tabIndex={0}
            role="button"
            className={twMerge(
                "w-full flex flex-col justify-center py-3 px-4 mt-2 border-2 border-backgroundVariant400 rounded-lg",
                isAuthenticated &&
                    "border-accentVariant100 bg-backgroundVariant200 hover:bg-backgroundVariant300"
            )}
        >
            <div className="flex flex-col px-4 py-3 items-center">
                <span
                    className={twMerge(
                        "fontGroup-highlight inline-flex !font-bold text-backgroundVariant400",
                        isAuthenticated &&
                            "[&_svg]:text-accentVariant100 text-primary"
                    )}
                >
                    {icon}
                    {title}
                </span>
                <span
                    className={twMerge(
                        "fontGroup-normal mt-2 text-backgroundVariant400",
                        isAuthenticated && "text-primary"
                    )}
                >
                    {subtext}
                </span>
            </div>
        </div>
    );
};

const PortfolioPage = () => {
    const history = useHistory();
    const { isAuthenticated } = useAuth();
    const avatar = false; // TODO get this from user data
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
                <Option
                    title="Wallet Connect"
                    subtext="Connect your wallet to get started"
                    icon={<WalletConnectSVG className="w-[24px] mr-1" />}
                    onClick={() => {}}
                    isAuthenticated
                />
                <Option
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
