import { TPagination, TSocialItem } from "../baseTypes";

export interface IRemoteLensPicture {
    raw: IRemoteLensPictureMeta;
    optimized: IRemoteLensPictureMeta;
}

export interface IRemoteLensAttachment {
    video?: IRemoteLensPictureMeta;
    cover?: IRemoteLensPictureMeta;

    image?: IRemoteLensPictureMeta;

    audio?: IRemoteLensPictureMeta;
    credits?: string;

    altTag?: string;
}

export interface IRemoteLensPictureMeta {
    uri: string;
    width?: string;
    height?: string;
    mimeType?: string;
}

export interface IRemoteLensProfileMetadata {
    bio: string;
    rawURI: string;
    picture: IRemoteLensPicture;
    displayName: string;
}

export interface IRemoteLensPost {
    id: string;
    by: {
        id: string;
        metadata: IRemoteLensProfileMetadata;
    };
    metadata: {
        id: string;
        content: string;
        embed?: string;
        attachments?: IRemoteLensAttachment[];
        profilesMentioned: {
            profile: {
                handle: {
                    localName: string;
                };
            };
        }[];
        commentOn: IRemoteLensPost;
        root: IRemoteLensPost;
    };
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
