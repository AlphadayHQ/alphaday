import { FeedItem } from "@alphaday/ui-kit";
import MobileLayout from "src/layout/MobileLayout";

const now = new Date();

interface IFeedItem {
    id: number;
    type: "news" | "event" | "video" | "podcast";
    title: string;
    date: Date;
    source: {
        name: string;
        img: string;
    };
    tags: string[];
    likes: number;
    comments: number;
    link: string;
    img: string;
}
const feedItems: IFeedItem[] = [
    {
        id: 1,
        type: "news",
        title: "MicroStrategy’s stock surges 350% in 2023 on back of Bitcoin ETF hype",
        date: new Date(now.setHours(now.getHours() - 1)),
        source: {
            name: "CoinTelegraph",
            img: "https://s3.eu-west-1.amazonaws.com/production-alphaday.com/media/icons/sources/cointelegraph_news.jpg",
        },
        tags: ["Bitcoin", "ETF"],
        likes: 123,
        comments: 12,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
    },
    {
        id: 2,
        type: "news",
        title: "MicroStrategy’s stock surges 350% in 2023 on back of Bitcoin ETF hype",
        date: new Date(now.setHours(now.getHours() - 1)),
        source: {
            name: "CoinTelegraph",
            img: "https://s3.eu-west-1.amazonaws.com/production-alphaday.com/media/icons/sources/cointelegraph_news.jpg",
        },
        tags: ["Bitcoin", "ETF"],
        likes: 123,
        comments: 12,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
    },
    {
        id: 3,
        type: "news",
        title: "MicroStrategy’s stock surges 350% in 2023 on back of Bitcoin ETF hype",
        date: new Date(now.setHours(now.getHours() - 1)),
        source: {
            name: "CoinTelegraph",
            img: "https://s3.eu-west-1.amazonaws.com/production-alphaday.com/media/icons/sources/cointelegraph_news.jpg",
        },
        tags: ["Bitcoin", "ETF"],
        likes: 123,
        comments: 12,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
    },
    {
        id: 4,
        type: "news",
        title: "MicroStrategy’s stock surges 350% in 2023 on back of Bitcoin ETF hype",
        date: new Date(now.setHours(now.getHours() - 1)),
        source: {
            name: "CoinTelegraph",
            img: "https://s3.eu-west-1.amazonaws.com/production-alphaday.com/media/icons/sources/cointelegraph_news.jpg",
        },
        tags: ["Bitcoin", "ETF"],
        likes: 123,
        comments: 12,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
    },
    {
        id: 5,
        type: "news",
        title: "MicroStrategy’s stock surges 350% in 2023 on back of Bitcoin ETF hype",
        date: new Date(now.setHours(now.getHours() - 1)),
        source: {
            name: "CoinTelegraph",
            img: "https://s3.eu-west-1.amazonaws.com/production-alphaday.com/media/icons/sources/cointelegraph_news.jpg",
        },
        tags: ["Bitcoin", "ETF"],
        likes: 123,
        comments: 12,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
    },
    {
        id: 6,
        type: "news",
        title: "MicroStrategy’s stock surges 350% in 2023 on back of Bitcoin ETF hype",
        date: new Date(now.setHours(now.getHours() - 1)),
        source: {
            name: "CoinTelegraph",
            img: "https://s3.eu-west-1.amazonaws.com/production-alphaday.com/media/icons/sources/cointelegraph_news.jpg",
        },
        tags: ["Bitcoin", "ETF"],
        likes: 123,
        comments: 12,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
    },
];

const SuperfeedPage = () => {
    return (
        <MobileLayout>
            <div className="w-full px-4 pt-24">
                {feedItems.map((item) => (
                    <FeedItem item={item} />
                ))}
            </div>
        </MobileLayout>
    );
};

export default SuperfeedPage;
