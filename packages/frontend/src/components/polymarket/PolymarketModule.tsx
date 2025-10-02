import { FC } from "react";
import { ModuleLoader, TabsBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import { Logger } from "src/api/utils/logging";
import PolymarketList from "./PolymarketList";
import { EPolymarketFilter } from "./types";

export interface IPolymarketModule {
    isLoading?: boolean;
    markets: TPolymarketMarket[];
    onSelectMarket?: (market: TPolymarketMarket) => void;
    contentHeight: string;
    selectedFilter: EPolymarketFilter;
    onSetSelectedFilter: (filter: EPolymarketFilter) => void;
}

const PolymarketModule: FC<IPolymarketModule> = ({
    isLoading,
    markets,
    onSelectMarket,
    contentHeight,
    selectedFilter,
    onSetSelectedFilter,
}) => {
    const { t } = useTranslation();
    const polymarketNavItems = [
        {
            label: t("navigation.general.all"),
            value: EPolymarketFilter.All,
        },
        {
            label: t("polymarket.active"),
            value: EPolymarketFilter.Active,
        },
        {
            label: t("polymarket.resolved"),
            value: EPolymarketFilter.Resolved,
            auth: true,
        },
    ];

    const NavItemPreference =
        polymarketNavItems.find((item) => item.value === selectedFilter) ||
        polymarketNavItems[0];

    const filteredMarkets = markets.filter((market) => {
        switch (selectedFilter) {
            case EPolymarketFilter.Active:
                return !market.resolved;
            case EPolymarketFilter.Resolved:
                return market.resolved;
            default:
                return true;
        }
    });

    const onTabOptionChange = (value: string) => {
        const optionItem = polymarketNavItems.find(
            (item) => item.value === value
        );
        if (optionItem === undefined) {
            Logger.debug("PolymarketModule::Nav option item not found");
            return;
        }
        onSetSelectedFilter(optionItem.value);
    };

    return (
        <>
            <div className="mx-2">
                <TabsBar
                    options={polymarketNavItems}
                    onChange={onTabOptionChange}
                    selectedOption={NavItemPreference}
                />
            </div>
            <div className="flex flex-col h-full pb-4">
                {isLoading ? (
                    <ModuleLoader $height={contentHeight} />
                ) : (
                    <PolymarketList
                        markets={filteredMarkets}
                        onSelectMarket={onSelectMarket}
                    />
                )}
            </div>
        </>
    );
};

export default PolymarketModule;
