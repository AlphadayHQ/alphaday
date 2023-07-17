import { TEvent, TEventDetails } from "src/api/types";
import { TRemoteTagReadOnly, TRemoteTag, TPagination } from "../baseTypes";

/**
 * Primitive types
 */

export type TRemoteOrganizer = {
    name: string;
    url?: string;
    image: string;
    description?: string;
    profession?: string;
};

export type TRemoteSpeaker = {
    name: string;
    avatar: string;
    description?: string;
    company?: string;
    profession?: string;
};

export type TRemoteEventSource = {
    name: string;
    slug: string;
    icon: string;
};

export type TBaseEvent = {
    url?: string;
    description?: string;
    // Text-format location (for now). Add 'Online' if it is an online event.
    // And, also 'On-Chain' if it's an on-chain event
    location?: string;
    price?: number;
};

export type TRemoteSuggestedEvent = TBaseEvent & {
    name: string;
    event_type: string; // Co, Hk, DC, DV, PR, ID, CC, MU, SF, HF, EDU, INT...
    organizer: string;
    start_date: string; // heads-up: may change to starts_at
    end_date: string;
};

export type TRemoteEvent = TBaseEvent & {
    hash: string;
    id: number;
    title: string;
    source: TRemoteEventSource;
    tags: TRemoteTagReadOnly[];
    item_type?: string; // eg. "Meetup"
    starts_at?: string;
    ends_at?: string;
    block_number?: number;
};

export type TRemoteEventDetails = TBaseEvent & {
    hash: string;
    id: number;
    title: string;
    source: TRemoteEventSource;
    tags: TRemoteTag[];
    is_approved: boolean;
    item_type?: string; // eg. "Meetup"
    organizers: TRemoteOrganizer[];
    speakers: TRemoteSpeaker[];
    starts_at?: string;
    ends_at?: string;
    image?: string;
    block_number?: number;
    url: string;
    description: string;
    location: string;
    price: string;
};

/**
 * Queries
 */

export type TGetEventsRequest = {
    item_type?: string;
    starts_at?: string;
    ends_at?: string;
    period_after?: string;
    period_before?: string;
    page?: number;
    limit?: number;
    tags?: string | undefined;
};

export type TGetEventRequest = {
    id: string;
};

export type TGetEventsRawResponse = TPagination & {
    results: TRemoteEvent[];
};

export type TGetEventsResponse = TPagination & {
    results: TEvent[];
};
export type TGetEventRawResponse = TRemoteEventDetails;

export type TGetEventResponse = {
    result: TEventDetails;
};
