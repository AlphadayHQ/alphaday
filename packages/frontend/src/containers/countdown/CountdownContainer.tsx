import { FC } from "react";
import moment from "moment";
import { useGetEthereumLastBlockQuery } from "src/api/services";
import { TCounterData } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CountdownModule from "src/components/countdown/CountdownModule";
import MergeCountdownModule from "src/components/countdown/MergeCountdownModule";
import CONFIG from "src/config";
import { IModuleContainer } from "src/types";

// source: https://797.io/themerge/
const DEFAULT_TARGET_DATE = moment("2022-09-15").unix();
const DEFAULT_TARGET_BLOCK_NUMBER = 15539054;

const BLOCK_SAMPLE_DATE = "2022-08-29T21:58:19.072Z";
const BLOCK_NUMBER_AT_DATE = 15436571; // BN at 2022-08-29T21:58:19.072Z
const defaultBlockNumber =
    BLOCK_NUMBER_AT_DATE +
    Math.floor(
        (moment().unix() - moment(BLOCK_SAMPLE_DATE).unix()) /
            CONFIG.NUMBERS.ETH_AVG_BLOCK_TIME
    );
const TARGET_TTD = "58 750 000 000 000 000 000";

const CountdownContainer: FC<IModuleContainer<TCounterData[]>> = ({
    moduleData,
}) => {
    const { data: lastBlockData, isLoading } = useGetEthereumLastBlockQuery(
        undefined,
        {
            pollingInterval: 60_000,
            refetchOnMountOrArgChange: true,
        }
    );

    const [data] = moduleData.widget.format_structure.data || [];
    const isBeaconWidget = moduleData.widget.slug === "merge_countdown_widget";

    let targetDate: number;
    try {
        targetDate =
            data.date !== undefined
                ? moment(data.date).unix()
                : DEFAULT_TARGET_DATE;
    } catch (e) {
        Logger.error("CountdownContainer: could not parse data", e);
        targetDate = DEFAULT_TARGET_DATE;
    }

    const currBlockNumber = lastBlockData
        ? Number(lastBlockData.value)
        : defaultBlockNumber;

    const targetBlockNumber = data?.block_height
        ? Number(data.block_height)
        : DEFAULT_TARGET_BLOCK_NUMBER;

    return isBeaconWidget ? (
        <MergeCountdownModule
            targetDate={targetDate}
            isLoading={isLoading}
            currBlockNumber={currBlockNumber}
            targetBlockNumber={targetBlockNumber}
            targetTTD={TARGET_TTD}
        />
    ) : (
        <CountdownModule
            targetDate={targetDate}
            isLoading={isLoading}
            announcement={data.announcement}
            items={data.items}
        />
    );
};

export default CountdownContainer;
