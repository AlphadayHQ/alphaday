import { EAuthMethod } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";
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
