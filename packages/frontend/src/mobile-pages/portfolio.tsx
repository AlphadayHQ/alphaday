import { FC } from "react";
import { NavBottom, OutlineButton, Pager } from "@alphaday/ui-kit";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "src/api/hooks";
import { ReactComponent as CloseSVG } from "src/assets/icons/close.svg";
import { ReactComponent as CopySVG } from "src/assets/icons/copy.svg";
import { ReactComponent as HandSVG } from "src/assets/icons/hand.svg";
import { ReactComponent as UserSVG } from "src/assets/icons/user.svg";
import { ReactComponent as WalletSVG } from "src/assets/icons/wallet.svg";
import { ReactComponent as InfoSVG } from "src/assets/svg/info2.svg";

const TopSection: FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return (
            <div className="w-full flex px-5 mt-4 fontGroup-highlight !font-bold">
                Add your portfolio for a quick overview and easy swaps.
            </div>
        );
    }
    return (
        <div className="flex justify-between p-4 mt-2 fontGroup-highlight font-semibold bg-backgroundVariant200 rounded-lg mx-5">
            <InfoSVG className="h-5 w-5 text-primary" />
            <div className="mx-2 flex flex-col">
                <span className="fontGroup-highlightSemi font-bold">
                    Sign up or log in to get started
                </span>
                <span className="fontGroup-normal">
                    Log in or sign up to add your portfolio.
                </span>
            </div>
            <CloseSVG className="h-5 w-5 ml-2" />
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
                title="Portfolio"
                handleBack={() =>
                    history.length > 1 ? history.goBack() : history.push("/")
                }
            />
            <div className="w-full flex justify-between py-2 px-5">
                <Link
                    to="/user-settings"
                    role="button"
                    tabIndex={0}
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {avatar ? (
                        <img
                            className="h-12 w-12 rounded-full"
                            src={avatar}
                            alt=""
                        />
                    ) : (
                        <div className="bg-backgroundVariant300 border-borderLine flex h-12 w-12 items-center justify-center rounded-full border-2">
                            <UserSVG className="fill-primary h-7 w-7" />
                        </div>
                    )}
                </Link>
            </div>
            <TopSection isAuthenticated={isAuthenticated} />
            <div className="flex flex-col items-center mt-4 mx-4">
                <OutlineButton
                    title="Add Portfolio"
                    subtext="Add your portfolio to get started"
                    icon={<WalletSVG className="w-[24px] mr-1" />}
                    onClick={() => history.push("/portfolio/add-wallet")}
                    isAuthenticated={isAuthenticated}
                />
                <OutlineButton
                    title="Connect Wallet"
                    subtext="Connect your wallet to get started"
                    icon={<CopySVG className="w-[22px] mr-1" />}
                    onClick={() => history.push("/portfolio/connect-wallet")}
                    isAuthenticated={isAuthenticated}
                />
                <OutlineButton
                    title="Add Holdings Manually"
                    subtext="Add your holdings manually"
                    icon={<HandSVG className="w-[20px] mr-1" />}
                    onClick={() => history.push("/portfolio/add-holding")}
                    isAuthenticated={isAuthenticated}
                />
            </div>
            <NavBottom />
        </>
    );
};

export default PortfolioPage;
