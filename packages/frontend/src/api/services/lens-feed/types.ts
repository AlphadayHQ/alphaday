import { TPagination, TSocialItem } from "../baseTypes";

export interface IRemoteLensStats {
    totalUpvotes: number;
    totalDownvotes: number;
    totalAmountOfMirrors: number;
    totalAmountOfCollects: number;
    totalAmountOfComments: number;
}

export interface IRemoteLensProfile {
    id: string;
    bio: string;
    name: string;
    stats: IRemoteLensProfileStats;
    handle: string;
    ownedBy: string;
    picture: IRemoteLensProfilePicture;
    metadata: string;
    isDefault: boolean;
    attributes?: IRemoteLensAttributesEntity[] | null;
    dispatcher: {
        address: string;
    };
    isFollowing: boolean;
    coverPicture: IRemoteLensMedia;
    followModule?: null;
    isFollowedByMe: boolean;
    followNftAddress: string;
}

export interface IRemoteLensProfileStats {
    totalPosts: number;
    totalMirrors: number;
    totalCollects: number;
    totalComments: number;
    totalFollowers: number;
    totalFollowing: number;
    totalPublications: number;
}

export interface IRemoteLensMedia {
    original: {
        url: string;
        mimeType: string | null;
    };
}

export interface IRemoteLensProfilePicture extends IRemoteLensMedia {
    uri: string;
    tokenId: string;
    verified: boolean;
    contractAddress: string;
}

export interface IRemoteLensAttributesEntity {
    key: string;
    value: string;
    traitType: string;
    displayType?: null;
}

export interface IRemoteLensMetadata {
    name: string;
    media: IRemoteLensMedia[];
    content: string;
    attributes?: IRemoteLensAttributesEntity[] | null;
    description?: string | null;
}

export interface IRemoteLensCollectModule {
    type: string;
    contractAddress: string;
    followerOnly: boolean;
    __typename: string;
}

export interface IRemoteLensPost {
    id: string;
    appId: string;
    stats: IRemoteLensStats;
    hidden: boolean;
    mirrors?: string[] | null;
    profile: IRemoteLensProfile;
    metadata: IRemoteLensMetadata;
    reaction: string | null;
    createdAt: string;
    mainPost?: IRemoteLensPost;
    mirrorOf?: IRemoteLensPost;
    __typename: "Mirror" | "Post" | "Comment";
    collectModule: IRemoteLensCollectModule;
    referenceModule: string | null;
    hasCollectedByMe: boolean;
}
export type IRemoteLensItem = TSocialItem<IRemoteLensPost>;

export type TGetLensRequest = {
    tags?: string;
    page?: number;
};

export type TGetLensResponse = TPagination & {
    results: IRemoteLensItem[];
};
