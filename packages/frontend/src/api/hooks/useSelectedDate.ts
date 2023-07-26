import { useMemo } from "react";
import { setSelectedDate, selectSelectedDate } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";

interface ISelectedDate {
    selectedDate: Date;
    setSelectedDate: (d: Date) => void;
}

export const useSelectedDate: (widgetHash: string) => ISelectedDate = (
    widgetHash
) => {
    const dispatch = useAppDispatch();

    const dateString = useAppSelector(selectSelectedDate(widgetHash));
    const selectedDate = useMemo(
        () => (dateString ? new Date(dateString) : new Date()),
        [dateString]
    );

    const setDate = (d: Date) =>
        dispatch(setSelectedDate({ date: d.toISOString(), widgetHash }));

    return {
        selectedDate,
        setSelectedDate: setDate,
    };
};
