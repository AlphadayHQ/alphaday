import { FC } from "react";

const leftPadDate: (number: number) => string = (num) => {
    if (num < 10) return `0${num}`;
    return num.toString();
};

const TimeBlock: FC<{ count: string; label: string }> = ({ count, label }) => (
    <div className="flex flex-col items-center p-2 tracking-[1px] tiny:p-[3px]">
        <div className="font-semibold text-secondaryOrange text-xl single-col:text-3xl two-col:text-4xl">
            {count}
        </div>
        <div className="text-[8px] fontGroup-normal single-col:text-xs">
            {label}
        </div>
    </div>
);

interface IProps {
    secondsToDate: number;
}

export const Timer: FC<IProps> = ({ secondsToDate }) => {
    // make sure we don't display negative values
    const nonNegativeSecondsToDate = secondsToDate >= 0 ? secondsToDate : 0;

    const secondsToDateAsDate = new Date(nonNegativeSecondsToDate * 1000);

    return (
        <div className="flex flex-row">
            <TimeBlock
                count={leftPadDate(
                    Math.floor(nonNegativeSecondsToDate / (24 * 3600))
                )}
                label="Days"
            />
            <TimeBlock count=":" label="" />
            <TimeBlock
                count={leftPadDate(secondsToDateAsDate.getUTCHours())}
                label="Hours"
            />
            <TimeBlock count=":" label="" />
            <TimeBlock
                count={leftPadDate(secondsToDateAsDate.getUTCMinutes())}
                label="Minutes"
            />
            <TimeBlock count=":" label="" />
            <TimeBlock
                count={leftPadDate(secondsToDateAsDate.getUTCSeconds())}
                label="Seconds"
            />
        </div>
    );
};
