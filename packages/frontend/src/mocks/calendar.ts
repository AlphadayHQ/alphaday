import { TRemoteEvent } from "src/api/services";
import { v4 as uuid4 } from "uuid";

export const remoteEventsMock: TRemoteEvent[] = [
    {
        hash: uuid4(),
        id: 1,
        title: "Event 1",
        source: {
            name: "Source 1",
            slug: "source-1",
            icon: "https://source-1.com/icon.png",
        },
        tags: [],
        item_type: "Meetup",
        starts_at: "2020-01-01",
        ends_at: "2020-01-01",
        block_number: 3,
    },
];
