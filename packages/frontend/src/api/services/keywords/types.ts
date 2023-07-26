import { TPagination, TBaseTag } from "../baseTypes";
/**
 * Primitive types
 */

export type TRemoteKeywordReadOnly = {
    id: number;
    name: string;
    tag: TBaseTag;
};

export type TRemoteKeywordTrendingReadOnly = {
    id: number;
    keyword: TRemoteKeywordReadOnly;
    sentiment_score: string;
    trending_order: number;
};

/**
 * Query types
 */

export type TGetKeywordsRequest = {
    search?: string;
    page?: number;
    limit?: number;
};
export type TGetKeywordsResponse = TPagination & {
    results: TRemoteKeywordReadOnly[];
};

export type TGetTrendingKeywordsRequest = void;
export type TGetTrendingKeywordsRawResponse = TPagination & {
    results: TRemoteKeywordTrendingReadOnly[];
};
export type TGetTrendingKeywordsResponse = TPagination & {
    results: TRemoteKeywordReadOnly[];
};

export type TGetKeywordByIdRequest = {
    id: number;
};
export type TGetKeywordByIdResponse = TRemoteKeywordReadOnly;

export type TUpdateKeywordFreqRequest = {
    name: string;
};
export type TUpdateKeywordFreqResponse = {
    name: string;
};
