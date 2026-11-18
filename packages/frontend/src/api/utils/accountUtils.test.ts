/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
    accountsMock,
    ensAddressesMock,
    invalidEnsAddressesMock,
    remoteAccountsMock,
} from "../../mocks/accounts";
import {
    accountExists,
    mapAccountsToAddressArray,
    remoteAccountsAsCryptoAccounts,
    validateENSAddr,
    validateEthAddr,
    validateAccount,
} from "./accountUtils";
import { isString } from "./helpers";

describe("accountExists", () => {
    it("should return true if account exists", () => {
        const hexAccount = accountsMock[2];
        const ensAccount = accountsMock[4];
        expect(accountExists(accountsMock, hexAccount)).toEqual(true);
        expect(
            accountExists(accountsMock, {
                ...hexAccount,
                address: hexAccount.address?.toUpperCase() || null,
            })
        ).toEqual(true);

        const hexAcc0 = accountsMock[0].address;
        const nonNormalisedAddr = hexAcc0
            ? hexAcc0.slice(0, 2) +
              hexAcc0.slice(2, 10).toLowerCase() +
              hexAcc0.slice(10)
            : null;
        expect(
            accountExists(accountsMock, {
                ...accountsMock[0],
                address: nonNormalisedAddr,
            })
        ).toEqual(true);
        expect(accountExists(accountsMock, ensAccount)).toEqual(true);
        expect(
            accountExists(accountsMock, {
                ...ensAccount,
                ens: ensAccount.ens?.toUpperCase(),
            })
        ).toEqual(true);
    });

    it("should return false if account does not exist", () => {
        const nonExistingAccounts = [
            {
                id: 24,
                address: "0xx",
            },
            {
                id: 34509,
                ens: ".example.eth",
                address: null,
            },
        ];
        nonExistingAccounts.forEach((account) => {
            expect(accountExists(accountsMock, account)).toEqual(false);
        });
    });
});

describe("validateEthAddr", () => {
    it("should return true if address is valid", () => {
        const { address } = accountsMock[2];
        expect(validateEthAddr(address ?? "0x0")).toEqual(true);
    });

    it("should return false if address is invalid", () => {
        expect(validateEthAddr("0xx")).toEqual(false);
    });

    // behaviour kept from Web3.utils.isAddress(addr.toLowerCase())
    it.each([
        ["0x52908400098527886E0F7030069857D2E4169EE7", true], // mixed case, checksum ignored
        ["0x52908400098527886e0f7030069857d2e4169ee8", true], // lowercase
        ["52908400098527886e0f7030069857d2e4169ee7", true], // no 0x prefix
        ["0X52908400098527886E0F7030069857D2E4169EE7", true], // uppercase 0X
        ["0x52908400098527886e0f7030069857d2e4169ee", false], // 39 hex digits
        ["0x52908400098527886e0f7030069857d2e4169eeg", false], // non-hex char
        ["vitalik.eth", false],
        ["", false],
    ])("validateEthAddr(%j) is %s", (addr, expected) => {
        expect(validateEthAddr(addr)).toBe(expected);
    });
});

describe("validateENSAddr", () => {
    it("should return true if ens address is valid", () => {
        ensAddressesMock.forEach((addr) =>
            expect(validateENSAddr(addr)).toEqual(true)
        );
    });

    it("should return false if ens address is invalid", () => {
        invalidEnsAddressesMock.forEach((addr) =>
            expect(validateENSAddr(addr)).toEqual(false)
        );
    });
});

describe("validateAccount", () => {
    it("should return true if address or ens is valid", () => {
        const hexAccount = accountsMock[2];
        const ensAccount = accountsMock[0];

        expect(validateAccount(hexAccount)).toEqual(true);
        expect(validateAccount(ensAccount)).toEqual(true);
    });

    it("should return false if ens address is invalid", () => {
        const invalidAccounts = [
            {
                id: 0,
                address: "0xx",
            },
            {
                id: 1,
                ens: invalidEnsAddressesMock[0],
                address: null,
            },
        ];
        expect(validateAccount(invalidAccounts[0])).toEqual(false);
        expect(validateAccount(invalidAccounts[1])).toEqual(false);
    });
});

describe("mapAccountsToAddressArray", () => {
    const addresses = mapAccountsToAddressArray(accountsMock);

    it("should return an array of addresses of strings", () => {
        expect(Array.isArray(addresses)).toBe(true);

        addresses.forEach((addrOrEns) => {
            expect(isString(addrOrEns)).toBe(true);
            expect(
                validateEthAddr(addrOrEns) || validateENSAddr(addrOrEns)
            ).toBe(true);
        });
    });

    it("should remove duplicates from returned array", () => {
        expect(addresses.length).toEqual(4);
    });
});

describe("remoteAccountsAsCryptoAccounts", () => {
    const accounts = remoteAccountsAsCryptoAccounts(remoteAccountsMock);

    it("should return an array of crypto accounts", () => {
        expect(Array.isArray(accounts)).toEqual(true);
        expect(accounts[0].id).toEqual(accountsMock[0].id);
    });

    it("should remove duplicates from returned array", () => {
        expect(accounts.length).toEqual(4);
    });
});
