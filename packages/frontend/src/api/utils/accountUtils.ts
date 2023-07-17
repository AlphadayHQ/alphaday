import { TRemoteAccount } from "src/api/services";
import { TCryptoAccount } from "src/api/types";
import { TPortfolioTabAccount } from "src/components/portfolio/types";
import Web3 from "web3";

/**
 * @description check whether the test account already existis in accounts
 *
 * @param accounts the existing accounts array
 * @param testAccount
 * @returns boolean
 */
export const accountExists: (
    accounts: TCryptoAccount[],
    testAccount: TCryptoAccount
) => boolean = (accounts, testAccount) => {
    return accounts.some(
        (account) =>
            (account.address !== null &&
                testAccount.address !== null &&
                account.address.toLowerCase() ===
                    testAccount.address.toLowerCase()) ||
            (account.ens != null &&
                testAccount.ens != null &&
                account.ens.toLowerCase() === testAccount.ens.toLowerCase())
    );
};

export const validateEthAddr = (addr: string | null): boolean => {
    if (addr == null) return false;
    return Web3.utils.isAddress(addr.toLowerCase());
};

const ENS_REGEX = /^.{3,}\.(eth|addr.reverse|test)$/;

/**
 * @description check that a given string is a valid ENS address
 *
 * @param ens
 * @returns boolean
 */
export const validateENSAddr = (ens: string | undefined | null): boolean => {
    if (ens == null) return false;
    return ENS_REGEX.test(ens);
};

/**
 * @description wrapper to validate an hex or ens address
 *
 * @param hexOrEnsAddress
 * @returns boolean
 */
export const validateHexOrEnsAddr = (hexOrEnsAddr: string): boolean =>
    validateEthAddr(hexOrEnsAddr) || validateENSAddr(hexOrEnsAddr);

/**
 * @description wrapper to validate a crypto account
 *
 * @param account
 * @returns boolean
 */
export const validateAccount = (account: TCryptoAccount): boolean =>
    validateEthAddr(account.address) || validateENSAddr(account.ens);

/**
 * @description - ensures that the accounts are not duplicated
 *
 * @param accounts
 */
export const removeDuplicateAccounts = <T extends TCryptoAccount>(
    accounts: T[]
): T[] => {
    return accounts.reduce((acc: T[], current: T) => {
        if (!accountExists(acc, current)) acc.push(current);
        return acc;
    }, [] as T[]);
};

export const mapAccountsToAddressArray = (
    accounts: TCryptoAccount[]
): string[] =>
    removeDuplicateAccounts(accounts).map((account) => {
        if (account.address !== null) return String(account.address);
        return String(account.ens);
    });

export const mapAccountsToEnsOrAddressArray = (
    accounts: TCryptoAccount[]
): string[] =>
    removeDuplicateAccounts(accounts).map((account) => {
        if (account.ens != null) return account.ens;
        return String(account.address);
    });

export const remoteAccountsAsCryptoAccounts = (
    remoteAccounts: TRemoteAccount[]
): TCryptoAccount[] =>
    removeDuplicateAccounts<TRemoteAccount>(remoteAccounts).map((account) => ({
        id: account.id,
        address: account.address.toLowerCase(),
        ...(account.ens != null && { ens: account.ens }),
    }));

export const mapAccountToTabAccount = (
    accounts: TCryptoAccount[],
    authWalletAccount?: TCryptoAccount
): TPortfolioTabAccount[] => {
    const filteredAccounts: TPortfolioTabAccount[] = [];
    removeDuplicateAccounts(accounts).forEach((account) => {
        if (account.address) {
            filteredAccounts.push({
                address: account.address,
                ens: account.ens,
            });
        }
    });
    // this is to ensure that the auth wallet account is always the first one
    // It's also a faster way of sorting the accounts
    return [
        ...filteredAccounts.filter(
            (account) => account.address === authWalletAccount?.address
        ),
        ...filteredAccounts.filter(
            (account) => account.address !== authWalletAccount?.address
        ),
    ];
};
