import { FC, memo } from "react";
import { TabButton } from "@alphaday/ui-kit";
import { CHART_RANGE_OPTIONS, TChartRange } from "src/api/types";
import { EChartType } from "src/components/market/types";

type Props = {
    selectedChartRange: TChartRange;
    onSelectChartRange: (range: TChartRange) => void;
    selectedChartType: EChartType;
};

const DateRangeBar: FC<Props> = memo(function DateRangeBar({
    selectedChartRange,
    onSelectChartRange,
    selectedChartType,
}) {
    return (
        <div className="flex w-full justify-end border-none uppercase fontGroup-support mb-2">
            {Object.values(CHART_RANGE_OPTIONS).map((option) => (
                <span key={option} className="ml-1.5 mt-1.5">
                    <TabButton
                        open={selectedChartRange === option}
                        onClick={() => onSelectChartRange(option)}
                        variant="extraSmall"
                        disabled={
                            /**
                             * Disable 3Y and YTD for candlestick chart.
                             * This is because the candlestick chart data does not include these ranges
                             */
                            selectedChartType === EChartType.Candlestick &&
                            !![
                                CHART_RANGE_OPTIONS.yearToDate,
                                CHART_RANGE_OPTIONS.threeYear,
                            ].find((e) => e === option)
                        }
                    >
                        {option}
                    </TabButton>
                </span>
            ))}
        </div>
    );
});

export default DateRangeBar;
