import { EAuthMethod } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";
import { alphadayApi } from "../alphadayApi";
import {
    TVerificationCodeRequest,
    TVerificationCodeResponse,
    TVerifyEmailRequest,
    TVerifyEmailRawResponse,
    TVerifyEmailResponse,
    TSSOLoginRequest,
    TSSOLoginRawResponse,
    TSSOLoginResponse,
} from "./types";

const { AUTH } = CONFIG.API.DEFAULT.ROUTES;

export const authApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        requestCode: builder.mutation<
            TVerificationCodeResponse,
            TVerificationCodeRequest
        >({
            query: (req) => {
                const path = `${AUTH.BASE}${AUTH.VERIFY_EMAIL}`;
                Logger.debug("requestCode: body", JSON.stringify(req));
                Logger.debug("requestCode: querying", path);
                return {
                    url: path,
                    body: req,
                    method: "POST",
                };
            },
        }),
        verifyToken: builder.mutation<
            TVerifyEmailResponse,
            TVerifyEmailRequest
        >({
            query: (req) => {
                const path = `${AUTH.BASE}${AUTH.VERIFY_TOKEN}`;
                Logger.debug("verifyToken: body", JSON.stringify(req));
                Logger.debug("verifyToken: querying", path);
                return {
                    url: path,
                    body: req,
                    method: "POST",
                };
            },
            transformResponse: (rawResult: TVerifyEmailRawResponse) => {
                return {
                    accessToken: rawResult.access_token,
                    refreshToken: rawResult.refresh_token,
                };
            },
        }),
        ssoLogin: builder.mutation<TSSOLoginResponse, TSSOLoginRequest>({
            query: (req) => {
                const path = `${AUTH.BASE}${AUTH.CONVERT_TOKEN}`;
                Logger.debug("ssoLogin: body", JSON.stringify(req));
                Logger.debug("ssoLogin: querying", path);
                return {
                    url: path,
                    body: {
                        grant_type: "convert_token",
                        backend:
                            req.provider === EAuthMethod.Google
                                ? "google-oauth2"
                                : "apple",
                        token: req.accessToken,
                        client_id: CONFIG.APP.X_APP_ID,
                        client_secret: CONFIG.APP.X_APP_SECRET,
                    },
                    method: "POST",
                };
            },
            transformResponse: (rawResult: TSSOLoginRawResponse) => {
                return {
                    accessToken: rawResult.access_token,
                    refreshToken: rawResult.refresh_token,
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
} = authApi;
