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
    }),
    overrideExisting: false,
});

export const {
    useRequestCodeMutation,
    useVerifyTokenMutation,
    useSsoLoginMutation,
} = authApi;
