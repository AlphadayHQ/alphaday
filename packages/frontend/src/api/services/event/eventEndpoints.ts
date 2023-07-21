import queryString from "query-string";
import {
    reshapeEvents,
    reshapeEventsDetails,
} from "src/api/utils/calendarUtils";
import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetEventsRequest,
    TGetEventsRawResponse,
    TGetEventsResponse,
    TGetEventRequest,
    TGetEventResponse,
    TGetEventRawResponse,
} from "./types";

const { EVENT } = CONFIG.API.DEFAULT.ROUTES;

const eventApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getEvents: builder.query<TGetEventsResponse, TGetEventsRequest>({
            query: (req) => {
                const params: string = queryString.stringify(req);
                const path = `${EVENT.BASE}${EVENT.LIST}?${params}`;
                Logger.debug("eventEndpoints::getEvents: querying", path);
                return path;
            },
            transformResponse: (
                r: TGetEventsRawResponse
            ): TGetEventsResponse => ({
                ...r,
                results: reshapeEvents(r.results),
            }),
            keepUnusedDataFor: 60 * 5,
        }),
        getEvent: builder.query<TGetEventResponse, TGetEventRequest>({
            query: (req) => {
                return `${EVENT.BASE}/${String(req.id)}`;
            },
            transformResponse: (
                r: TGetEventRawResponse
            ): TGetEventResponse => ({
                result: reshapeEventsDetails(r),
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useGetEventQuery, useGetEventsQuery } = eventApi;
