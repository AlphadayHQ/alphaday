import { TEvent, TEventDetails } from "src/api/types";

export const staticEvents: TEvent[] = [
    {
        id: "Hk10a4183a2148482922d7wg62ad36efd",
        title: "Hackathon Increase Snapshot",
        source: {
            name: "Coinmarketcal (Events)",
            slug: "coinmarketcal_event",
            icon: "https://api.alphaday.com/media/default_icon.png",
        },
        eventRegLink:
            "https://coinmarketcal.com/event/reward-increase-snapshot-112079",
        type: "Hk",
        start: "2022-04-13T00:12:00Z",
        end: "2022-04-17T00:00:00Z",
        location: "online",
        backgroundColor: "rgb(249, 65, 68)",
        borderColor: "rgb(249, 65, 68)",
    },
    {
        id: "e10a4183a214848292bea45d2ad36efd",
        title: "Reward Increase Snapshot",
        source: {
            name: "Coinmarketcal (Events)",
            slug: "coinmarketcal_event",
            icon: "https://api.alphaday.com/media/default_icon.png",
        },
        eventRegLink:
            "https://coinmarketcal.com/event/reward-increase-snapshot-112079",
        type: "MU",
        start: "2022-04-11T00:12:00Z",
        end: "2022-04-14T00:00:00Z",
        location: "online",
        backgroundColor: "rgb(243, 114, 44)",
        borderColor: "rgb(243, 114, 44)",
    },
];

export const staticEvent: TEventDetails = {
    id: "Hk10a4183a2148482922d7wg62ad36efd",
    title: "Hackathon Increase Snapshot",
    source: {
        name: "Coinmarketcal (Events)",
        slug: "coinmarketcal_event",
        icon: "https://api.alphaday.com/media/default_icon.png",
    },
    eventRegLink:
        "https://coinmarketcal.com/event/reward-increase-snapshot-112079",
    visible: true,
    description: "test test test test",
    type: "Hk",
    allDay: false,
    organizers: [],
    speakers: [],
    start: "2022-04-13T00:12:00Z",
    end: "2022-04-17T00:00:00Z",
    location: "online",
    image: "https://d32bfp67k1q0s7.cloudfront.net/9ba131defec97200c705e4981645d608.png",
    price: 0,
    backgroundColor: "rgb(249, 65, 68)",
    borderColor: "rgb(249, 65, 68)",
};
