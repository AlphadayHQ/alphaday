import { ESignInUpMethod } from "src/api/types";

export type TVerificationCodeRequest = {
    email: string;
};

export type TVerificationCodeResponse = void;

export type TVerifyEmailRequest = {
    email: string;
    code: string;
};

export type TVerifyEmailResponse = {
    accessToken: string;
    refreshToken: string;
};

export type TVerifyEmailRawResponse = {
    access_token: string;
    refresh_token: string;
};

export type TSSOLoginRequest = {
    accessToken: string;
    provider: ESignInUpMethod;
    idToken?: string;
    code?: string;
};

export type TSSOLoginRawResponse = {
    access_token: string;
    refresh_token: string;
};

export type TSSOLoginResponse = {
    accessToken: string;
    refreshToken: string;
};
