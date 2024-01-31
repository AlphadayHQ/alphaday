import { EFeedItemType, TSuperfeedItem } from "src/api/types";
import { TPagination } from "../baseTypes";

export type TRemoteSuperfeedItem = {
    id: number;
    content_type: EFeedItemType;
    item_id: number;
    title: string;
    item_date: string;
    trendiness: number;
    url: string;
    image: string;
    short_description: string;
    file_url: string | null;
    duration: number | null;
    starts_at: string | null;
    ends_at: string | null;
    source: {
        icon: string;
        name: string;
        slug: string;
    };
    tags: {
        name: string;
        slug: string;
    }[];
    likes: number;
    comments: number;
};

export type TGetSuperfeedItemsRequest = {
    tags?: string;
    page?: number;
    limit?: number;
};
export type TGetSuperfeedItemsRawResponse = TPagination & {
    results: TRemoteSuperfeedItem[];
};
export type TGetSuperfeedItemsResponse = TPagination & {
    results: TSuperfeedItem[];
};

// const data = {
//     results: [
//         {
//             id: 1,
//             content_type: "blogitem",
//             item_id: 5950,
//             title: "Bitcoin.com Monthly Recap for January 2024",
//             item_date: "2024-01-31T03:42:00Z",
//             trendiness: 0.52865467977,
//             url: "https://blog.bitcoin.com/bitcoin-com-monthly-recap-for-january-2024-b531aec3dc1d?source=rss----b32abb2c5b2c---4",
//             image: "https://cdn-images-1.medium.com/proxy/1*TGH72Nnw24QL3iV9IOm4VA.png",
//             short_description:
//                 "The top announcements from Bitcoin.com for the month of January2024. Bitcoin.com News Multilingual Rollout Expands to Italian, German, andFrenchWere excited to announce that Bitcoin.com News is now available in Italian, German, and French — thats in ...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Bitcoin_2.png",
//                 name: "Bitcoin.com Blog",
//                 slug: "bitcoin_com_blog",
//             },
//             tags: [
//                 {
//                     name: "bitcoin",
//                     slug: "bitcoin",
//                 },
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: ".com (ordinals)",
//                     slug: "com-ordinals",
//                 },
//             ],
//         },
//         {
//             id: 2,
//             content_type: "eventitem",
//             item_id: 15950,
//             title: "Decentraland Developer Workshop",
//             item_date: "2024-01-30T12:51:49.449690Z",
//             trendiness: 0.5020744098,
//             url: "https://www.meetup.com/nyc_ethereum/events/qhfdctygccbpc/",
//             image: "https://secure.meetupstatic.com/photos/event/8/8/9/e/600_501754974.webp?w=384",
//             short_description:
//                 "🖥 Decentraland Developer Workshop 🖥\r\n\r\n☀️ Join us every Wednesday for a Workshop Series on How to Develop on Decentraland with EthBuilders NYC, Blockchain Developers United Austin and the Blockchain Acceleration foundation! ☀️\r\n\r\nJoin us TODAY ⏰\r\n⚡ Bring ...",
//             file_url: null,
//             duration: null,
//             starts_at: "2024-01-31T22:30:00Z",
//             ends_at: "2024-02-01T00:30:00Z",
//             source: {
//                 icon: "default_icon.png",
//                 name: "Ethereum Meetup (Events)",
//                 slug: "ethereum_meetup_event",
//             },
//             tags: [
//                 {
//                     name: "decentraland",
//                     slug: "decentraland",
//                 },
//                 {
//                     name: "development",
//                     slug: "development",
//                 },
//                 {
//                     name: "ethereum",
//                     slug: "ethereum",
//                 },
//             ],
//         },
//         {
//             id: 3,
//             content_type: "videoitem",
//             item_id: 6093,
//             title: "Zcash - Empoderando pessoas  LEGENDADO",
//             item_date: "2024-01-31T03:00:00Z",
//             trendiness: 0.43373289816,
//             url: "https://www.youtube.com/watch?v=XVAPs2aCbeU",
//             image: "https://i1.ytimg.com/vi/XVAPs2aCbeU/hqdefault.jpg",
//             short_description:
//                 "Privacy is NormalDiscord: https://discord.com/invite/zcashTwitter: https://twitter.com/zcashbrazilInstagram: https://www.instagram.com/zcashbrazil/Site oficial do projeto: https://z.cash/Catálogo P2P: https://catalogop2p.com/zcashhttps://z.cash/ecosy...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Zcash_Brasil.jpg",
//                 name: "Zcash Brasil",
//                 slug: "zcash_brasil_video",
//             },
//             tags: [
//                 {
//                     name: "zcash brasil",
//                     slug: "zcash-brasil",
//                 },
//                 {
//                     name: "zcash",
//                     slug: "zcash",
//                 },
//             ],
//         },
//         {
//             id: 4,
//             content_type: "podcastitem",
//             item_id: 57466,
//             title: "Dencun Successfully Activates On Sepolia",
//             item_date: "2024-01-30T23:45:00Z",
//             trendiness: 0.41986318266,
//             url: "https://harpie.io/ethdaily",
//             image: "https://chrt.fm/track/9F86D1/dts.podtrac.com/redirect.mp3/traffic.libsyn.com/secure/ethereum/e390.mp3?dest-id=3014108",
//             short_description:
//                 "Dencun successfully activates on the Sepolia testnet. Wevm enables drips for its Wagmi library. Tim Beiko introduces the Protocol Guild Pledge. And Synthetix supports the migration of staked SNX to OP Mainnet.  Sponsor: Harpie is an onchain security ...",
//             file_url:
//                 "https://chrt.fm/track/9F86D1/dts.podtrac.com/redirect.mp3/traffic.libsyn.com/secure/ethereum/e390.mp3?dest-id=3014108",
//             duration: "04:36",
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/ethdaily_podcast.png",
//                 name: "ETH Daily - Ethereum News",
//                 slug: "ethdaily_podcast",
//             },
//             tags: [
//                 {
//                     name: "eth daily",
//                     slug: "eth-daily",
//                 },
//             ],
//         },
//         {
//             id: 5,
//             content_type: "newsitem",
//             item_id: 85790,
//             title: "Baltimore Bitcoin Meetup HoDL Hour February 2024",
//             item_date: "2024-01-29T22:23:00Z",
//             trendiness: 0.3995937852,
//             url: "https://cryptoevents.global/baltimore-bitcoin-meetup-hodl-hour-february-2024/?utm_source=rss&utm_medium=rss&utm_campaign=baltimore-bitcoin-meetup-hodl-hour-february-2024",
//             image: "https://cryptoevents.global/wp-content/uploads/2019/08/cropped-Bitcoin-Crypto-Transparent-PNG-32x32.png",
//             short_description:
//                 "Join the Baltimore Bitcoin Meetup HoDL Hour, a monthly event series dedicated to bringing together Bitcoin enthusiasts for engaging discussions and networking. We will be meeting upstairs at the big table  Thursday, February 1, 2024  Time: 6:30 AM  R...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Cryptoevents.jpg",
//                 name: "CryptoEvents",
//                 slug: "cryptoevents_news",
//             },
//             tags: [
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: "bitcoin",
//                     slug: "bitcoin",
//                 },
//                 {
//                     name: "bear riders nft",
//                     slug: "bear-riders-nft",
//                 },
//             ],
//         },
//         {
//             id: 6,
//             content_type: "videoitem",
//             item_id: 6048,
//             title: "Linea Community Call - January 2024",
//             item_date: "2024-01-29T15:30:00Z",
//             trendiness: 0.395996989665,
//             url: "https://www.youtube.com/watch?v=v-Sc6AG0iHA",
//             image: "https://i3.ytimg.com/vi/v-Sc6AG0iHA/hqdefault.jpg",
//             short_description:
//                 "January was a busy month and 2023 was a busy year!Let's take a lookback at the Linea's wins and growth last year, look forward to what's in store for 2024, and get the latest on Linea XP and our upcoming Voyages!",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/linea_ts4Vawm.png",
//                 name: "Linea Videos",
//                 slug: "linea_video",
//             },
//             tags: [
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: "linea",
//                     slug: "linea",
//                 },
//             ],
//         },
//         {
//             id: 7,
//             content_type: "newsitem",
//             item_id: 85782,
//             title: "PubKey Bitcoin Lightning Meetup February 2024",
//             item_date: "2024-01-29T21:40:00Z",
//             trendiness: 0.39252578228,
//             url: "https://cryptoevents.global/pubkey-bitcoin-lightning-meetup-february-2024/?utm_source=rss&utm_medium=rss&utm_campaign=pubkey-bitcoin-lightning-meetup-february-2024",
//             image: "https://cryptoevents.global/wp-content/uploads/2019/08/cropped-Bitcoin-Crypto-Transparent-PNG-32x32.png",
//             short_description:
//                 "This the monthly PubKey Bitcoin Lightning Meetup with resident lightning protocol destroyer, Evan Kaloudis of Zeus LN.  Thursday, February 29, 2024  Time:6:00 PM – 8:00 PM EST  Pubkey 85 Washington Pl · New York, NY RSVP   Read more…The post PubKey B...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Cryptoevents.jpg",
//                 name: "CryptoEvents",
//                 slug: "cryptoevents_news",
//             },
//             tags: [
//                 {
//                     name: "bitcoin",
//                     slug: "bitcoin",
//                 },
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//             ],
//         },
//         {
//             id: 8,
//             content_type: "newsitem",
//             item_id: 85781,
//             title: "Renowned Crypto Expert Reveals Top 3 Altcoins Ready To Breakout In February 2024",
//             item_date: "2024-01-29T21:30:00Z",
//             trendiness: 0.39204697176,
//             url: "https://www.newsbtc.com/altcoin/crypto-altcoins-february-2024/",
//             image: "https://www.newsbtc.com/wp-content/uploads/2024/01/Crypto-altcoins.jpeg?fit=460%2C256",
//             short_description:
//                 "A prominent crypto analyst and Bitcoin enthusiast, Michael Van de Poppe, has shared insights on the future trajectory of several altcoins in the space. The crypto analysts predictions highlight crucial moments for investors as they watch out for oppo...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/newsbtc_news.jpg",
//                 name: "NewsBTC",
//                 slug: "newsbtc_news",
//             },
//             tags: [
//                 {
//                     name: "newsbtc",
//                     slug: "newsbtc",
//                 },
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: "altcoin",
//                     slug: "altcoin",
//                 },
//             ],
//         },
//         {
//             id: 9,
//             content_type: "newsitem",
//             item_id: 85798,
//             title: '"Deep Learning is Rubbish"\n Karl Friston & Yann LeCun\'s Panel at the Davos 2024\nWorld Economic Forum',
//             item_date: "2024-01-29T21:06:00Z",
//             trendiness: 0.39090107716,
//             url: "https://hackernoon.com/deep-learning-is-rubbish-karl-friston-and-yann-lecuns-panel-at-the-davos-2024-world-economic-forum?source=rss",
//             image: "https://hackernoon.com/hn-icon.png",
//             short_description:
//                 "In a panel hosted by the Financial Times at the World Economic Forum in Davos, Switzerland, two of the biggest names in artificial intelligence — Dr. Karl Friston of VERSES AI, and Dr. Yann LeCun of Meta — discussed their aligned, yet contrasting vis...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/hackernoon_jrroxXJ.jpg",
//                 name: "Hackernoon",
//                 slug: "hackernoon_news",
//             },
//             tags: [
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: "davos protocol",
//                     slug: "davos-protocol",
//                 },
//                 {
//                     name: "worldtoken",
//                     slug: "worldtoken",
//                 },
//                 {
//                     name: "hackernoon",
//                     slug: "hackernoon",
//                 },
//             ],
//         },
//         {
//             id: 10,
//             content_type: "newsitem",
//             item_id: 85780,
//             title: "Vancouver BitDevs Socratic Seminar January 2024",
//             item_date: "2024-01-29T21:04:00Z",
//             trendiness: 0.39080579268,
//             url: "https://cryptoevents.global/vancouver-bitdevs-socratic-seminar-january-2024/?utm_source=rss&utm_medium=rss&utm_campaign=vancouver-bitdevs-socratic-seminar-january-2024",
//             image: "https://cryptoevents.global/wp-content/uploads/2019/08/cropped-Bitcoin-Crypto-Transparent-PNG-32x32.png",
//             short_description:
//                 "Join us at the Vancouver BitDevs Socratic Seminar for discussions about Bitcoin scaling, incentive structures, game theory, other layer 2+ Bitcoin solutions and developments, security, and privacy. MC:@TJMacD Speakers:@TJMacD& Chris fromJoulePort. Ou...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Cryptoevents.jpg",
//                 name: "CryptoEvents",
//                 slug: "cryptoevents_news",
//             },
//             tags: [
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//             ],
//         },
//         {
//             id: 11,
//             content_type: "reddititem",
//             item_id: 258140,
//             title: "Standard Chartered: Ethereum Spot ETFs Likely To Be Approved by May 2024 | CoinMarketCap",
//             item_date: "2024-01-31T05:24:00Z",
//             trendiness: 0.38805393876,
//             url: "https://www.reddit.com/r/ethtrader/comments/1afa7wb/standard_chartered_ethereum_spot_etfs_likely_to/",
//             image: null,
//             short_description:
//                 '<table> <tr><td> <a href="https://www.reddit.com/r/ethtrader/comments/1afa7wb/standard_chartered_ethereum_spot_etfs_likely_to/"> <img src="https://external-preview.redd.it/3MmeD2sQFn75njrhQ-pkBSsCUrHuWnyDpFXca1BZe8A.jpg?width=640&amp;crop=smart&amp;a...',
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/eth_4Jd4sYP.png",
//                 name: "/r/ethtrader",
//                 slug: "ethtrader_reddit_social",
//             },
//             tags: [
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: "ethereum",
//                     slug: "ethereum",
//                 },
//             ],
//         },
//         {
//             id: 12,
//             content_type: "newsitem",
//             item_id: 85771,
//             title: "Treasure Coast Bitcoin Meetup May 2024",
//             item_date: "2024-01-29T19:59:00Z",
//             trendiness: 0.38772627412,
//             url: "https://cryptoevents.global/treasure-coast-bitcoin-meetup-may-2024/?utm_source=rss&utm_medium=rss&utm_campaign=treasure-coast-bitcoin-meetup-may-2024",
//             image: "https://cryptoevents.global/wp-content/uploads/2019/08/cropped-Bitcoin-Crypto-Transparent-PNG-32x32.png",
//             short_description:
//                 "Please join Treasure Coast Bitcoin Meetup at the Blue Door for drinks, snacks and to talk about all things Bitcoin! Beginners welcome. We are here to educate each other and share our passion for Bitcoin. Bitcoin only – not crypto!  Read more…The post...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Cryptoevents.jpg",
//                 name: "CryptoEvents",
//                 slug: "cryptoevents_news",
//             },
//             tags: [
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: "bitcoin",
//                     slug: "bitcoin",
//                 },
//             ],
//         },
//         {
//             id: 13,
//             content_type: "newsitem",
//             item_id: 85768,
//             title: "Treasure Coast Bitcoin Meetup April 2024",
//             item_date: "2024-01-29T19:53:00Z",
//             trendiness: 0.38744368916,
//             url: "https://cryptoevents.global/treasure-coast-bitcoin-meetup-april-2024/?utm_source=rss&utm_medium=rss&utm_campaign=treasure-coast-bitcoin-meetup-april-2024",
//             image: "https://cryptoevents.global/wp-content/uploads/2019/08/cropped-Bitcoin-Crypto-Transparent-PNG-32x32.png",
//             short_description:
//                 "Please join Treasure Coast Bitcoin Meetup at the Blue Door for drinks, snacks and to talk about all things Bitcoin! Beginners welcome. We are here to educate each other and share our passion for Bitcoin. Bitcoin only – not crypto!  Read more…The post...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Cryptoevents.jpg",
//                 name: "CryptoEvents",
//                 slug: "cryptoevents_news",
//             },
//             tags: [
//                 {
//                     name: "bitcoin",
//                     slug: "bitcoin",
//                 },
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//             ],
//         },
//         {
//             id: 14,
//             content_type: "newsitem",
//             item_id: 85769,
//             title: "Treasure Coast Bitcoin Meetup March 2024",
//             item_date: "2024-01-29T19:50:00Z",
//             trendiness: 0.3873025026,
//             url: "https://cryptoevents.global/treasure-coast-bitcoin-meetup-march-2024/?utm_source=rss&utm_medium=rss&utm_campaign=treasure-coast-bitcoin-meetup-march-2024",
//             image: "https://cryptoevents.global/wp-content/uploads/2019/08/cropped-Bitcoin-Crypto-Transparent-PNG-32x32.png",
//             short_description:
//                 "Please join Treasure Coast Bitcoin Meetup at the Blue Door for drinks, snacks and to talk about all things Bitcoin! Beginners welcome. We are here to educate each other and share our passion for Bitcoin. Bitcoin only – not crypto!  Read more…The post...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Cryptoevents.jpg",
//                 name: "CryptoEvents",
//                 slug: "cryptoevents_news",
//             },
//             tags: [
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: "bitcoin",
//                     slug: "bitcoin",
//                 },
//             ],
//         },
//         {
//             id: 15,
//             content_type: "newsitem",
//             item_id: 85765,
//             title: "Treasure Coast Bitcoin Meetup February 2024",
//             item_date: "2024-01-29T19:47:00Z",
//             trendiness: 0.38716138664,
//             url: "https://cryptoevents.global/treasure-coast-bitcoin-meetup-february-2024/?utm_source=rss&utm_medium=rss&utm_campaign=treasure-coast-bitcoin-meetup-february-2024",
//             image: "https://cryptoevents.global/wp-content/uploads/2019/08/cropped-Bitcoin-Crypto-Transparent-PNG-32x32.png",
//             short_description:
//                 "Please join Treasure Coast Bitcoin Meetup at the Blue Door for drinks, snacks and to talk about all things Bitcoin! Beginners welcome. We are here to educate each other and share our passion for Bitcoin. Bitcoin only – not crypto!  Read more…The post...",
//             file_url: null,
//             duration: null,
//             starts_at: null,
//             ends_at: null,
//             source: {
//                 icon: "icons/sources/Cryptoevents.jpg",
//                 name: "CryptoEvents",
//                 slug: "cryptoevents_news",
//             },
//             tags: [
//                 {
//                     name: "2024",
//                     slug: "2024",
//                 },
//                 {
//                     name: "bitcoin",
//                     slug: "bitcoin",
//                 },
//             ],
//         },
//     ],
// };
