import { TNotificationDevice } from "src/api/types/notifications";
import { TPagination } from "../baseTypes";

export type TRemoteFCMDevice = {
    registration_id: string;
};

export type TRemoteNotificationDevice = TRemoteFCMDevice & {
    id: number;
    is_active: boolean;
};

export type TGetNotificationDeviceRequest = {
    id: number;
};

export type TGetNotificationDevicesRequest = {
    page?: number;
    limit?: number;
};

export type TGetNotificationDeviceRawResponse = TRemoteNotificationDevice;

export type TGetNotificationDevicesRawResponse = TPagination & {
    results: TRemoteNotificationDevice[];
};

export type TGetNotificationDeviceResponse = TNotificationDevice;
export type TGetNotificationDevicesResponse = TPagination & {
    results: TNotificationDevice[];
};
