import { FC } from "react";
import { IconButton, TabButton } from "@alphaday/ui-kit";
import { TCryptoAccount } from "src/api/types";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import { ReactComponent as PlusSVG } from "src/assets/icons/plus.svg";
import { TPortfolioTabAccount } from "./types";

interface IAddressTabSelect {
    selectedAddress: string | null;
    accounts: Array<TPortfolioTabAccount>;
    authAccount: TCryptoAccount | undefined;
    setHeaderRef: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
    handleClickScroll: (scrollRight?: boolean) => void;
    hideLeftPan: boolean;
    hideRightPan: boolean;
    showAllAssets: boolean;
    toggleShowAllAssets: () => void;
    handleShowEnterAddress: () => void;
    onRemoveAddress: (address: string) => void;
    onSelectAddress: (address: string) => void;
    disableAccountSelection: boolean;
}

const AddressTabSelect: FC<IAddressTabSelect> = ({
    accounts,
    setHeaderRef,
    handleClickScroll,
    hideLeftPan,
    hideRightPan,
    selectedAddress,
    showAllAssets,
    toggleShowAllAssets,
    handleShowEnterAddress,
    onRemoveAddress,
    onSelectAddress,
    disableAccountSelection,
    authAccount,
}) => {
    return (
        <div className="w-ful relative border-b border-solid border-borderLine transition-[height] duration-300 cursor-pointer">
            <div
                className="flex items-center h-[53px] overflow-y-hidden overflow-x-scroll py-[13px] px-0"
                id="portfolioAddrContainer"
                data-testid="portfolio-address-tab"
                ref={(ref: HTMLDivElement | null) => ref && setHeaderRef(ref)}
            >
                <div className="flex pt-[3px] m-0 mx-[10px] [&:first-child]:ml-[6px] [&:first-child]:mr-1">
                    {!hideLeftPan && (
                        <span className="block absolute center top-[calc(50%_-_16.5px)] left-[3px]">
                            <IconButton
                                title="Pan Coins Left"
                                variant="leftArrow"
                                onClick={() => handleClickScroll()}
                            />
                        </span>
                    )}
                    <span className="my-0 mx-1">
                        <TabButton
                            open={showAllAssets}
                            onClick={() => {
                                if (!showAllAssets) toggleShowAllAssets();
                            }}
                            variant="extraSmall"
                            uppercase={false}
                        >
                            All Wallets
                        </TabButton>
                    </span>
                    {accounts.map((acct) => (
                        <span
                            key={acct.address}
                            data-testid={`portfolio-account-${acct.address}`}
                            className="my-0 mx-1"
                        >
                            <TabButton
                                key={acct.address}
                                label={acct.ens || acct.address}
                                uppercase={false}
                                open={
                                    !showAllAssets &&
                                    selectedAddress === acct.address
                                }
                                onClick={() => {
                                    onSelectAddress(acct.address);
                                    if (showAllAssets) toggleShowAllAssets();
                                }}
                                onClose={() => {
                                    onRemoveAddress(acct.address);
                                }}
                                variant={
                                    acct.address !== authAccount?.address
                                        ? "removable"
                                        : "small"
                                }
                                title={acct.address}
                                disabled={disableAccountSelection}
                                className="[&>svg]:pr-[1px]"
                            >
                                {acct.ens ||
                                    truncateWithEllipsis(acct.address, 10)}
                            </TabButton>
                        </span>
                    ))}
                    <span className="my-0 mx-1">
                        <TabButton
                            variant="extraSmall"
                            open={false}
                            uppercase={false}
                            onClick={handleShowEnterAddress}
                            className="portfolio-addWallet"
                        >
                            <PlusSVG
                                style={{
                                    marginRight: "5px",
                                }}
                            />{" "}
                            Add Wallet
                        </TabButton>
                    </span>
                    {!hideRightPan && (
                        <span className="block absolute center top-[calc(50%_-_16.5px)] left-auto right-[3px]">
                            <IconButton
                                title="Pan Coins Right"
                                variant="rightArrow"
                                onClick={() => handleClickScroll(true)}
                            />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressTabSelect;
