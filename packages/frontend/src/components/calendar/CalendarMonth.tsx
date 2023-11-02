import { FC, useState, memo, useCallback } from "react";
import {
    CalendarTooltip,
    Switch,
    TDatePos,
    CalendarMonth as CalMonth,
} from "@alphaday/ui-kit";
import { TEvent } from "src/api/types";
import { ReactComponent as ArrowUpSVG } from "src/assets/alphadayAssets/icons/arrow-up.svg";
import { useClickOutside } from "src/hooks";
import {
    StyledWrap,
    StyledSwitcher,
    StyledLegend,
} from "./calendar-month/CalendarMonth.style";
import {
    eventTooltipClickHandler,
    handleHeaderTooltips,
} from "./calendarHelpers";
import { ECalendarType, ICalendarBaseProps } from "./types";

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
            <StyledWrap id={CAL_CONTAINER_ID} $isFullsize={!!showFullSize}>
                {!showFullSize && (
                    <StyledSwitcher>
                        <Switch
                            title="Switch Calendar Type"
                            options={["Calendar", "List"]}
                            onChange={switchCalendarType}
                            checked={calendarType === ECalendarType.List}
                        />
                    </StyledSwitcher>
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
                <StyledLegend>
                    <div className="legendWrap">
                        {allowedCategories
                            .slice(0, showAllLegends ? undefined : 9)
                            .map((cat) => (
                                <span
                                    onClick={() => setCatFilters([cat])}
                                    role="button"
                                    tabIndex={0}
                                    className={`cat-wrap ${
                                        catFilters?.some(
                                            (c) => c.value === cat.value
                                        )
                                            ? ""
                                            : "deselect"
                                    }`}
                                    key={cat.value}
                                >
                                    <span
                                        className="dot"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="label">{cat.label}</span>
                                </span>
                            ))}
                        <span
                            role="button"
                            tabIndex={0}
                            className="cat-wrap toggleLegend"
                            onClick={() => setShowAllLegends((show) => !show)}
                        >
                            {showAllLegends ? "less" : "more"}{" "}
                            <ArrowUpSVG
                                className={showAllLegends ? "toggled" : ""}
                                height="10px"
                            />
                        </span>
                    </div>
                    <div className="toggleWrap">
                        <label
                            htmlFor="checkbox"
                            className={`cat-wrap switch ${
                                showAllFilters ? "" : "hideAll"
                            }`}
                            title="Toggle All Filters  On/Off"
                        >
                            <input
                                id="checkbox"
                                type="checkbox"
                                aria-label="checkbox"
                                onClick={toggleAllFilters}
                                checked={showAllFilters}
                                readOnly
                            />
                            <span className="slider">
                                <span className="knob" />
                                <span className="line" />
                            </span>
                        </label>
                    </div>
                </StyledLegend>
            </StyledWrap>
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
                    />
                )}
        </div>
    );
};

export default memo(CalendarMonth);
