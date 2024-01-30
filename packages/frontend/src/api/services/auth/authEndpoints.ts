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

const { VERIFY_EMAIL, VERIFY_TOKEN, GOOGLE_LOGIN, APPLE_LOGIN } =
    CONFIG.API.DEFAULT.ROUTES.USER;

export const authApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        requestCode: builder.mutation<
            TVerificationCodeResponse,
            TVerificationCodeRequest
        >({
            query: (req) => {
                Logger.debug("requestCode: body", JSON.stringify(req));
                Logger.debug("requestCode: querying", VERIFY_EMAIL);
                return {
                    url: VERIFY_EMAIL,
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
                Logger.debug("verifyToken: querying", VERIFY_TOKEN);
                return {
                    url: VERIFY_TOKEN,
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
                const path =
                    ESignInUpMethod.Google === req.provider
                        ? GOOGLE_LOGIN
                        : APPLE_LOGIN;
                Logger.debug("ssoLogin: body", JSON.stringify(req));
                Logger.debug("ssoLogin: querying", path);
                return {
                    url: path,
                    body: req,
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
