import { TPagination, TSocialItem } from "../baseTypes";

export interface IRemoteLensMedia {
    raw: IRemoteLensMediaMeta;
    optimized: IRemoteLensMediaMeta;
}

export interface IRemoteLensAttachment {
    video?: IRemoteLensMedia;
    cover?: IRemoteLensMedia;

    image?: IRemoteLensMedia;

    audio?: IRemoteLensMedia;
    credits?: string;

    altTag?: string;
}

export interface IRemoteLensMediaMeta {
    uri: string;
    width?: string;
    height?: string;
    mimeType?: string;
}

export interface IRemoteLensProfileMetadata {
    bio: string;
    rawURI: string;
    picture: IRemoteLensMedia;
    displayName: string;
}

export interface IRemoteLensPost {
    __typename: "Post" | "Quote" | "Mirror";
    id: string;
    by: {
        id: string;
        metadata: IRemoteLensProfileMetadata;
    };
    metadata: {
        id: string;
        title?: string;
        content: string;
        embed?: string;
        attachments?: IRemoteLensAttachment[];
    };
    stats: {
        quotes: number;
        mirrors: number;
        comments: number;
        bookmarks: number;
    };
    profilesMentioned: {
        profile: {
            handle: {
                localName: string;
            };
        };
    }[];
    mirrorOn: IRemoteLensPost;
    createdAt: string;
}

export type IRemoteLensItem = TSocialItem<IRemoteLensPost>;

export type TGetLensRequest = {
    tags?: string;
    page?: number;
};

export type TGetLensResponse = TPagination & {
    results: IRemoteLensItem[];
};
