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
