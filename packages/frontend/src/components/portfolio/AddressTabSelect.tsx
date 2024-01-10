import { FC } from "react";
import { TabsBar } from "@alphaday/ui-kit";
import { TCryptoAccount } from "src/api/types";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
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
    onRemoveAddress: (address: string) => void;
    onSelectAddress: (address: string) => void;
}

const DEFAULT_ACCOUNT_TAB = { label: "All wallets", value: "all-wallets" };

const AddressTabSelect: FC<IAddressTabSelect> = ({
    accounts,
    setHeaderRef,
    handleClickScroll,
    hideLeftPan,
    hideRightPan,
    selectedAddress,
    showAllAssets,
    toggleShowAllAssets,
    onRemoveAddress,
    onSelectAddress,
    authAccount,
}) => {
    const accountTabs = [
        DEFAULT_ACCOUNT_TAB,
        ...accounts.map((acct) => ({
            label: acct.ens || truncateWithEllipsis(acct.address, 10),
            value: acct.address,
            removable: acct.address !== authAccount?.address,
        })),
    ];

    const selectedTab = showAllAssets
        ? DEFAULT_ACCOUNT_TAB
        : accountTabs.find((tab) => tab.value === selectedAddress) ||
          DEFAULT_ACCOUNT_TAB;

    const handleTabChange = (value: string) => {
        if (value === DEFAULT_ACCOUNT_TAB.value) {
            toggleShowAllAssets();
        } else {
            onSelectAddress(value);
            if (showAllAssets) toggleShowAllAssets();
        }
    };
    return (
        <div className="relative transition-[height] duration-300 cursor-pointer">
            <div
                className="flex items-center h-[43px] overflow-y-hidden overflow-x-scroll pb-2 px-0"
                id="portfolioAddrContainer"
                data-testid="portfolio-address-tab"
            >
                <div className="flex w-full m-0 px-2">
                    <TabsBar
                        options={accountTabs}
                        onChange={handleTabChange}
                        selectedOption={selectedTab}
                        onRemoveTab={onRemoveAddress}
                        setHeaderRef={setHeaderRef}
                        handleClickScroll={handleClickScroll}
                        hideLeftPan={hideLeftPan}
                        hideRightPan={hideRightPan}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddressTabSelect;
