export type Organizer = string;
export type Speaker = string;
export type TEventSource = {
    name: string;
    slug: string;
    icon: string;
};

export type TEvent = {
    id: string;
    eventRegLink?: string;
    title: string;
    source: TEventSource;
    type?: string;
    start: string;
    end: string;
    location?: string;
    // TODO: styling attributes should be removed
    backgroundColor?: string;
    borderColor?: string;
};
export type TEventDetails = {
    id: string;
    created?: string; // 2022-03-09T14:35:28.009Z,
    modified?: string; // 2022-03-09T14:35:28.009Z,
    voteScore?: number;
    numVoteUp?: number;
    numVoteDown?: number;
    eventRegLink?: string;
    title: string;
    source: TEventSource;
    description?: string;
    type?: string;
    start: string; // 2022-03-09T14:35:28.010Z,
    end: string; // 2022-03-09T14:35:28.010Z,
    allDay: boolean;
    location?: string;
    image?: string;
    visible?: boolean;
    blockNumber?: number;
    price?: number;
    organizers: Organizer[];
    speakers: Speaker[];
    // TODO: styling attributes should be removed
    backgroundColor?: string;
    borderColor?: string;
};
