import { FC, memo } from "react";
import { TabButton } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { CHART_RANGE_OPTIONS, TChartRange } from "src/api/types";
import { EChartType } from "src/components/market/types";

type Props = {
    selectedChartRange: TChartRange;
    onSelectChartRange: (range: TChartRange) => void;
    selectedChartType: EChartType;
    isKasandra?: boolean;
};

const DateRangeBar: FC<Props> = memo(function DateRangeBar({
    selectedChartRange,
    onSelectChartRange,
    selectedChartType,
    isKasandra,
}) {
    const { t } = useTranslation();
    const kasandraRangeOptions = [
        CHART_RANGE_OPTIONS.oneDay,
        CHART_RANGE_OPTIONS.oneWeek,
        CHART_RANGE_OPTIONS.oneMonth,
        CHART_RANGE_OPTIONS.oneYear,
    ];
    return (
        <div className="flex w-full justify-end border-none uppercase mb-2">
            {Object.values(
                isKasandra ? kasandraRangeOptions : CHART_RANGE_OPTIONS
            ).map((option) => (
                <span key={option.value} className="ml-1.5 mt-1.5">
                    <TabButton
                        open={selectedChartRange === option.value}
                        onClick={() => onSelectChartRange(option.value)}
                        variant="extraSmall"
                        className="capitalize"
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
                        {`${option.prefix}${t(option.translationKey)}`}
                        {/* {option.value} */}
                    </TabButton>
                </span>
            ))}
        </div>
    );
});

export default DateRangeBar;
