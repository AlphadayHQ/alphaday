import { TEvent, TEventDetails } from "src/api/types";
import { TEventCategory } from "../types";

export enum ECalendarType {
    List = "list",
    Month = "month",
}

export interface ICalendarBaseProps {
    events: TEvent[] | undefined;
    isLoadingEvents?: boolean;
    isFetchingEvents?: boolean;
    fetchEvents: (d: Date) => void;
    onClickEvent?: (eId: string, eUrlTitle: string, eStart: string) => void;
    onDatesSet?: (d: string) => void;
    selectedEventDetails?: TEventDetails;
    setCatFilters: (f: TEventCategory[]) => void;
    catFilters: TEventCategory[];
    showFullSize?: boolean;
    isLoadingEventDetails?: boolean;
    selectedDate?: Date;
    calendarType: ECalendarType;
    switchCalendarType: () => void;
    widgetHash: string;
    toggleAllFilters?: () => void;
    showAllFilters?: boolean;
    widgetHeight?: number;
    allowedCategories: TEventCategory[];
}
