import { FC } from "react";
import { EFeedItemType, TSuperfeedItem } from "src/api/types";
import { BlogCard } from "./BlogCard";
import { EventCard } from "./EventCard";
import { GasCard } from "./GasCard";
import { ImageCard } from "./ImageCard";
import { MarketCard } from "./MarketCard";
import { NewsCard } from "./NewsCard";
import { PodcastCard } from "./PodcastCard";
import { SocialCard } from "./SocialCard";
import { TVLCard } from "./TVLCard";
import { VideoCard } from "./VideoCard";

interface IFeedCard {
    item: TSuperfeedItem;
    selectedPodcast: TSuperfeedItem | null;
    setSelectedPodcast: React.Dispatch<
        React.SetStateAction<TSuperfeedItem | null>
    >;
    isAuthenticated: boolean;
    onLike: () => MaybeAsync<void>;
    onShare: () => MaybeAsync<void>;
}

export const FeedCard: FC<IFeedCard> = ({
    item,
    selectedPodcast,
    setSelectedPodcast,
    isAuthenticated,
    onLike,
    onShare,
}) => {
    switch (item.type) {
        case EFeedItemType.NEWS:
            return (
                <NewsCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.BLOG:
            return (
                <BlogCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.FORUM:
            return (
                <BlogCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.PERSON:
            return (
                <BlogCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.VIDEO:
            return (
                <VideoCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.PODCAST:
            return (
                <PodcastCard
                    item={item}
                    selectedPodcast={selectedPodcast}
                    setSelectedPodcast={setSelectedPodcast}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.EVENT:
            return (
                <EventCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.MEME:
            return (
                <ImageCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.IMAGE:
            return (
                <ImageCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.REDDIT:
            return (
                <SocialCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.DISCORD:
            return (
                <SocialCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.MARKET:
            return (
                <MarketCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.GAS:
            return (
                <GasCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        case EFeedItemType.TVL:
            return (
                <TVLCard
                    item={item}
                    onLike={onLike}
                    onShare={onShare}
                    isAuthenticated={isAuthenticated}
                />
            );
        default:
            return null;
    }
};
