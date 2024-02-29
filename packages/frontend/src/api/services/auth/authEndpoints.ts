import { EAuthMethod } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";
import { setAuthToken, setAuthEmail } from "../../store/slices/user";
import { alphadayApi } from "../alphadayApi";
import {
    TVerificationCodeRequest,
    TVerificationCodeResponse,
    TVerifyEmailRequest,
    TSSOLoginRequest,
    TAuthLoginResponse,
} from "./types";

const { AUTH } = CONFIG.API.DEFAULT.ROUTES;

export const authApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        requestCode: builder.mutation<
            TVerificationCodeResponse,
            TVerificationCodeRequest
        >({
            query: (req) => {
                const path = `${AUTH.BASE}${AUTH.REQUEST_TOKEN}`;
                Logger.debug("requestCode: body", JSON.stringify(req));
                Logger.debug("requestCode: querying", path);
                return {
                    url: path,
                    body: req,
                    method: "POST",
                };
            },
        }),
        verifyToken: builder.mutation<TAuthLoginResponse, TVerifyEmailRequest>({
            query: (req) => {
                const path = `${AUTH.BASE}${AUTH.VERIFY_TOKEN}`;
                Logger.debug("verifyToken: body", JSON.stringify(req));
                Logger.debug("verifyToken: querying", path);
                return {
                    url: path,
                    body: {
                        email: req.email,
                        token: req.code,
                    },
                    method: "POST",
                };
            },
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                const verifyResp = (await queryFulfilled).data;
                if (verifyResp.token) {
                    Logger.debug(
                        "authEndpoints::verifyToken: success",
                        verifyResp
                    );
                    dispatch(setAuthToken({ value: verifyResp.token }));
                    dispatch(setAuthEmail(verifyResp.user.email));
                    /**
                     * Invalidate user-specific RTK-query tags upon login
                     *
                     * We can't just use RTK query tag invalidation to refetch views
                     * because right after authentication, when tag invalidation
                     * triggers a new getViews/getSubscribedViews request, the user token
                     * is still not updated in the store and the request does not include
                     * it in the header.
                     */
                    dispatch(
                        alphadayApi.util.invalidateTags([
                            "Account",
                            "AccountPortfolio",
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
        ssoLogin: builder.mutation<TAuthLoginResponse, TSSOLoginRequest>({
            query: (req) => {
                let path = "";
                if (req.provider === EAuthMethod.Google) {
                    path = `${AUTH.BASE}${AUTH.GOOGLE_LOGIN}`;
                }

                Logger.debug("ssoLogin: body", JSON.stringify(req));
                Logger.debug("ssoLogin: querying", path);
                return {
                    url: path,
                    body: {
                        code: req.code,
                        id_token: req.idToken,
                        access_token: req.accessToken,
                    },
                    method: "POST",
                };
            },
        }),
        signout: builder.mutation<void, void>({
            query: () => {
                const path = `${AUTH.BASE}${AUTH.LOGOUT}`;
                Logger.debug("logout: querying", path);
                return {
                    url: path,
                    method: "POST",
                };
            },
            invalidatesTags: ["Views", "SubscribedViews"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useRequestCodeMutation,
    useVerifyTokenMutation,
    useSsoLoginMutation,
    useSignoutMutation,
} = authApi;

export const { signout } = authApi.endpoints;
