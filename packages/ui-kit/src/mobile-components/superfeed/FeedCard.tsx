import { FC } from "react";
import { BlogCard } from "./BlogCard";
import { EventCard } from "./EventCard";
import { ImageCard } from "./ImageCard";
import { NewsCard } from "./NewsCard";
import { PodcastCard } from "./PodcastCard";
import { PriceCard } from "./PriceCard";
import { SocialCard } from "./SocialCard";
import { EFeedItemType, IFeedItem } from "./types";
import { VideoCard } from "./VideoCard";

// TODO move to frontend package

export const FeedCard: FC<{ item: IFeedItem }> = ({ item }) => {
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
            return <PodcastCard item={item} />;
        case EFeedItemType.EVENT:
            return <EventCard item={item} />;
        case EFeedItemType.IMAGE:
            return <ImageCard item={item} />;
        case EFeedItemType.REDDIT:
            return <SocialCard item={item} />;
        case EFeedItemType.DISCORD:
            return <SocialCard item={item} />;
        case EFeedItemType.PRICE:
            return <PriceCard item={item} />;
        case EFeedItemType.TVL:
            return <PriceCard item={item} />;
        default:
            return null;
    }
};
