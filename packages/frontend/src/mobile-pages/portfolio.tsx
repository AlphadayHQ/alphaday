import { FC } from "react";
import { Pager } from "@alphaday/ui-kit";
import { useAuth, useHistory } from "src/api/hooks";
import { ReactComponent as CloseSVG } from "src/assets/icons/close.svg";
import { ReactComponent as InfoSVG } from "src/assets/icons/Info2.svg";
import WalletConnectionOptions from "src/mobile-components/portfolio/WalletConnectionOptions";

const TopSection: FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return (
            <div className="w-full flex px-5 mt-4 fontGroup-highlight !font-semibold">
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

    // TODO if user has holdings route to holdings
    return (
        <>
            <Pager title="Portfolio" />
            <TopSection isAuthenticated={isAuthenticated} />
            <WalletConnectionOptions
                isAuthenticated={isAuthenticated}
                onClick={(path: string) => {
                    history.push(path);
                }}
                className="mx-4"
            />
        </>
    );
};

export default PortfolioPage;
