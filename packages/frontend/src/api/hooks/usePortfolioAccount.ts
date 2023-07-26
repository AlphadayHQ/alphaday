import { useEffect, useCallback } from "react";
import {
    useSaveUserAccountMutation,
    useGetUserAccountsQuery,
    useDeleteUserAccountMutation,
} from "src/api/services";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { TPortfolioAccount } from "src/api/types";
import {
    validateAccount,
    accountExists,
    removeDuplicateAccounts,
    mapAccountsToEnsOrAddressArray,
    remoteAccountsAsCryptoAccounts,
} from "src/api/utils/accountUtils";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "../utils/toastUtils";

const portfolioFeedbackMessages = {
    success: "Your portfolio has been updated successfully",
    error: "An error occurred and we could not save your portfolio. Please try again later",
};

interface IPortfolioAccount {
    /**
     * The list of portfolio accounts
     */
    portfolioAccounts: TPortfolioAccount[];
    /**
     * The currently selected/active portfolio account
     */
    selectedPortfolioAccount: TPortfolioAccount | null;
    /**
     * Add an account to the portfolio cache and save it to the backend
     * @param account The account to add to the portfolio
     */
    addPortfolioAccount: (account: TPortfolioAccount) => void;
    /**
     * Remove an account from the portfolio cache and save it to the backend
     * @param account The account to remove from the portfolio
     */
    removePortfolioAccount: (account: TPortfolioAccount) => void;
    /**
     * Set the selected/active portfolio account
     * @param account The account to set as selected
     */
    setSelectedPortfolioAccount: (account: TPortfolioAccount) => void;
}

/**
 * This hook is responsible for managing the portfolio accounts
 */
