export type TNotificationDevice = {
    id: number;
    regId: string;
    active: boolean;
};

export type TNotificationMessage = {
    id: string;
    hash: string | undefined;
    title: string | undefined;
    body: string | undefined;
    read: boolean;
    endsAt: string | undefined;
    startsAt: string | undefined;
    url: string | undefined;
};
