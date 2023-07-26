import { TItem } from "src/types";

export const remoteRoadmapMock: TItem[] = [
    {
        id: "2",
        date: new Date("december 1 2020").toString(),
        category: "0",
        name: "Beacon Chain goes Live",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        url: "https://test.test.com",
        status: "1",
    },
    {
        id: "3",
        date: new Date("june 27 2022").toString(),
        category: "245895",
        name: "Goerli Testnet Merges Beacon Chain",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        url: "https://test.test.com",
        status: "1",
    },
    {
        id: "4",
        date: new Date("September 15 2022").toString(),
        category: "12458950",
        name: "The Merge",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        url: "https://test.test.com",
        status: "0",
    },
];