export const usePortfolioAccount: () => IPortfolioAccount = () => {
    const dispatch = useAppDispatch();

    const portfolioAccounts = useAppSelector(userStore.selectPortfolioAccounts);

    const selectedPortfolioAccount = useAppSelector(
        userStore.selectSelectedPortfolioAccount
    );

    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);

    const [saveAccountMut] = useSaveUserAccountMutation();
    const [deleteAccountMut] = useDeleteUserAccountMutation();

    const { currentData: remoteAccounts } = useGetUserAccountsQuery(undefined, {
        skip: !isAuthenticated,
        refetchOnMountOrArgChange: true,
    });

    const setPortfolioAccounts = useCallback(
        (accounts: TPortfolioAccount[]) => {
            dispatch(userStore.setPortfolioAccounts(accounts));
        },
        [dispatch]
    );

    const setSelectedPortfolioAccount = useCallback(
        (account: TPortfolioAccount | null) => {
            dispatch(userStore.setSelectedPortfolioAccount(account));
        },
        [dispatch]
    );

    const addPortfolioAccount = useCallback(
        (account: TPortfolioAccount) => {
            Logger.debug("usePortfolioAccount:addPortfolioAccount called");

            if (!validateAccount(account)) {
                toast(
                    "You have entered an invalid address, please try again.",
                    {
                        type: EToastRole.Error,
                    }
                );
                return;
            }
            if (accountExists(portfolioAccounts, account)) {
                // do not error on purpose since there is some re-entrance due to
                // lag in state updates that trigger this function
                return;
            }

            const normalisedAccount = {
                address: account.address?.toLowerCase() ?? null,
                ens: account.ens?.toLowerCase() ?? null,
            };

            if (isAuthenticated) {
                const body = {
                    addresses: mapAccountsToEnsOrAddressArray([
                        ...portfolioAccounts,
                        normalisedAccount,
                    ]),
                };
                Logger.debug(
                    "usePortfolioAccount:addPortfolioAccount::body:",
                    body
                );
                saveAccountMut(body)
                    .unwrap()
                    .then((saveAccResponse) => {
                        Logger.debug(
                            "usePortfolioAccount:addPortfolioAccount: fulfilled. Response:",
                            saveAccResponse
                        );
                        toast(portfolioFeedbackMessages.success);
                    })
                    .catch((saveAccErr) => {
                        Logger.error(
                            "usePortfolioAccount:addPortfolioAccount: error. Error Response:",
                            saveAccErr
                        );
                        toast(portfolioFeedbackMessages.error, {
                            type: EToastRole.Error,
                        });
                    });
            }
            dispatch(userStore.addPortfolioAccount(normalisedAccount));
            dispatch(userStore.setSelectedPortfolioAccount(normalisedAccount));
        },
        [dispatch, portfolioAccounts, isAuthenticated, saveAccountMut]
    );

    const removeAccountLocally = useCallback(
        (account: TPortfolioAccount) => {
            const filteredAccounts = portfolioAccounts.filter(
                (acc) => acc.address !== account.address
            );
            setPortfolioAccounts(filteredAccounts);
            // if the removed account was previously selected, just select
            // the first available account if any
            if (
                account.address === selectedPortfolioAccount?.address ||
                filteredAccounts.length === 0
            ) {
                const newSelectedAccount = filteredAccounts[0] ?? null;
                setSelectedPortfolioAccount(newSelectedAccount);
            }
            toast(portfolioFeedbackMessages.success);
        },
        [
            portfolioAccounts,
            selectedPortfolioAccount?.address,
            setPortfolioAccounts,
            setSelectedPortfolioAccount,
        ]
    );

    const removePortfolioAccount = useCallback(
        (account: TPortfolioAccount) => {
            Logger.debug("usePortfolioAccount: removePortfolioAccount called");
            if (account.address == null && account.ens == null) {
                Logger.error(
                    "usePortfolioAccount:removePortfolioAccount: both hex and ens addresses are null, exiting..."
                );
                return;
            }
            if (!accountExists(portfolioAccounts, account)) return;
            const { id } = portfolioAccounts.filter(
                (acc) =>
                    acc.address === account.address ||
                    (acc.ens && acc.ens === account.ens) // `undefined === undefined` is true so we need to check for undefined/null explicitly
            )[0];
            Logger.debug("usePortfolioAccount: removing account id", id);
            if (id !== undefined && isAuthenticated) {
                deleteAccountMut({ id })
                    .unwrap()
                    .then((deleteAccResponse) => {
                        Logger.debug(
                            "usePortfolioAccount:removePortfolioAccount: fulfilled. Response:",
                            deleteAccResponse
                        );
                        removeAccountLocally(account);
                    })
                    .catch((deleteAccErr) => {
                        if (deleteAccErr.status === 404) {
                            // this may happen if accounts are not synced correctly
                            removeAccountLocally(account);
                            return;
                        }
                        Logger.error(
                            "usePortfolioAccount:removePortfolioAccount: error. Error Response:",
                            deleteAccErr
                        );
                        toast(portfolioFeedbackMessages.error, {
                            type: EToastRole.Error,
                        });
                    });
            } else removeAccountLocally(account);
        },
        [
            deleteAccountMut,
            isAuthenticated,
            portfolioAccounts,
            removeAccountLocally,
        ]
    );

    useEffect(() => {
        /**
         * Remote accounts are never fetched if the user is not verified
         * and so no additional checks are needed here.
         */
        if (remoteAccounts && remoteAccounts.length > 0) {
            setPortfolioAccounts(
                remoteAccountsAsCryptoAccounts(remoteAccounts)
            );
        }
    }, [remoteAccounts, setPortfolioAccounts]);

    useEffect(() => {
        if (
            portfolioAccounts.length !==
            removeDuplicateAccounts(portfolioAccounts).length
        ) {
            Logger.error(
                "usePortfolioAccount: portfolio contains duplicated accounts, it should never happen"
            );
        }
    }, [portfolioAccounts]);

    return {
        addPortfolioAccount,
        selectedPortfolioAccount,
        setSelectedPortfolioAccount,
        removePortfolioAccount,
        portfolioAccounts,
    };
};
