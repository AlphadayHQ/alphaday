import i18next from "i18next";
import { Logger } from "./logging";

export enum ETranslationValues {
    name = "(A-Z)",
    popular = "Popular",
    new = "New",
    feed = "Feed",
    trending = "Trending",
    readLater = "ReadLater",
    bookmarks = "Bookmarks",
    timeRange = "timeRange",
    media = "Media",
    all = "All",
    general = "General",
    nfts = "NFTs",
    dao = "DAO",
    layer2 = "Layer2",
    defi = "DeFi",
    trading = "Trading",
    chains = "Chains",
    protocols = "Protocols",
    timeline = "Timeline",
    Active = "Active",
    Resolved = "Resolved",
    vol = "vol",
}

export type TTranslationValues = `${ETranslationValues}`;
const allowedValues: TTranslationValues[] = Object.values(ETranslationValues);
const allowedKeys = Object.keys(ETranslationValues);

export const translateLabels = (
    text: TTranslationValues,
    { isKey }: { isKey: boolean } = { isKey: false }
) => {
    if (isKey && allowedKeys.includes(text)) {
        return i18next.t(`navigation.general.${text}`);
    }
    if (!allowedValues.includes(text)) {
        Logger.error(
            `translationUtils::translateLabels:: Translation value ${text} is not allowed`
        );
        return text;
    }
    const key = allowedKeys[allowedValues.indexOf(text)];

    return i18next.t(`navigation.general.${key}`);
};
