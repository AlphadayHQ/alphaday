import { EFeedItemType } from "src/api/types";
import blogIcon from "src/assets/feedIcons/blog.png";
import eventIcon from "src/assets/feedIcons/event.png";
import forumIcon from "src/assets/feedIcons/forum.png";
import imageIcon from "src/assets/feedIcons/image.png";
import newsIcon from "src/assets/feedIcons/news.png";
import personIcon from "src/assets/feedIcons/person.png";
import podcastIcon from "src/assets/feedIcons/podcast.png";
import socialIcon from "src/assets/feedIcons/social.png";
import trendDownIcon from "src/assets/feedIcons/trend-down.png";
import trendUpIcon from "src/assets/feedIcons/trend-up.png";
import tvlIcon from "src/assets/feedIcons/TVL.png";
import videoIcon from "src/assets/feedIcons/video.png";

export const feedItemIconMap = {
    [EFeedItemType.NEWS]: newsIcon,
    [EFeedItemType.EVENT]: eventIcon,
    [EFeedItemType.VIDEO]: videoIcon,
    [EFeedItemType.PODCAST]: podcastIcon,
    [EFeedItemType.BLOG]: blogIcon,
    [EFeedItemType.FORUM]: forumIcon,
    [EFeedItemType.PERSON]: personIcon,
    [EFeedItemType.IMAGE]: imageIcon,
    [EFeedItemType.MEME]: imageIcon,
    [EFeedItemType.REDDIT]: socialIcon,
    [EFeedItemType.DISCORD]: socialIcon,
    [EFeedItemType.MARKET]: (down: boolean) =>
        down ? trendDownIcon : trendUpIcon,
    [EFeedItemType.TVL]: tvlIcon,
};
