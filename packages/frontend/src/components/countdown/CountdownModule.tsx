import { FC, ReactNode, useEffect, useState } from "react";
import { KeyValueTable, Timer, twMerge } from "@alphaday/ui-kit";
import moment from "moment";

interface IProps {
    targetDate: number; // unix timestamp in s
    announcement?: ReactNode;
    children?: ReactNode;
    items?: {
        title: ReactNode;
        value: ReactNode;
    }[][];
}

const CountdownModule: FC<IProps> = ({
    targetDate,
    announcement,
    children,
    items,
}) => {
    const [secondsToDate, setSecondsToDate] = useState<number>(
        targetDate - moment().unix()
    );

    useEffect(() => {
        const dateIntervalId = setInterval(() => {
            setSecondsToDate(targetDate - moment().unix());
        }, 1000);

        return () => {
            clearInterval(dateIntervalId);
        };
        // run only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col flex-1">
            <div className="items-center justify-center flex m-5 tiny:m-[5px]">
                <Timer secondsToDate={secondsToDate} />
            </div>
            <div
                className={twMerge(
                    "fontGroup-normal flex flex-col ml-30px",
                    secondsToDate <= 0 && "my-[10px]"
                )}
            >
                {secondsToDate <= 0 && (
                    <div className="flex flex-col text-secondaryOrange fontGroup-major uppercase justify-center items-center">
                        {announcement}
                    </div>
                )}
                {items && <KeyValueTable items={items} />}
                {children}
            </div>
        </div>
    );
};

export default CountdownModule;
