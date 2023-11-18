import { FC, useEffect, useState } from "react";
import CONFIG from "src/config";
import CountdownModule from "./CountdownModule";

const linkToTTDDefinition =
    "https://eips.ethereum.org/EIPS/eip-3675#terminal-total-difficulty-vs-block-number";

const safeTimeSubstract = (t1: number, t2: number) =>
    t1 - t2 >= 0 ? t1 - t2 : 0;

interface IProps {
    currBlockNumber: number;
    targetBlockNumber: number;
    targetDate: number; // unix timestamp in s
    targetTTD: string;
    isLoading: boolean;
}

const MergeCountdownModule: FC<IProps> = ({
    currBlockNumber,
    targetBlockNumber,
    targetDate,
    targetTTD,
    isLoading,
}) => {
    const [remainingBlocks, setRemainingBlocks] = useState<number>(
        safeTimeSubstract(targetBlockNumber, currBlockNumber)
    );

    useEffect(() => {
        const blockIntervalId = setInterval(() => {
            setRemainingBlocks((prevState) => safeTimeSubstract(prevState, 1));
        }, CONFIG.NUMBERS.ETH_AVG_BLOCK_TIME * 1000);
        return () => {
            clearInterval(blockIntervalId);
        };
        // run only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const expectedDate = new Date(targetDate * 1000);

    const items = [
        [
            {
                title: "Expected date",
                value: expectedDate.toUTCString(),
            },
            {
                title: "Estimated Block Height",
                value: targetBlockNumber,
            },
        ],
        [
            {
                title: "Remaining Blocks",
                value: remainingBlocks,
            },
            {
                title: (
                    <>
                        Merge{" "}
                        <a
                            href={linkToTTDDefinition}
                            target="_blank"
                            rel="noreferrer"
                        >
                            TTD
                        </a>
                    </>
                ),
                value: targetTTD,
            },
        ],
    ];

    return (
        <CountdownModule
            targetDate={targetDate}
            isLoading={isLoading}
            announcement={
                <>
                    The Ethereum 2.0 era has begun!
                    <br />
                    <span role="img" aria-label="yay!">
                        🚀
                    </span>
                </>
            }
            items={items}
        />
    );
};

export default MergeCountdownModule;
