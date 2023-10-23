import {
    TRemoteCustomDatum,
    TRemoteCustomLayoutEntry,
    TRemoteCustomRowProps,
} from "../services";

export type TCustomItem = TRemoteCustomDatum;

export type TCustomLayoutEntry = TRemoteCustomLayoutEntry;

export type TCustomRowProps = TRemoteCustomRowProps;

export type TCustomSeries = {
    name?: string;
    data: (number | string)[];
}[];
