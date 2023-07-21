import { TNotificationMessage } from "src/api/types";

export const notificationsMock: TNotificationMessage[] = [
    {
        id: "1",
        hash: "1",
        title: "Beacon Chain goes Live",
        body: "Lorem ipsum dolor sit amet, consectetur",
        startsAt: new Date("december 1 2020").toString(),
        endsAt: new Date("december 31 2020").toString(),
        url: "https://ethereum.org/en/eth2/beacon-chain/",
        read: false,
    },
    {
        id: "2",
        hash: "2",
        title: "Ethereum 2.0",
        body: "Lorem ipsum dolor sit amet, consectetur",
        startsAt: new Date("december 1 2020").toString(),
        endsAt: new Date("december 31 2020").toString(),
        url: "https://ethereum.org/en/eth2/",
        read: false,
    },
    {
        id: "3",
        hash: "3",
        title: "Ethereum 2.0",
        body: "Lorem ipsum dolor sit amet, consectetur",
        startsAt: new Date("december 1 2020").toString(),
        endsAt: new Date("december 31 2020").toString(),
        url: "https://ethereum.org/en/eth2/",
        read: true,
    },
];
