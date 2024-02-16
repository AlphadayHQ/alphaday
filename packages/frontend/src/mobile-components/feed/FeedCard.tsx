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
}

export const FeedCard: FC<IFeedCard> = ({
    item,
    selectedPodcast,
    setSelectedPodcast,
}) => {
    switch (item.type) {
        case EFeedItemType.NEWS:
            return <NewsCard item={item} />;
        case EFeedItemType.BLOG:
            return <BlogCard item={item} />;
        case EFeedItemType.FORUM:
            return <BlogCard item={item} />;
        case EFeedItemType.PERSON:
            return <BlogCard item={item} />;
        case EFeedItemType.VIDEO:
            return <VideoCard item={item} />;
        case EFeedItemType.PODCAST:
            return (
                <PodcastCard
                    item={item}
                    selectedPodcast={selectedPodcast}
                    setSelectedPodcast={setSelectedPodcast}
                />
            );
        case EFeedItemType.EVENT:
            return <EventCard item={item} />;
        case EFeedItemType.MEME:
            return <ImageCard item={item} />;
        case EFeedItemType.IMAGE:
            return <ImageCard item={item} />;
        case EFeedItemType.REDDIT:
            return <SocialCard item={item} />;
        case EFeedItemType.DISCORD:
            return <SocialCard item={item} />;
        // case EFeedItemType.MARKET:
        //     return <MarketCard item={item} />;
        case EFeedItemType.TVL:
            return <MarketCard item={item} />;
        default:
            return null;
    }
};
