import { FC, ReactNode, useEffect, useState } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import moment from "moment";
import Timer from "src/components/common/timer/Timer";
import KeyValueTable from "../common/table/KeyValueTable";

interface IProps {
    targetDate: number; // unix timestamp in s
    announcement?: ReactNode;
    isLoading: boolean;
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
    isLoading,
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

    if (isLoading) {
        return <ModuleLoader $height="400px" />;
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="items-center justify-center flex m-5 tiny:m-[5px]">
                <Timer secondsToDate={secondsToDate} />
            </div>
            <div className="fontGroup-normal flex flex-col mt-[10px] ml-30px">
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
