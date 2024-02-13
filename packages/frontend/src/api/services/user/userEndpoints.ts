import { Logger } from "src/api/utils/logging";
import CONFIG from "../../../config";
import { setWalletVerified, setAuthToken } from "../../store/slices/user";
import { setSelectedViewId } from "../../store/slices/views";
import { alphadayApi } from "../alphadayApi";
import {
    TRemoteLogin,
    TConnectUserRequest,
    TConnectUserResponse,
    TGenerateMessageRequest,
    TGenerateMessageResponse,
    TVerifySignatureRequest,
    TVerifySignatureResponse,
    TGetUserAccountsRequest,
    TGetUserAccountsResponse,
    TSaveUserAccountsRequest,
    TSaveUserAccountsResponse,
    TGetUserAccountByIdRequest,
    TGetUserAccountByIdResponse,
    TDeleteUserAccountsRequest,
    TDeleteUserAccountsResponse,
    TGetUserProfileRequest,
    TGetUserProfileResponse,
    TUpdateUserProfileFiltersRequest,
    TUpdateUserProfileFiltersResponse,
} from "./types";

const { USER } = CONFIG.API.DEFAULT.ROUTES;

const userApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserAccounts: builder.query<
            TGetUserAccountsResponse,
            TGetUserAccountsRequest
        >({
            query: () => {
                const path = `${USER.BASE}${USER.ACCOUNTS}`;
                Logger.debug("getUserAccounts: querying", path);
                return path;
            },
            providesTags: ["AccountPortfolio"],
        }),
        saveUserAccount: builder.mutation<
            TSaveUserAccountsRequest,
            TSaveUserAccountsResponse
        >({
            query: (request) => {
                const path = `${USER.BASE}${USER.MULTI_ACCOUNTS}`;
                Logger.debug("saveUserAccount: querying", path);
                return {
                    url: path,
                    method: "POST",
                    body: request,
                };
            },
            invalidatesTags: ["AccountPortfolio"],
        }),
        deleteUserAccount: builder.mutation<
            TDeleteUserAccountsRequest,
            TDeleteUserAccountsResponse
        >({
            query: (request) => {
                const ACCOUNT_ID = String(request.id);
                return {
                    url: `${USER.BASE}${USER.ACCOUNTS}${ACCOUNT_ID}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["AccountPortfolio"],
        }),
        getUserAccountById: builder.query<
            TGetUserAccountByIdResponse,
            TGetUserAccountByIdRequest
        >({
            query: ({ id }) => `${USER.BASE}${USER.ACCOUNT_BY_ID(id)}`,
        }),
        login: builder.mutation<TRemoteLogin, TRemoteLogin>({
            query: (request) => ({
                url: `${USER.BASE}${USER.LOGIN}`,
                method: "POST",
                body: request,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `${USER.BASE}${USER.LOGOUT}`,
                method: "POST",
                body: undefined,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                const isLoggedOut = !!(await queryFulfilled);
                if (isLoggedOut) {
                    dispatch(setSelectedViewId(undefined));
                }
            },
            invalidatesTags: ["Views", "SubscribedViews"],
        }),
        connectWallet: builder.mutation<
            TConnectUserResponse,
            TConnectUserRequest
        >({
            query: (request) => ({
                url: `${USER.BASE}${USER.CONNECT_WALLET}`,
                method: "POST",
                body: request,
            }),
        }),
        generateMessage: builder.mutation<
            TGenerateMessageResponse,
            TGenerateMessageRequest
        >({
            query: (request) => ({
                url: `${USER.BASE}${USER.GENERATE_MESSAGE}`,
                method: "POST",
                body: request,
            }),
        }),
        verifySignature: builder.mutation<
            TVerifySignatureResponse,
            TVerifySignatureRequest
        >({
            query: (request) => ({
                url: `${USER.BASE}${USER.VERIFY_SIGNATURE}`,
                method: "POST",
                body: request,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                const verifyResp = (await queryFulfilled).data;
                if (verifyResp.token) {
                    Logger.debug("verifySignature: success", verifyResp);
                    dispatch(
                        setAuthToken({
                            value: verifyResp.token,
                        })
                    );
                    dispatch(setWalletVerified());
                    /**
                     * Invalidate view-related RTK-query tags upon login
                     *
                     * We can't just use RTK query tag invalidation to refetch views
                     * because right after wallet verification, when tag invalidation
                     * triggers a new getViews/getSubscribedViews request, the user token
                     * is still not updated in the store and the request does not include
                     * it in the header.
                     */
                    dispatch(
                        alphadayApi.util.invalidateTags([
                            "Account",
                            "Views",
                            "SubscribedViews",
                        ])
                    );
                    return;
                }
                Logger.error(
                    "verifySignature: response does not include token",
                    verifyResp
                );
            },
        }),
        getUserProfile: builder.query<
            TGetUserProfileResponse,
            TGetUserProfileRequest
        >({
            query: () => `${USER.BASE}${USER.PROFILE}`,
            providesTags: ["Account"], // refetch if a user account is updated
        }),
        updateUserProfileFilters: builder.mutation<
            TUpdateUserProfileFiltersResponse,
            TUpdateUserProfileFiltersRequest
        >({
            query: (request) => ({
                url: `${USER.BASE}${USER.PROFILE}`,
                method: "PUT",
                body: request,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUserAccountsQuery,
    useSaveUserAccountMutation,
    useDeleteUserAccountMutation,
    useGetUserAccountByIdQuery,
    useLoginMutation,
    useLogoutMutation,
    useConnectWalletMutation,
    useGenerateMessageMutation,
    useVerifySignatureMutation,
    useGetUserProfileQuery,
    useUpdateUserProfileFiltersMutation,
} = userApi;
export const { logout } = userApi.endpoints;
