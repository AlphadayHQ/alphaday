import { FC, useMemo } from "react";
import { CollapseListItem, themeColors } from "@alphaday/ui-kit";
import moment from "moment";
import { TAgendaItem } from "src/api/types/agenda";
import { Logger } from "src/api/utils/logging";
import { remarkRegex, REMARK_URL_REGEX } from "src/api/utils/textUtils";
import { useDynamicWidgetItem } from "../hooks/useDynamicWidgetItem";

const PLUGINS = [remarkRegex(REMARK_URL_REGEX)];

interface Item {
    item: TAgendaItem;
    setItemsHeight: React.Dispatch<React.SetStateAction<number>>;
    catColor: string;
}

const AgendaItem: FC<Item> = ({ item, catColor, setItemsHeight }) => {
    const { descHeight, descHeightRef, openAccordion, toggleAccordion } =
        useDynamicWidgetItem({ setItemsHeight });

    const paddedDescHeight = useMemo(
        () => descHeight && descHeight + 5,
        [descHeight]
    ); // 5px comes from padding top in style

    const {
        name,
        category,
        date,
        description,
        author,
        source_name: source,
    } = item;

    let dateField;
    let timeField;
    if (date === undefined) {
        dateField = "TBD";
        timeField = "";
    } else {
        try {
            if (moment(date, "MMMM DD, YYYY").isValid()) {
                dateField = moment(date, "MMMM DD, YYYY").format("MMM Do,");
                timeField = moment(date, "MMMM DD, YYYY").format("hh:mm a");
            } else {
                dateField = date;
            }
        } catch (e) {
            Logger.error("AgendaItem: could not parse date:", e);
        }
    }

    return (
        <div
            className="list-group-item flex flex-row items-start p-[14px] w-full bg-backgroundVariant800 border-none pb-0 pt-5 cursor-pointer flex-grow hover:bg-backgroundVariant900 active:bg-backgroundVariant1000 hover:[&_.info]:border-none"
            onClick={toggleAccordion}
            tabIndex={-1}
            role="button"
        >
            <div className="h-full min-w-[135px] flex flex-col items-end p-[5px_15px_5px_0]">
                <div className="flex justify-end min-w-[58px] tracking-tight-[0.5px] text-primaryVariant100 m-[0_0_3px] fontGroup-supportBold">
                    {dateField}
                    {timeField && (
                        <span className="ml-2 fontGroup-normal text-primary">
                            {timeField}
                        </span>
                    )}
                </div>

                {source && (
                    <div className="fontGroup-normal text-primary text-end">
                        {source}
                    </div>
                )}
                {category && (
                    <div
                        className="fontGroup-normal text-end"
                        style={{
                            color: catColor || themeColors.secondaryOrange,
                        }}
                    >
                        {category}
                    </div>
                )}
            </div>
            <div className="relative h-full">
                <span
                    className="absolute top-1.5 left-[-4.5px] w-3 h-3 rounded-[10px]"
                    style={{
                        backgroundColor:
                            catColor || themeColors.secondaryOrange,
                    }}
                />
            </div>
            <CollapseListItem
                title={name}
                openAccordion={openAccordion}
                author={author}
                descHeightRef={descHeightRef}
                description={description}
                variant="agenda"
                fullHeight={paddedDescHeight}
                remarkPlugins={PLUGINS}
            />
        </div>
    );
};

export default AgendaItem;
