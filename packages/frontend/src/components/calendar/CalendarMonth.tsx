import { FC, useState, memo, useCallback } from "react";
import {
    CalendarTooltip,
    Switch,
    TDatePos,
    CalendarMonth as CalMonth,
    twMerge,
} from "@alphaday/ui-kit";
import { TEvent } from "src/api/types";
import { getEventCategoryByType } from "src/api/utils/calendarUtils";
import { ReactComponent as ArrowUpSVG } from "src/assets/icons/arrow-up.svg";
import UI_CONFIG from "src/config/ui";
import { useClickOutside } from "src/hooks";
import {
    eventTooltipClickHandler,
    handleHeaderTooltips,
} from "./calendarHelpers";
import { ECalendarType, ICalendarBaseProps } from "./types";

const { Z_INDEX_REGISTRY } = UI_CONFIG;
const CAL_CONTAINER_ID = "cal-month-container";

const CalendarMonth: FC<
    ICalendarBaseProps & {
        fullCalendarWrapRef?: React.RefObject<HTMLDivElement>;
    }
> = ({
    events,
    onClickEvent,
    calendarType,
    switchCalendarType,
    showFullSize,
    catFilters,
    setCatFilters,
    toggleAllFilters,
    showAllFilters,
    allowedCategories,
    fullCalendarWrapRef,
    selectedDate,
    selectedEventDetails,
    onDatesSet,
    widgetHash,
}) => {
    const [isAlphaModalOpen, setisAlphaModalOpen] = useState(false);
    const [showAllLegends, setShowAllLegends] = useState(false);
    // const [key, setKey] = useState(0); // to force calendar to rerender

    const [clickDateEvents, setClickDateEvents] = useState<{
        date: Date | undefined;
        events: TEvent[];
        position: TDatePos;
    }>({
        date: undefined,
        events: [],
        position: { left: 0, top: 0, right: 0 },
    });

    const handleEventClick = (event: TEvent, date: Date | undefined) => {
        eventTooltipClickHandler(event, date, onClickEvent);
    };

    const handleIsAlphaModalOpen = (val: boolean) => setisAlphaModalOpen(val);
    const onCloseTooltip = useCallback(() => {
        setisAlphaModalOpen(false);
    }, []);

    const tooltipRef = useClickOutside<HTMLDivElement>(
        onCloseTooltip,
        fullCalendarWrapRef
    );

    // useEffect(() => {
    //     setKey((prev) => prev + 1);
    // }, [events, catFilters]);

    return (
        <div>
            <div
                id={CAL_CONTAINER_ID}
                className={twMerge(
                    "calendar-month",
                    showFullSize && "full-size"
                )}
            >
                {!showFullSize && (
                    <div className="flex absolute top-[12.5px] left-[10px] two-col:left-[14px] three-col:left-5">
                        <Switch
                            title="Switch Calendar Type"
                            options={["Calendar", "List"]}
                            onChange={switchCalendarType}
                            checked={calendarType === ECalendarType.List}
                        />
                    </div>
                )}
                <CalMonth
                    events={events}
                    onDatesSet={onDatesSet}
                    selectedEventDetails={selectedEventDetails}
                    catFilters={catFilters}
                    showFullSize={showFullSize}
                    selectedDate={selectedDate}
                    handleHeaderTooltips={handleHeaderTooltips}
                    widgetHash={widgetHash}
                    clickDateEvents={clickDateEvents}
                    setClickDateEvents={setClickDateEvents}
                    isAlphaModalOpen={isAlphaModalOpen}
                    handleIsAlphaModalOpen={handleIsAlphaModalOpen}
                />
                <div className="w-full flex">
                    <div className="w-full h-auto flex flex-wrap items-center mt-[10px] mr-0 mb-[10px] ml-[7px]">
                        {allowedCategories
                            .slice(0, showAllLegends ? undefined : 9)
                            .map((cat) => (
                                <span
                                    onClick={() => setCatFilters([cat])}
                                    role="button"
                                    tabIndex={0}
                                    className={`flex m-[3px_5.5px_3px_0] p-[0_3.5px_0.5px_1px] min-w-max items-center cursor-pointer text-primary rounded-sm hover:text-white ${
                                        !catFilters?.some(
                                            (c) => c.value === cat.value
                                        ) &&
                                        "opacity-60 [&_.label]:text-primary"
                                    }`}
                                    key={cat.value}
                                >
                                    <span
                                        className="w-2 h-2 rounded-full mr-[2.5px]"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="fontGroup-support label">
                                        {cat.label}
                                    </span>
                                </span>
                            ))}
                        <span
                            role="button"
                            tabIndex={0}
                            className="flex m-[3px_5.5px_3px_0] p-[0_3.5px_0.5px_1px] min-w-max items-center cursor-pointer rounded-sm hover:text-white text-btnRingVariant100 fontGroup-support"
                            onClick={() => setShowAllLegends((show) => !show)}
                        >
                            {showAllLegends ? "less" : "more"}{" "}
                            <ArrowUpSVG
                                className={showAllLegends ? "rotate-180" : ""}
                                height="10px"
                            />
                        </span>
                    </div>
                    <div className="flex justify-center items-center">
                        <label
                            htmlFor="checkbox"
                            className={twMerge(
                                "flex m-[3px_5.5px_3px_0] p-[0_3.5px_0.5px_1px] min-w-max items-center cursor-pointer text-primary rounded-sm hover:text-white switch",
                                "relative w-10 h-[22px] ml-[7px] pl-2 whitespace-nowrap rounded-[5px] my-0 mx-[10px] hover:bg-backgroundVariant200 group",
                                showAllFilters &&
                                    "[&_.switch-knob]:translate-x-5"
                            )}
                            title="Toggle All Filters  On/Off"
                        >
                            <input
                                id="checkbox"
                                type="checkbox"
                                aria-label="checkbox"
                                className="hidden w-full"
                                onClick={toggleAllFilters}
                                checked={showAllFilters}
                                readOnly
                            />
                            <span className="w-10 h-full flex items-center absolute bottom-0 right-0 rounded-[22px] cursor-pointer overflow-hidden transition-all duration-200">
                                <span className="switch-knob absolute w-[13px] h-[13px] bg-primary rounded-full transition-all translate-x-0 group-hover:bg-white" />
                                <span
                                    className="w-[22px] absolute right-[13px] h-[5px] rounded-sm leading-[104%] opacity-60 bg-primary group-hover:bg-white"
                                    style={{
                                        zIndex: Z_INDEX_REGISTRY.CALENDAR_FILTER_TOGGLE,
                                    }}
                                />
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            {isAlphaModalOpen &&
                clickDateEvents?.date &&
                clickDateEvents.events.length > 0 && (
                    <CalendarTooltip
                        events={clickDateEvents.events}
                        date={String(clickDateEvents.date)}
                        width="300px"
                        handleEventClick={(event) =>
                            handleEventClick(event, clickDateEvents.date)
                        }
                        tooltipRef={tooltipRef}
                        position={clickDateEvents.position}
                        catFilters={catFilters}
                        isFullsize={!!showFullSize}
                        getEventCategoryByType={getEventCategoryByType}
                    />
                )}
        </div>
    );
};

export default memo(CalendarMonth);
