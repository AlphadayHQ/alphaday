import { FC } from "react";
import { Logger } from "src/api/utils/logging";
import PieChartModule from "src/components/client/VerasityTokenomicsModule";
import { IModuleContainer } from "src/types";

const VerasityTokenomicsContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const { custom_data: dataArray } = moduleData.widget;
    if (!dataArray) {
        Logger.error(
            "VerasityTokenomicsContainer: could not parse widget data from",
            moduleData.name
        );
        return (
            <div className="flex justify-center items-center flex-1">
                Error parsing data
            </div>
        );
    }
    const rawData = dataArray[0];
    const data = {
        name: String(rawData.name),
        ticker: String(rawData.ticker),
        address: String(rawData.address),
        totalSupply: String(rawData.total_supply),
        maxSupply: String(rawData.max_supply),
        supply: String(rawData.supply),
        supplyChartLabel: String(rawData.supply_chart_label),
        warChestChartLabel: String(rawData.war_chest_chart_label),
        povChartLabel: String(rawData.pov_chart_label),
        maxSupplyChartLabel: String(rawData.max_supply_chart_label),
        disclaimer: String(rawData.disclaimer),
        faqLink: {
            value: String(rawData.faq_link_value),
            href: String(rawData.faq_link_href),
        },
        moreLink: {
            value: String(rawData.more_link_value),
            href: String(rawData.more_link_href),
        },
    };

    return <PieChartModule data={data} />;
};

export default VerasityTokenomicsContainer;
