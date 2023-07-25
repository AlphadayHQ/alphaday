import { TGetTweetsRawResponse } from "src/api/services";

export const twitterFeedMock: TGetTweetsRawResponse = {
    links: {
        next: null,
        previous: null,
    },
    total: 3,
    results: [
        {
            id: 17,
            hash: "d156dcfa9a6fb6bc9ecd94270b1ae483",
            source: {
                name: "Alphaday Twitter",
                slug: "alphaday_twitter_social",
                icon: "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/default_icon.png",
            },
            title: "RT @TO: Blockbuster and Netflix…The better business model always winsBitcoin-only startups will always be destroyed in the marketplace…",
            url: "https://twitter.com/twitter/status/1598589725400616960",
            image: null,
            tweet: {
                id: "1598589725400616960",
                lang: "en",
                text: "RT @TO: Blockbuster and Netflix…\n\nThe better business model always wins\n\nBitcoin-only startups will always be destroyed in the marketplace…",
                author: {
                    id: "863083003081359362",
                    url: "https://t.co/5ZffIXBPL0",
                    name: "antiprosynthesis.eth ⟠",
                    entities: {
                        url: {
                            urls: [
                                {
                                    end: 23,
                                    url: "https://t.co/5ZffIXBPL0",
                                    start: 0,
                                    display_url: "ethereum.org",
                                    expanded_url: "http://ethereum.org",
                                },
                            ],
                        },
                        description: {
                            cashtags: [
                                {
                                    end: 16,
                                    tag: "ETH",
                                    start: 12,
                                },
                            ],
                            hashtags: [
                                {
                                    end: 9,
                                    tag: "Ethereum",
                                    start: 0,
                                },
                            ],
                        },
                    },
                    username: "antiprosynth",
                    verified: false,
                    protected: false,
                    created_at: "2017-05-12T17:26:38.000Z",
                    description:
                        "#Ethereum ⟠ $ETH softcore developer, news aggregator and information asymmetry fighter.\n\n🐬🔊",
                    public_metrics: {
                        tweet_count: 193151,
                        listed_count: 922,
                        followers_count: 58010,
                        following_count: 3668,
                    },
                    profile_image_url:
                        "https://pbs.twimg.com/profile_images/1363775802454736899/RUjufbtQ_normal.jpg",
                },
                source: "Twitter Web App",
                entities: {
                    urls: [
                        {
                            end: 23,
                            url: "https://t.co/5ZffIXBPL0",
                            start: 0,
                            display_url: "ethereum.org",
                            expanded_url: "http://ethereum.org",
                        },
                    ],
                    mentions: [
                        {
                            id: "6635012",
                            end: 6,
                            start: 3,
                            username: "TO",
                        },
                    ],
                    annotations: [
                        {
                            end: 18,
                            type: "Other",
                            start: 8,
                            probability: 0.7918,
                            normalized_text: "Blockbuster",
                        },
                        {
                            end: 30,
                            type: "Organization",
                            start: 24,
                            probability: 0.9836,
                            normalized_text: "Netflix",
                        },
                        {
                            end: 79,
                            type: "Other",
                            start: 73,
                            probability: 0.9688,
                            normalized_text: "Bitcoin",
                        },
                    ],
                },
                author_id: "863083003081359362",
                created_at: "2022-12-02T08:07:45.000Z",
                public_metrics: {
                    like_count: 0,
                    quote_count: 0,
                    reply_count: 0,
                    retweet_count: 15,
                },
                reply_settings: "everyone",
                conversation_id: "1598589725400616960",
                referenced_tweets: [
                    {
                        id: "1598067328897363968",
                        type: "retweeted",
                        tweet: {
                            id: "1598067328897363968",
                            lang: "en",
                            text: "Blockbuster and Netflix…\n\nThe better business model always wins\n\nBitcoin-only startups will always be destroyed in the marketplace by competitors who listen to their customers\n\nNo way around it\n\n87% of Bitcoiners hold other crypto\n\nSmart move @lopp",
                            author: {
                                id: "6635012",
                                url: "https://t.co/Xxs98XOBm5",
                                name: "trevor.btc",
                                entities: {
                                    url: {
                                        urls: [
                                            {
                                                end: 23,
                                                url: "https://t.co/Xxs98XOBm5",
                                                start: 0,
                                                display_url:
                                                    "owl.link/trevor.btc",
                                                expanded_url:
                                                    "https://owl.link/trevor.btc",
                                            },
                                        ],
                                    },
                                    description: {
                                        hashtags: [
                                            {
                                                end: 90,
                                                tag: "SpacesHost",
                                                start: 79,
                                            },
                                        ],
                                        mentions: [
                                            {
                                                end: 59,
                                                start: 44,
                                                username: "StacksStartups",
                                            },
                                            {
                                                end: 76,
                                                start: 65,
                                                username: "ninjalerts",
                                            },
                                            {
                                                end: 119,
                                                start: 112,
                                                username: "nftnow",
                                            },
                                        ],
                                    },
                                },
                                username: "TO",
                                verified: true,
                                protected: false,
                                created_at: "2007-06-07T05:10:03.000Z",
                                description:
                                    "Investor in 50+ startups. Managing Partner, @StacksStartups. CEO @ninjalerts.\n\n#SpacesHost Not Financial Advice @nftnow",
                                public_metrics: {
                                    tweet_count: 32732,
                                    listed_count: 1279,
                                    followers_count: 48808,
                                    following_count: 10035,
                                },
                                profile_image_url:
                                    "https://pbs.twimg.com/profile_images/1597390052769898498/Tlbe7dYH_normal.jpg",
                            },
                            source: "Twitter for iPhone",
                            entities: {
                                mentions: [
                                    {
                                        id: "23618940",
                                        end: 248,
                                        start: 243,
                                        username: "lopp",
                                    },
                                ],
                                annotations: [
                                    {
                                        end: 10,
                                        type: "Other",
                                        start: 0,
                                        probability: 0.8142,
                                        normalized_text: "Blockbuster",
                                    },
                                    {
                                        end: 22,
                                        type: "Organization",
                                        start: 16,
                                        probability: 0.9699,
                                        normalized_text: "Netflix",
                                    },
                                    {
                                        end: 71,
                                        type: "Other",
                                        start: 65,
                                        probability: 0.9622,
                                        normalized_text: "Bitcoin",
                                    },
                                    {
                                        end: 211,
                                        type: "Other",
                                        start: 202,
                                        probability: 0.9374,
                                        normalized_text: "Bitcoiners",
                                    },
                                ],
                            },
                            author_id: "6635012",
                            created_at: "2022-11-30T21:31:56.000Z",
                            public_metrics: {
                                like_count: 142,
                                quote_count: 11,
                                reply_count: 65,
                                retweet_count: 15,
                            },
                            reply_settings: "everyone",
                            conversation_id: "1598067328897363968",
                            possibly_sensitive: false,
                            edit_history_tweet_ids: ["1598067328897363968"],
                        },
                    },
                ],
                possibly_sensitive: false,
                edit_history_tweet_ids: ["1598589725400616960"],
            },
            social_account: {
                id: 5,
                hash: "c7ae6e652d9797dcfbedd7067d7434b0",
                account_id: "863083003081359362",
                social_network: "twitter",
                username: "antiprosynth",
                name: "antiprosynthesis.eth ⟠",
                image: "https://pbs.twimg.com/profile_images/1363775802454736899/RUjufbtQ_normal.jpg",
                description:
                    "#Ethereum ⟠ $ETH softcore developer, news aggregator and information asymmetry fighter.\n\n🐬🔊",
                followers: 58010,
                following: 3668,
                posts: 193151,
                verified: false,
                tags: [],
            },
            social_network: "twitter",
            published_at: "2022-12-02T08:07:00Z",
        },
        {
            id: 28,
            hash: "9914ee03b1b4039c5635e9a60b787c22",
            source: {
                name: "Alphaday Twitter",
                slug: "alphaday_twitter_social",
                icon: "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/default_icon.png",
            },
            title: 'RT @evan_van_ness: since the Merge 77 days ago$BTC "inflation": $1,347,157,987$ETH "inflation": $387,891',
            url: "https://twitter.com/twitter/status/1598569531772911617",
            image: null,
            tweet: {
                id: "1598569531772911617",
                lang: "en",
                text: 'RT @evan_van_ness: since the Merge 77 days ago\n\n$BTC "inflation": $1,347,157,987\n\n$ETH "inflation": $387,891',
                author: {
                    id: "863083003081359362",
                    url: "https://t.co/5ZffIXBPL0",
                    name: "antiprosynthesis.eth ⟠",
                    entities: {
                        url: {
                            urls: [
                                {
                                    end: 23,
                                    url: "https://t.co/5ZffIXBPL0",
                                    start: 0,
                                    display_url: "ethereum.org",
                                    expanded_url: "http://ethereum.org",
                                },
                            ],
                        },
                        description: {
                            cashtags: [
                                {
                                    end: 16,
                                    tag: "ETH",
                                    start: 12,
                                },
                            ],
                            hashtags: [
                                {
                                    end: 9,
                                    tag: "Ethereum",
                                    start: 0,
                                },
                            ],
                        },
                    },
                    username: "antiprosynth",
                    verified: false,
                    protected: false,
                    created_at: "2017-05-12T17:26:38.000Z",
                    description:
                        "#Ethereum ⟠ $ETH softcore developer, news aggregator and information asymmetry fighter.\n\n🐬🔊",
                    public_metrics: {
                        tweet_count: 193151,
                        listed_count: 922,
                        followers_count: 58010,
                        following_count: 3668,
                    },
                    profile_image_url:
                        "https://pbs.twimg.com/profile_images/1363775802454736899/RUjufbtQ_normal.jpg",
                },
                source: "Twitter for Android",
                entities: {
                    cashtags: [
                        {
                            end: 52,
                            tag: "BTC",
                            start: 48,
                        },
                        {
                            end: 86,
                            tag: "ETH",
                            start: 82,
                        },
                    ],
                    mentions: [
                        {
                            id: "189518354",
                            end: 17,
                            start: 3,
                            username: "evan_van_ness",
                        },
                    ],
                    annotations: [
                        {
                            end: 51,
                            type: "Other",
                            start: 49,
                            probability: 0.6714,
                            normalized_text: "BTC",
                        },
                        {
                            end: 85,
                            type: "Other",
                            start: 83,
                            probability: 0.687,
                            normalized_text: "ETH",
                        },
                    ],
                },
                attachments: {
                    media_keys: ["3_1597598811978964997"],
                    attachments: [
                        {
                            height: 2160,
                            media_key: "3_1597598811978964997",
                            width: 3840,
                            type: "photo",
                            url: "https://pbs.twimg.com/media/FivPp7GXoAUHuEy.jpg",
                        },
                    ],
                },
                author_id: "863083003081359362",
                created_at: "2022-12-02T06:47:31.000Z",
                public_metrics: {
                    like_count: 0,
                    quote_count: 0,
                    reply_count: 0,
                    retweet_count: 17,
                },
                reply_settings: "everyone",
                conversation_id: "1598569531772911617",
                referenced_tweets: [
                    {
                        id: "1598406164475248678",
                        type: "retweeted",
                        tweet: {
                            id: "1598406164475248678",
                            lang: "en",
                            text: 'since the Merge 77 days ago\n\n$BTC "inflation": $1,347,157,987\n\n$ETH "inflation": $387,891',
                            author: {
                                id: "189518354",
                                url: "https://t.co/IhPxABjY8H",
                                name: "Evan Van Ness 🦇🔊",
                                entities: {
                                    url: {
                                        urls: [
                                            {
                                                end: 23,
                                                url: "https://t.co/IhPxABjY8H",
                                                start: 0,
                                                display_url: "evanvanness.com",
                                                expanded_url:
                                                    "http://www.evanvanness.com",
                                            },
                                        ],
                                    },
                                    description: {
                                        mentions: [
                                            {
                                                end: 138,
                                                start: 124,
                                                username: "StarbloomVent",
                                            },
                                        ],
                                    },
                                },
                                username: "evan_van_ness",
                                verified: false,
                                protected: false,
                                created_at: "2010-09-11T13:55:00.000Z",
                                description:
                                    "People mostly follow me for my RTs of Ethereum tech news and spicy takes on crypto scams.\n\nInvesting in the future of web3: @StarbloomVent",
                                public_metrics: {
                                    tweet_count: 3062,
                                    listed_count: 1566,
                                    followers_count: 92761,
                                    following_count: 738,
                                },
                                profile_image_url:
                                    "https://pbs.twimg.com/profile_images/1543128738145222656/mnP7hq3t_normal.jpg",
                            },
                            source: "Twitter Web App",
                            entities: {
                                cashtags: [
                                    {
                                        end: 33,
                                        tag: "BTC",
                                        start: 29,
                                    },
                                    {
                                        end: 67,
                                        tag: "ETH",
                                        start: 63,
                                    },
                                ],
                                annotations: [
                                    {
                                        end: 32,
                                        type: "Other",
                                        start: 30,
                                        probability: 0.6014,
                                        normalized_text: "BTC",
                                    },
                                    {
                                        end: 66,
                                        type: "Other",
                                        start: 64,
                                        probability: 0.6994,
                                        normalized_text: "ETH",
                                    },
                                ],
                            },
                            author_id: "189518354",
                            created_at: "2022-12-01T19:58:21.000Z",
                            public_metrics: {
                                like_count: 115,
                                quote_count: 5,
                                reply_count: 16,
                                retweet_count: 17,
                            },
                            reply_settings: "everyone",
                            conversation_id: "1598406164475248678",
                            possibly_sensitive: false,
                            edit_history_tweet_ids: ["1598406164475248678"],
                        },
                    },
                ],
                possibly_sensitive: false,
                edit_history_tweet_ids: ["1598569531772911617"],
            },
            social_account: {
                id: 5,
                hash: "c7ae6e652d9797dcfbedd7067d7434b0",
                account_id: "863083003081359362",
                social_network: "twitter",
                username: "antiprosynth",
                name: "antiprosynthesis.eth ⟠",
                image: "https://pbs.twimg.com/profile_images/1363775802454736899/RUjufbtQ_normal.jpg",
                description:
                    "#Ethereum ⟠ $ETH softcore developer, news aggregator and information asymmetry fighter.\n\n🐬🔊",
                followers: 58010,
                following: 3668,
                posts: 193151,
                verified: false,
                tags: [],
            },
            social_network: "twitter",
            published_at: "2022-12-02T06:47:00Z",
        },
        {
            id: 27,
            hash: "e50011e613fd867a594471b081caff05",
            source: {
                name: "Alphaday Twitter",
                slug: "alphaday_twitter_social",
                icon: "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/default_icon.png",
            },
            title: "RT @evan_van_ness: @ultrasoundmoney @coinmetrics $BTC has 3473 more inflation than $ETH at the moment$BTC money printer go brrrrrrrrrrrrr…",
            url: "https://twitter.com/twitter/status/1598569581118951424",
            image: null,
            tweet: {
                id: "1598569581118951424",
                lang: "en",
                text: "RT @evan_van_ness: @ultrasoundmoney @coinmetrics $BTC has 3473 more inflation than $ETH at the moment\n\n$BTC money printer go brrrrrrrrrrrrr…",
                author: {
                    id: "863083003081359362",
                    url: "https://t.co/5ZffIXBPL0",
                    name: "antiprosynthesis.eth ⟠",
                    entities: {
                        url: {
                            urls: [
                                {
                                    end: 23,
                                    url: "https://t.co/5ZffIXBPL0",
                                    start: 0,
                                    display_url: "ethereum.org",
                                    expanded_url: "http://ethereum.org",
                                },
                            ],
                        },
                        description: {
                            cashtags: [
                                {
                                    end: 16,
                                    tag: "ETH",
                                    start: 12,
                                },
                            ],
                            hashtags: [
                                {
                                    end: 9,
                                    tag: "Ethereum",
                                    start: 0,
                                },
                            ],
                        },
                    },
                    username: "antiprosynth",
                    verified: false,
                    protected: false,
                    created_at: "2017-05-12T17:26:38.000Z",
                    description:
                        "#Ethereum ⟠ $ETH softcore developer, news aggregator and information asymmetry fighter.\n\n🐬🔊",
                    public_metrics: {
                        tweet_count: 193151,
                        listed_count: 922,
                        followers_count: 58010,
                        following_count: 3668,
                    },
                    profile_image_url:
                        "https://pbs.twimg.com/profile_images/1363775802454736899/RUjufbtQ_normal.jpg",
                },
                source: "Twitter for Android",
                entities: {
                    cashtags: [
                        {
                            end: 53,
                            tag: "BTC",
                            start: 49,
                        },
                        {
                            end: 87,
                            tag: "ETH",
                            start: 83,
                        },
                        {
                            end: 107,
                            tag: "BTC",
                            start: 103,
                        },
                    ],
                    mentions: [
                        {
                            id: "189518354",
                            end: 17,
                            start: 3,
                            username: "evan_van_ness",
                        },
                        {
                            id: "1366753588047978500",
                            end: 35,
                            start: 19,
                            username: "ultrasoundmoney",
                        },
                        {
                            id: "867328053416001536",
                            end: 48,
                            start: 36,
                            username: "coinmetrics",
                        },
                    ],
                    annotations: [
                        {
                            end: 52,
                            type: "Other",
                            start: 50,
                            probability: 0.7026,
                            normalized_text: "BTC",
                        },
                        {
                            end: 86,
                            type: "Other",
                            start: 84,
                            probability: 0.7701,
                            normalized_text: "ETH",
                        },
                        {
                            end: 106,
                            type: "Other",
                            start: 104,
                            probability: 0.762,
                            normalized_text: "BTC",
                        },
                    ],
                },
                author_id: "863083003081359362",
                created_at: "2022-12-02T06:47:42.000Z",
                public_metrics: {
                    like_count: 0,
                    quote_count: 0,
                    reply_count: 0,
                    retweet_count: 1,
                },
                reply_settings: "everyone",
                conversation_id: "1598569581118951424",
                referenced_tweets: [
                    {
                        id: "1598426964150263809",
                        type: "retweeted",
                        tweet: {
                            id: "1598426964150263809",
                            lang: "en",
                            text: "@ultrasoundmoney @coinmetrics $BTC has 3473 more inflation than $ETH at the moment\n\n$BTC money printer go brrrrrrrrrrrrrrrrrrrrr 🖨️",
                            author: {
                                id: "189518354",
                                url: "https://t.co/IhPxABjY8H",
                                name: "Evan Van Ness 🦇🔊",
                                entities: {
                                    url: {
                                        urls: [
                                            {
                                                end: 23,
                                                url: "https://t.co/IhPxABjY8H",
                                                start: 0,
                                                display_url: "evanvanness.com",
                                                expanded_url:
                                                    "http://www.evanvanness.com",
                                            },
                                        ],
                                    },
                                    description: {
                                        mentions: [
                                            {
                                                end: 138,
                                                start: 124,
                                                username: "StarbloomVent",
                                            },
                                        ],
                                    },
                                },
                                username: "evan_van_ness",
                                verified: false,
                                protected: false,
                                created_at: "2010-09-11T13:55:00.000Z",
                                description:
                                    "People mostly follow me for my RTs of Ethereum tech news and spicy takes on crypto scams.\n\nInvesting in the future of web3: @StarbloomVent",
                                public_metrics: {
                                    tweet_count: 3062,
                                    listed_count: 1566,
                                    followers_count: 92761,
                                    following_count: 738,
                                },
                                profile_image_url:
                                    "https://pbs.twimg.com/profile_images/1543128738145222656/mnP7hq3t_normal.jpg",
                            },
                            source: "Twitter Web App",
                            entities: {
                                cashtags: [
                                    {
                                        end: 34,
                                        tag: "BTC",
                                        start: 30,
                                    },
                                    {
                                        end: 68,
                                        tag: "ETH",
                                        start: 64,
                                    },
                                    {
                                        end: 88,
                                        tag: "BTC",
                                        start: 84,
                                    },
                                ],
                                mentions: [
                                    {
                                        id: "1366753588047978500",
                                        end: 16,
                                        start: 0,
                                        username: "ultrasoundmoney",
                                    },
                                    {
                                        id: "867328053416001536",
                                        end: 29,
                                        start: 17,
                                        username: "coinmetrics",
                                    },
                                ],
                                annotations: [
                                    {
                                        end: 33,
                                        type: "Other",
                                        start: 31,
                                        probability: 0.7914,
                                        normalized_text: "BTC",
                                    },
                                    {
                                        end: 67,
                                        type: "Other",
                                        start: 65,
                                        probability: 0.8029,
                                        normalized_text: "ETH",
                                    },
                                    {
                                        end: 87,
                                        type: "Other",
                                        start: 85,
                                        probability: 0.8009,
                                        normalized_text: "BTC",
                                    },
                                ],
                            },
                            author_id: "189518354",
                            created_at: "2022-12-01T21:21:00.000Z",
                            public_metrics: {
                                like_count: 27,
                                quote_count: 1,
                                reply_count: 3,
                                retweet_count: 1,
                            },
                            reply_settings: "everyone",
                            conversation_id: "1598406164475248678",
                            referenced_tweets: [
                                {
                                    id: "1598406425822330891",
                                    type: "replied_to",
                                },
                            ],
                            possibly_sensitive: false,
                            in_reply_to_user_id: "189518354",
                            edit_history_tweet_ids: ["1598426964150263809"],
                        },
                    },
                ],
                possibly_sensitive: false,
                edit_history_tweet_ids: ["1598569581118951424"],
            },
            social_account: {
                id: 5,
                hash: "c7ae6e652d9797dcfbedd7067d7434b0",
                account_id: "863083003081359362",
                social_network: "twitter",
                username: "antiprosynth",
                name: "antiprosynthesis.eth ⟠",
                image: "https://pbs.twimg.com/profile_images/1363775802454736899/RUjufbtQ_normal.jpg",
                description:
                    "#Ethereum ⟠ $ETH softcore developer, news aggregator and information asymmetry fighter.\n\n🐬🔊",
                followers: 58010,
                following: 3668,
                posts: 193151,
                verified: false,
                tags: [],
            },
            social_network: "twitter",
            published_at: "2022-12-02T06:47:00Z",
        },
    ],
};
