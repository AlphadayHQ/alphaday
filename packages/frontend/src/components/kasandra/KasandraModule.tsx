import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { TChartRange, TCoinMarketHistory } from "src/api/types";
import LineChart from "./LineChart";

export interface IMarketModule {
    isLoading?: boolean;
    isLoadingHistory: boolean;
    selectedMarketHistory: TCoinMarketHistory | undefined;
    selectedChartRange: TChartRange;
}

const MarketModule: FC<IMarketModule> = ({
    isLoading,
    isLoadingHistory,

    selectedMarketHistory,
    selectedChartRange,
}) => {
    const priceHistoryData = selectedMarketHistory?.history?.prices;

    if (isLoading) {
        return <ModuleLoader $height="600px" />;
    }

    return (
        <div className="market-widget">
            <div className="p-0 flex items-center justify-between flex-wrap flex-1 basis-auto min-h-[1px]">
                <div className="w-full flex flex-col mt-[10px] two-col:mt-0">
                    <LineChart
                        selectedChartRange={selectedChartRange}
                        data={priceHistoryData ?? [[0], [1]]}
                        isLoading={isLoadingHistory}
                    />
                </div>
            </div>
        </div>
    );
};

export default MarketModule;
