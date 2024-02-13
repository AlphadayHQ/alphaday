import { EAuthMethod } from "src/api/types";

export type TVerificationCodeRequest = {
    email: string;
};

export type TVerificationCodeResponse = void;

export type TVerifyEmailRequest = {
    email: string;
    code: string;
};

export type TSSOLoginRequest = {
    accessToken: string;
    provider: EAuthMethod;
    idToken?: string;
    code?: string;
};

export type TAuthLoginResponse = {
    token: string;
    user: {
        email: string;
    };
};
