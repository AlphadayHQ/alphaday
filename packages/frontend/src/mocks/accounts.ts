import { TRemoteAccount } from "src/api/services";
import { TPortfolioAccount } from "src/api/types";

export const accountsMock: TPortfolioAccount[] = [
    {
        id: 0,
        address: "0xD6ADa6aa41B92546bcC5a728FB025441697776C9",
    },
    {
        id: 1,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    {
        id: 2,
        address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
    },
    {
        id: 3,
        address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
    },
    {
        id: 4,
        address: null,
        ens: "example.eth",
    },
    {
        id: 5,
        address: null,
        ens: "example.eth",
    },
];

export const ensAddressesMock: string[] = [
    "alice.bob.eth",
    "bob.eth",
    "🔥🔥🔥.eth",
];

export const invalidEnsAddressesMock: string[] = [".eth", "ie.eth", "bob.com"];

export const remoteAccountsMock: TRemoteAccount[] = accountsMock.map(
    (acc, id) => ({
        id,
        address: acc.address ?? "0x0",
    })
);
