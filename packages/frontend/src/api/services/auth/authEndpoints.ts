import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";
import { alphadayApi } from "../alphadayApi";
import {
    TVerificationCodeRequest,
    TVerificationCodeResponse,
    TVerifyEmailRequest,
    TVerifyEmailRawResponse,
    TVerifyEmailResponse,
} from "./types";

const { VERIFY_EMAIL, VERIFY_TOKEN, BASE } = CONFIG.API.DEFAULT.ROUTES.USER;

export const authApi = alphadayApi.injectEndpoints({
    endpoints: (builder) => ({
        requestCode: builder.mutation<
            TVerificationCodeResponse,
            TVerificationCodeRequest
        >({
            query: (req) => {
                const path = `${BASE}${VERIFY_EMAIL}`;
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
                const path = `${BASE}${VERIFY_TOKEN}`;
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
    }),
    overrideExisting: false,
});

export const { useRequestCodeMutation, useVerifyTokenMutation } = authApi;
