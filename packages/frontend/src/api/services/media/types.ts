export type TGetMediaRequest = {
    feedUrl: string;
};

export type TGetMediaResponse = {
    thumbnail: string | undefined;
    entryId: string | undefined;
};
