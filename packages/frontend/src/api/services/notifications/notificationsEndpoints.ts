import { TNotificationDevice } from "src/api/types";
import CONFIG from "src/config/config";
import { alphadayApi } from "../alphadayApi";
import {
    TGetNotificationDeviceRequest,
    TRemoteFCMDevice,
    TRemoteNotificationDevice,
} from "./types";

const { NOTIFICATIONS } = CONFIG.API.DEFAULT.ROUTES;

export const notificationsApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getDevice: builder.query<
            TNotificationDevice,
            TGetNotificationDeviceRequest
        >({
            query: (req) => ({
                url: `${NOTIFICATIONS.BASE}${NOTIFICATIONS.DEVICE_BY_ID(
                    req.id
                )}`,
            }),
            transformResponse: (r: TRemoteNotificationDevice) => {
                return {
                    id: r.id,
                    regId: r.registration_id,
                    active: r.is_active,
                };
            },
        }),
        registerDevice: builder.mutation<TNotificationDevice, TRemoteFCMDevice>(
            {
                query: ({ registration_id }) => ({
                    url: NOTIFICATIONS.BASE,
                    method: "POST",
                    body: {
                        registration_id,
                    },
                }),
                transformResponse: (r: TRemoteNotificationDevice) => {
                    return {
                        id: r.id,
                        regId: r.registration_id,
                        active: r.is_active,
                    };
                },
            }
        ),
        updateDevice: builder.mutation<
            TNotificationDevice,
            TGetNotificationDeviceRequest & TRemoteFCMDevice
        >({
            query: ({ id, registration_id }) => ({
                url: `${NOTIFICATIONS.BASE}${NOTIFICATIONS.DEVICE_BY_ID(id)}`,
                method: "PUT",
                body: {
                    registration_id,
                },
            }),
            transformResponse: (r: TRemoteNotificationDevice) => {
                return {
                    id: r.id,
                    regId: r.registration_id,
                    active: r.is_active,
                };
            },
        }),
        removeDevice: builder.mutation<
            TNotificationDevice,
            TGetNotificationDeviceRequest
        >({
            query: (req) => ({
                url: `${NOTIFICATIONS.BASE}${NOTIFICATIONS.DEVICE_BY_ID(
                    req.id
                )}`,
                method: "DELETE",
                body: undefined,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetDeviceQuery,
    useRemoveDeviceMutation,
    useRegisterDeviceMutation,
    useUpdateDeviceMutation,
} = notificationsApi;
