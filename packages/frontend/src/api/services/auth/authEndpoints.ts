import { ESignInUpMethod } from "src/api/types";
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

const { USER } = CONFIG.API.DEFAULT.ROUTES;

export const authApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        requestCode: builder.mutation<
            TVerificationCodeResponse,
            TVerificationCodeRequest
        >({
            query: (req) => {
                Logger.debug("requestCode: body", JSON.stringify(req));
                Logger.debug("requestCode: querying", USER.VERIFY_EMAIL);
                return {
                    url: USER.VERIFY_EMAIL,
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
                Logger.debug("verifyToken: body", JSON.stringify(req));
                Logger.debug("verifyToken: querying", USER.VERIFY_TOKEN);
                return {
                    url: USER.VERIFY_TOKEN,
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
                Logger.debug("ssoLogin: body", JSON.stringify(req));
                Logger.debug("ssoLogin: querying", USER.CONVERT_TOKEN);
                return {
                    url: USER.CONVERT_TOKEN,
                    body: {
                        grant_type: "convert_token",
                        backend:
                            req.provider === ESignInUpMethod.Google
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
