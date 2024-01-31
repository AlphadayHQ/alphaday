import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as SettingsSVG } from "src/assets/icons/settings.svg";
import { ReactComponent as Settings2SVG } from "src/assets/icons/settings3.svg";
import MobileLayout from "src/layout/MobileLayout";
import { FeedCard } from "src/mobile-components/superfeed/FeedCard";
import {
    EFeedItemType,
    IFeedItem,
} from "src/mobile-components/superfeed/types";

const now = new Date();

const chartData = [
    [1706273097131, 2250.0667783427607],
    [1706273996709, 2246.3367674240994],
    [1706274901373, 2247.99344840958],
    [1706275799433, 2246.2968764695356],
    [1706276705248, 2244.474255181599],
    [1706277595829, 2239.8372221374243],
    [1706278494217, 2247.0360457001625],
    [1706279398409, 2245.7937290565005],
    [1706280300428, 2251.738464994398],
    [1706281205025, 2254.818673072071],
    [1706282100133, 2255.3629893769153],
    [1706283003869, 2253.95951481728],
    [1706283899503, 2254.135792330122],
    [1706284803563, 2260.9281622612093],
    [1706285693065, 2263.217508815467],
    [1706286596846, 2272.538842606368],
    [1706287495985, 2268.372211158209],
    [1706288401723, 2276.964698175382],
    [1706289308350, 2274.5463335520403],
    [1706290206345, 2267.7996634209717],
    [1706291097245, 2271.932128318796],
    [1706291994624, 2268.6540802229124],
    [1706292902443, 2273.0751658779463],
    [1706293799495, 2271.9709144886046],
    [1706294701186, 2266.2856658131755],
    [1706295609215, 2263.6902030235715],
    [1706296490469, 2262.48007282498],
    [1706297395354, 2262.9464667176526],
    [1706298294369, 2256.785323446236],
    [1706299196285, 2257.504759488708],
    [1706300106174, 2261.5341744266098],
    [1706300999518, 2256.690399469378],
    [1706301899252, 2256.8496264813593],
    [1706302791259, 2256.727281296557],
    [1706303696611, 2254.2774992761324],
    [1706304590644, 2255.507136780653],
    [1706305505038, 2254.189375436523],
    [1706306415676, 2258.8996451343146],
    [1706307298245, 2256.2423228266957],
    [1706308197554, 2264.8812278795813],
    [1706309099664, 2267.9401749260282],
    [1706309992610, 2266.1983532954114],
    [1706310895201, 2264.063112350343],
    [1706311807229, 2265.543969455986],
    [1706312696530, 2266.6633400773553],
    [1706313595852, 2268.8707315074744],
    [1706314498012, 2272.196576220287],
    [1706315407356, 2271.6659483650114],
    [1706316289510, 2275.318565442185],
    [1706317203768, 2279.123872201125],
    [1706318093997, 2275.3620974083638],
    [1706319003482, 2277.442775885831],
    [1706319899613, 2274.3927083669723],
    [1706320795992, 2270.676961505163],
    [1706321701008, 2272.100985717526],
    [1706322601832, 2272.4520588872297],
    [1706323495526, 2270.9842269573624],
    [1706324397682, 2275.051327908884],
    [1706325302302, 2271.32185516687],
    [1706326198852, 2275.174196446332],
    [1706327098019, 2274.4582593591394],
    [1706328008518, 2273.738446599637],
    [1706328904887, 2275.2716062957697],
    [1706329798373, 2276.6483747032],
    [1706330705224, 2274.720546025172],
    [1706331598091, 2273.791968051594],
    [1706332506321, 2268.6881336238507],
    [1706333402263, 2267.48095166486],
    [1706334300873, 2264.6708980599005],
    [1706335219368, 2263.0155938282983],
    [1706336093324, 2264.157984259522],
    [1706336989755, 2265.730051049487],
    [1706337907255, 2265.152545138164],
    [1706338811883, 2264.809377142334],
    [1706339705763, 2263.93250351319],
    [1706340596212, 2255.8283136204],
    [1706341501985, 2257.8419499000133],
    [1706342399404, 2256.4616797239105],
    [1706343295662, 2253.31646885909],
    [1706344206972, 2256.201788581027],
    [1706345094200, 2254.7106269457713],
    [1706345999075, 2249.926569982382],
    [1706346877653, 2258.9243277967926],
    [1706347793291, 2261.287165864445],
    [1706348695437, 2264.046352776074],
    [1706349601357, 2265.3673963925567],
    [1706350494799, 2269.34840782942],
    [1706351398305, 2266.678942807403],
    [1706352295850, 2266.740408755808],
    [1706353207239, 2263.6958915844416],
    [1706354102629, 2264.8585351738284],
    [1706354999108, 2263.0168131112828],
    [1706355898822, 2267.6150645249327],
    [1706356803963, 2265.718880333074],
    [1706357689465, 2269.3558156956874],
    [1706358606846, 2266.0422803174297],
    [1706359533000, 2263.316770207767],
];

