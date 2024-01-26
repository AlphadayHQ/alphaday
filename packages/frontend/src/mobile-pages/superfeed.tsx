import MobileLayout from "src/layout/MobileLayout";
import { FeedCard } from "src/mobile-components/superfeed/FeedCard";
import {
    EFeedItemType,
    IFeedItem,
} from "src/mobile-components/superfeed/types";

const now = new Date();

const feedItems: IFeedItem[] = [
    {
        id: 5,
        type: EFeedItemType.IMAGE,
        title: "MicroStrategy’s stock surges 350% in 2023 on back of Bitcoin ETF hype",
        date: new Date(now.setHours(now.getHours() - 1)),
        source: {
            name: "CoinTelegraph",
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
        id: 4,
        type: EFeedItemType.VIDEO,
        title: "Trump Dumps Millions in Ethereum After Disastrous NFT Redux",
        date: new Date(now.setHours(now.getHours() - 1)),
        source: {
            name: "DeFiChain",
            img: "https://s3.eu-west-1.amazonaws.com/production-alphaday.com/media/icons/sources/cointelegraph_news.jpg",
        },
        tags: ["Ethereum", "Bitcoin", "Cardano"],
        likes: 123,
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
    {
        id: 3,
        type: EFeedItemType.PODCAST,
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
        type: EFeedItemType.EVENT,
        title: "MicroStrategy’s stock surges 350% in 2023 on back of Bitcoin ETF hype",
        startDate: new Date(now.setHours(now.getHours() + 10)),
        endDate: new Date(now.setHours(now.getHours() - 12)),
        category: "Conference/Summit",
        location: "BTC Space Phuket I Thailand",
        tags: ["Bitcoin", "ETF"],
        likes: 123,
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
    {
        id: 1,
        type: EFeedItemType.NEWS,
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
];

const SuperfeedPage = () => {
    return (
        <MobileLayout>
            <div className="w-full px-5 pt-4">
                {feedItems.map((item) => (
                    <FeedCard key={item.id} item={item} />
                ))}
            </div>
        </MobileLayout>
    );
};

export default SuperfeedPage;
