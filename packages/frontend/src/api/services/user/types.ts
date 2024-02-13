/**
 * Primitive types
 */

import { TBaseTag } from "../baseTypes";

export type TRemoteUserRegister = {
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    is_staff: boolean;
};

export type TRemoteLogin = {
    email: string;
    username: string;
    password: string;
};

export type TRemoteCustomRegister = TRemoteUserRegister;

export type TRemoteBaseProfileFilter = {
    name: string;
    slug: string;
    // parents: string; // TODO: check if or when needed
};

export type TRemoteProfileFilterTag = TRemoteBaseProfileFilter;
export type TRemoteProfileFilterConceptTag = TRemoteBaseProfileFilter;
export type TRemoteProfileFilterCoin = TRemoteBaseProfileFilter & {
    ticker: string;
}; // TODO: tags?
export type TRemoteProfileFilterChain = TRemoteBaseProfileFilter; // TODO: tags?

export type TRemoteProfile = {
    id: number;
    user: TRemoteCustomRegister;
    handle?: string;
    location?: string;
    currency?: string;
    identicon?: string;
    twitter_username?: string;
    github_username?: string;
    smart_tags?: Omit<TBaseTag, "tag_type">[];
    smart_tags_last_updated: string | null;
    filter_tags: TRemoteProfileFilterTag[];
    filter_concept_tags: TRemoteProfileFilterConceptTag[];
    filter_coins: TRemoteProfileFilterCoin[];
    filter_chains: TRemoteProfileFilterChain[];
};

export type TRemoteAccount = {
    id: number;
    address: string;
    ens?: string | null;
};

/**
 * Query types
 */

export type TLoginRequest = TRemoteLogin;
export type TLoginResponse = TRemoteLogin;

export type TConnectUserRequest = {
    address: string;
    token?: string;
};
export type TConnectUserResponse = {
    id: string;
    address: string;
    message?: string | null;
    is_verified: boolean;
};

export type TGenerateMessageRequest = {
    address: string;
    // token?
};
export type TGenerateMessageResponse = {
    message: string;
};

export type TVerifySignatureRequest = {
    address: string;
    signature: `0x${string}`;
};
export type TVerifySignatureResponse = {
    token?: string;
};

export type TGetUserAccountsRequest = void;
export type TGetUserAccountsResponse = TRemoteAccount[];

export type TSaveUserAccountsRequest = {
    address?: string;
    addresses?: string[];
};
export type TSaveUserAccountsResponse = TSaveUserAccountsRequest;

export type TDeleteUserAccountsRequest = { id: number };
export type TDeleteUserAccountsResponse = TDeleteUserAccountsRequest;

export type TGetUserAccountByIdRequest = { id: string };
export type TGetUserAccountByIdResponse = TRemoteAccount;

export type TGetUserProfileRequest = void;
export type TGetUserProfileResponse = TRemoteProfile;

export type TUpdateUserProfileFiltersRequest = {
    filter_tags: string[];
    filter_concept_tags: string[];
    filter_coins: string[];
    filter_chains: string[];
};
export type TUpdateUserProfileFiltersResponse = TRemoteProfile;
