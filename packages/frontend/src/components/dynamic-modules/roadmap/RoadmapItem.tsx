import { FC, useMemo } from "react";
import { CollapseListItem } from "@alphaday/ui-kit";
import moment from "moment";
import { useWidgetSize } from "src/api/hooks";
import { Logger } from "src/api/utils/logging";
import { useDynamicWidgetItem } from "../hooks/useDynamicWidgetItem";
import { ERoadmapStatus } from "../types";

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

    const widgetSize = useWidgetSize([450]);
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
            className="flex flex-row items-start p-[14px] w-full bg-backgroundVariant800 border-none pb-0 pt-5 cursor-pointer flex-grow hover:bg-backgroundVariant900 hover:[&_.right]:border hover:[&_.right]:border-backgroundVariant900 active:bg-backgroundVariant1000"
        >
            <div className="h-full min-w-[120px] flex flex-col items-end pt-[5px] pr-[15px] pb-[5px] pl-0">
                <div className="flex justify-end min-w-[58px] mr-[5px] text-primaryVariant100 fontGroup-mini mb-[3px]">
                    {dateField}
                </div>
                {blockNo && (
                    <div className="">
                        Block {new Intl.NumberFormat("en-US").format(blockNo)}
                    </div>
                )}
            </div>
            <div className="relatice h-full bg-primaryVariant200">
                <span
                    className={`absolute -top-5 w-[3px] bg-btnRingVariant500 ${getStatusClass()}`}
                />
                <span className="absolute top-1.5 -left-[4.5px] w-3 h-3 rounded-full bg-btnRingVariant500" />
            </div>
            <CollapseListItem
                openAccordion={openAccordion}
                title={title}
                descHeightRef={descHeightRef}
                description={desc}
                variant="roadmap"
                fullHeight={paddedDescHeight}
            />
        </div>
    );
};

export default RoadmapItem;
