import { FC, useMemo } from "react";
import moment from "moment";
import { TCounterData } from "src/api/types";
import assert from "src/api/utils/assert";
import { Logger } from "src/api/utils/logging";
import CountdownModule from "src/components/countdown/CountdownModule";
import { IModuleContainer } from "src/types";

const DEFAULT_TARGET_DATE = moment().unix();

const CountdownContainer: FC<IModuleContainer<TCounterData[] | null>> = ({
    moduleData,
}) => {
    const isBeaconWidget = moduleData.widget.slug === "merge_countdown_widget";

    const data = useMemo(() => {
        try {
            const [rawData] = moduleData.widget.custom_data ?? [];
            assert(
                rawData.announcement !== undefined,
                "CountdownContainer: data must contain announcement"
            );
            assert(
                rawData.date !== undefined,
                "CountdownContainer: data must contain date"
            );
            // @ts-expect-error this is handled above
            return rawData as TCounterData;
        } catch (error) {
            return undefined;
        }
    }, [moduleData.widget.custom_data]);

    if (data === undefined) {
        return null;
    }

    // TODO(v-almonacid): remove this block when format_structure is removed from db model
    const legacyData = moduleData.widget.format_structure?.data;
    if (Array.isArray(legacyData) && legacyData.length > 0) {
        Logger.warn(
            `CountdownContainer: widget ${moduleData.widget.name} contains data in format_structure which has been deprecated`
        );
    }

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
