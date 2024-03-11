import { FC } from "react";
import { EFeedItemType, TSuperfeedItem } from "src/api/types";
import { BlogCard } from "./BlogCard";
import { EventCard } from "./EventCard";
import { ImageCard } from "./ImageCard";
import { MarketCard } from "./MarketCard";
import { NewsCard } from "./NewsCard";
import { PodcastCard } from "./PodcastCard";
import { SocialCard } from "./SocialCard";
import { VideoCard } from "./VideoCard";

interface IFeedCard {
    item: TSuperfeedItem;
    selectedPodcast: TSuperfeedItem | null;
    setSelectedPodcast: React.Dispatch<
        React.SetStateAction<TSuperfeedItem | null>
    >;
    onLike: () => MaybeAsync<void>;
    onShare: () => MaybeAsync<void>;
}

export const FeedCard: FC<IFeedCard> = ({
    item,
    selectedPodcast,
    setSelectedPodcast,
    onLike,
    onShare,
}) => {
    switch (item.type) {
        case EFeedItemType.NEWS:
            return <NewsCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.BLOG:
            return <BlogCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.FORUM:
            return <BlogCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.PERSON:
            return <BlogCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.VIDEO:
            return <VideoCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.PODCAST:
            return (
                <PodcastCard
                    item={item}
                    selectedPodcast={selectedPodcast}
                    setSelectedPodcast={setSelectedPodcast}
                    onLike={onLike}
                    onShare={onShare}
                />
            );
        case EFeedItemType.EVENT:
            return <EventCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.MEME:
            return <ImageCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.IMAGE:
            return <ImageCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.REDDIT:
            return <SocialCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.DISCORD:
            return <SocialCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.MARKET:
            return <MarketCard item={item} onLike={onLike} onShare={onShare} />;
        case EFeedItemType.TVL:
            return null;
        default:
            return null;
    }
};
