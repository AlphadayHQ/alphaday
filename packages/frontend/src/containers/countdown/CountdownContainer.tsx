import { FC } from "react";
import moment from "moment";
import { TCounterData } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CountdownModule from "src/components/countdown/CountdownModule";
import { IModuleContainer } from "src/types";

const DEFAULT_TARGET_DATE = moment().unix();

const CountdownContainer: FC<IModuleContainer<TCounterData[]>> = ({
    moduleData,
}) => {
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

    return (
        <CountdownModule
            targetDate={targetDate}
            announcement={
                isBeaconWidget ? (
                    <>
                        The Ethereum 2.0 era has begun!
                        <br />
                        <span role="img" aria-label="yay!">
                            🚀
                        </span>
                    </>
                ) : (
                    data.announcement
                )
            }
            items={data.items}
        />
    );
};

export default CountdownContainer;