const feedItems: IFeedItem[] = [
    {
        id: 10,
        type: EFeedItemType.TVL,
        date: new Date(now.setHours(now.getHours() - 1)),
        tvl: 2269.4,
        change: 2.1,
        history: chartData,
        coin: {
            name: "Ethereum",
            img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
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
    },
    {
        id: 9,
        type: EFeedItemType.PRICE,
        date: new Date(now.setHours(now.getHours() - 1)),
        price: 2269.4,
        change: -0.1,
        history: chartData,
        coin: {
            name: "Ethereum",
            img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
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
    },
    {
        id: 9,
        type: EFeedItemType.SOCIAL,
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
        img: "https://i2.ytimg.com/vi/u5PLbdkuUo4/hqdefault.jpg",
        likes: 123,
        comments: 123,
        link: "https://cointelegraph.com/magazine/painful-nft-creator-nate-alex-70-cryptopunks/",
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
    {
        id: 8,
        type: EFeedItemType.PERSON,
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
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
    {
        id: 7,
        type: EFeedItemType.FORUM,
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
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
    {
        id: 6,
        type: EFeedItemType.BLOG,
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
        description:
            "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
    },
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

const FiltersButton = () => {
    const showPosition = 492;
    const element1: React.Ref<HTMLAnchorElement> = useRef(null);
    const element2: React.Ref<HTMLAnchorElement> = useRef(null);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (
                window.pageYOffset > showPosition &&
                !element1?.current?.classList.contains("scroll-show") &&
                element1?.current
            ) {
                element1?.current?.classList.remove("scroll-hide");
                element1?.current?.classList.add("scroll-show");
                element2?.current?.classList.add("scroll-hide");
                element2?.current?.classList.remove("scroll-show");
            }

            if (
                window.pageYOffset < showPosition &&
                element1?.current?.classList.contains("scroll-show") &&
                element1?.current
            ) {
                element1?.current?.classList.remove("scroll-show");
                element1?.current?.classList.add("scroll-hide");
                element2?.current?.classList.add("scroll-show");
                element2?.current?.classList.remove("scroll-hide");
            }
        });
    }, []);
    return (
        <>
            <Link
                ref={element1}
                className="flex justify-between mt-2 mb-3 mx-5 px-4 py-2 border border-accentVariant100 rounded-lg"
                to="/filters"
            >
                <p className="m-0 pr-2 fontGroup-highlight self-center">
                    Craft your superfeed with personalized filters
                </p>
                <SettingsSVG className="w-6 text-accentVariant100 mt-[3px]" />
            </Link>
            <Link
                ref={element2}
                to="/filters"
                className="absolute bg-accentVariant100 rounded-lg p-4 bottom-24 right-5"
            >
                <Settings2SVG className="w-6 text-primary" />
            </Link>
        </>
    );
};

const SuperfeedPage = () => {
    return (
        <MobileLayout>
            <FiltersButton />
            <div className="w-full px-5 pt-4">
                {feedItems.map((item) => (
                    <FeedCard key={item.id} item={item} />
                ))}
            </div>
        </MobileLayout>
    );
};

export default SuperfeedPage;
