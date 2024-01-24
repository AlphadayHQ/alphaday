import { FeedItem } from "@alphaday/ui-kit";
import MobileLayout from "src/layout/MobileLayout";

const now = new Date();

interface IFeedItem {
    id: number;
    type: "news";
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
    description: string;
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
        tags: [
            "Bitcoin",
            "ETF",
            "NFT",
            "Crypto",
            "Blockchain",
            "Ethereum",
            "DeFi",
        ],
        likes: 123,
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
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
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
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
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
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
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
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
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
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
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
];

const SuperfeedPage = () => {
    return (
        <MobileLayout>
            <div className="w-full px-5 pt-4">
                {feedItems.map((item) => (
                    <FeedItem key={item.id} item={item} />
                ))}
            </div>
        </MobileLayout>
    );
};

export default SuperfeedPage;
