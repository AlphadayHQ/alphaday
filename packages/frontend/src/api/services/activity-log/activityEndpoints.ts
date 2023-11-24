import CONFIG from "../../../config/config";
import { alphadayApi } from "../alphadayApi";
import { TActivityLogRequest, TActivityLogResponse } from "./types";

const API_CONFIG = CONFIG.API.DEFAULT;
const { ACTIVITY_LOG } = API_CONFIG.ROUTES;

const activityLogsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        sendActivityLog: builder.mutation<
            TActivityLogResponse,
            TActivityLogRequest
        >({
            query: (request) => ({
                url: `${ACTIVITY_LOG.BASE}${ACTIVITY_LOG.DEFAULT}`,
                method: "POST",
                body: request,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useSendActivityLogMutation } = activityLogsApi;
