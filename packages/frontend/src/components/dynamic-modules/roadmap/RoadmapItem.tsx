import { FC, useMemo } from "react";
import { CollapseListItem } from "@alphaday/ui-kit";
import moment from "moment-with-locales-es6";
import { useWidgetBreakpoints } from "src/api/hooks";
import { Logger } from "src/api/utils/logging";
import { REMARK_URL_REGEX, remarkRegex } from "src/api/utils/textUtils";
import { useDynamicWidgetItem } from "../hooks/useDynamicWidgetItem";
import { ERoadmapStatus } from "../types";

const PLUGINS = [remarkRegex(REMARK_URL_REGEX)];

interface IList {
    date: string | undefined;
    title: string;
    desc: string;
    blockNo: number;
    status: ERoadmapStatus;
    setItemsHeight: React.Dispatch<React.SetStateAction<number>>;
}

const RoadmapItem: FC<IList> = ({
    date,
    title,
    desc,
    blockNo,
    status,
    setItemsHeight,
}) => {
    const { descHeight, descHeightRef, openAccordion, toggleAccordion } =
        useDynamicWidgetItem({ setItemsHeight });

    const paddedDescHeight = useMemo(
        () => descHeight && descHeight + 5,
        [descHeight]
    ); // 5px comes from padding top in style

    const widgetSize = useWidgetBreakpoints([450]);
    const dateField = (() => {
        if (!date) return "TBD";
        try {
            if (moment(date, "MMMM DD, YYYY").isValid()) {
                return moment(date, "MMMM DD, YYYY").format(
                    widgetSize === "lg" ? "MMMM DD, YYYY" : "MMM DD, YY"
                );
            }
        } catch (e) {
            Logger.error("RoadmapItem: could not parse date:", e);
        }
        return date;
    })();

    const getStatusClass = () => {
        switch (status) {
            case ERoadmapStatus.Upcoming:
                return "";
            case ERoadmapStatus.Completed:
                return "bg-secondaryOrange";
            case ERoadmapStatus.InProgress:
                return "bg-secondaryOrangeSoda";
            default:
                return "";
        }
    };

    return (
        <div
            tabIndex={0}
            role="button"
            onClick={toggleAccordion}
            className="flex flex-row items-stretch p-[14px] w-full bg-background border-none pb-0 pt-5 cursor-pointer flex-grow relative hover:bg-background active:bg-background [&:nth-of-type(1)]:pt-2 [&:nth-of-type(1)_.line]:h-full [&:nth-of-type(1)_.line]:top-2"
        >
            <div className="h-full min-w-[120px] flex flex-col items-end pt-[5px] pr-4 pb-[5px] pl-0">
                <div className="flex justify-end text-end min-w-[58px] mr-[5px] text-primaryVariant100 mb-[3px]">
                    {dateField}
                </div>
                {(blockNo || !isNaN(blockNo)) && (
                    <div className="">
                        Block {new Intl.NumberFormat("en-US").format(blockNo)}
                    </div>
                )}
            </div>
            <div className="relative">
                <span
                    className={`line absolute -top-5 w-[3px] bg-borderLine h-[calc(100%_+_21px)] ${getStatusClass()}`}
                />
                <span
                    className={`absolute top-1.5 -left-[4.5px] w-3 h-3 rounded-full bg-borderLine ${getStatusClass()}`}
                />
            </div>
            <CollapseListItem
                openAccordion={openAccordion}
                title={title}
                descHeightRef={descHeightRef}
                description={desc}
                variant="roadmap"
                fullHeight={paddedDescHeight}
                remarkPlugins={PLUGINS}
            />
        </div>
    );
};

export default RoadmapItem;
