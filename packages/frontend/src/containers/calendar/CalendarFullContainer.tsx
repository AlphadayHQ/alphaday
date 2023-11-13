import { FC } from "react";
import { TUserViewWidget } from "src/api/types";
import { TCategoryData } from "src/types";
import CalendarContainer from "./CalendarContainer";

const CalendarFullContainer: FC<{
    isFullsize: boolean | undefined;
    moduleData: TUserViewWidget;
}> = ({ moduleData, isFullsize }) => {
    if (!isFullsize) return null;
    return (
        <CalendarContainer
            moduleData={moduleData as TUserViewWidget<TCategoryData[][]>}
            toggleAdjustable={() => {}}
            showFullSize={isFullsize}
        />
    );
};

export default CalendarFullContainer;
