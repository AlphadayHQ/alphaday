import { FC } from "react";
import { TabsBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

    const defaultAccountTab = {
        label: t("portfolio.allWallets"),
        value: "all-wallets",
    };

    const accountTabs = [
        defaultAccountTab,
        ...accounts.map((acct) => ({
            label: acct.ens || truncateWithEllipsis(acct.address, 10),
            value: acct.address,
            removable: acct.address !== authAccount?.address,
        })),
    ];

    const selectedTab = showAllAssets
        ? defaultAccountTab
        : accountTabs.find((tab) => tab.value === selectedAddress) ||
          defaultAccountTab;

    const handleTabChange = (value: string) => {
        if (value === defaultAccountTab.value) {
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
