import { FC, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePagination, useView, useWidgetHeight } from "src/api/hooks";
import {
    TBaseTag,
    TRemoteCoin,
    useBookmarkNewsItemMutation,
    useGetPinnedCoinsQuery,
    useOpenNewsItemMutation,
} from "src/api/services";
import { useGetPredictionsQuery } from "src/api/services/kasandra/kasandraEndpoints";
import {
    setKasandraFeedPreference,
    selectKasandraFeedPreference,
    setKasandraSelectedDataPoint,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { TKasandraItem, EItemFeedPreference, TCoin } from "src/api/types";
// import * as filterUtils from "src/api/utils/filterUtils";
import {
    buildUniqueItemList,
    itemListsAreEqual,
} from "src/api/utils/itemUtils";
import { Logger } from "src/api/utils/logging";
import { toast } from "src/api/utils/toastUtils";
import KasandraTimelineModule from "src/components/kasandra/KasandraTimelineModule";
import CONFIG from "src/config";
import { EWidgetSettingsRegistry } from "src/constants";
import globalMessages from "src/globalMessages";
import { IModuleContainer } from "src/types";

// Array of the 10 most likely events that could affect Ethereum prices

const mockItemsResponse: {
    links: {
        next: string | null;
        previous: string | null;
    };
    total: number;
    results: TKasandraItem[];
} = {
    links: {
        next: "https://api.zettaday.com/items/news/?page=2&tags=",
        previous: null,
    },
    total: 196570,
    results: [
        {
            id: 197241,
            title: "Major CBDC Implementation Using Ethereum Technology",
            expectedPercentChange: 33.5,
            description:
                "In September 2024, a G7 nation announces it will utilize a permissioned version of Ethereum technology as the foundation for its Central Bank Digital Currency (CBDC) implementation, scheduled for public testing in December 2024. The central bank specifically cites Ethereum's proven security, mature development ecosystem, and the ability to implement programmable money features as key factors in their decision. While using a permissioned implementation, the central bank also announces plans to explore interoperability with public Ethereum through secure bridges, potentially allowing regulated interaction between the CBDC and DeFi protocols under specific compliance conditions. This represents the first major CBDC to directly leverage public blockchain technology rather than building entirely proprietary systems. Ethereum validators and developers with expertise in CBDC implementations see unprecedented demand for their services, with consulting rates increasing 3-4x. Corporate entities rush to develop Ethereum-compatible infrastructure in anticipation of potential CBDC integration, driving a wave of enterprise adoption. Institutional investors recognize this as validation at the highest governmental levels, triggering a fundamental reassessment of Ethereum's long-term value proposition and potential as critical financial infrastructure.",
            url: "https://www.newsbtc.com/news/bitcoin/bitcoin-bull-run-cathie-wood-1-5-million/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/newsbtc_news.jpg",
            sourceSlug: "newsbtc_news",
            sourceName: "NewsBTC",
            author: "Jake Simmons",
            publishedAt: "2025-03-19T12:00:00Z",
            bookmarked: false,

            dataPoint: [1741164660348, 87851.52480429214],
        },
        {
            id: 197099,
            title: "U.S. Post-Election Regulatory Clarity",
            expectedPercentChange: 27.3,
            description:
                "Following the November 2024 U.S. presidential election, the incoming administration announces a comprehensive digital asset framework that provides unprecedented regulatory clarity for the cryptocurrency industry. The framework explicitly recognizes Ethereum as a commodity rather than a security, ending years of regulatory uncertainty. The administration also announces the formation of a Digital Assets Advisory Council that includes representation from leading blockchain companies and research organizations. Markets respond immediately to this regulatory certainty, with institutional investors deploying capital that had been sidelined due to compliance concerns. Within three weeks of the announcement, institutional inflows to Ethereum investment products exceed $6.5 billion, with particularly strong interest from traditional financial institutions that had maintained minimal exposure due to regulatory uncertainty. The framework also provides clear guidelines for DeFi protocols, distinguishing between regulated front-ends and permissionless smart contracts, allowing the ecosystem to develop compliance strategies without undermining the core innovations of decentralized finance. This regulatory breakthrough removes the single largest obstacle to institutional Ethereum adoption.",
            url: "https://cointelegraph.com/news/polygon-cofounder-sandeep-nailwal-bfi-crypto-donations-2024?utm_source=rss_feed&utm_medium=rss&utm_campaign=rss_partner_inbound",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cointelegraph_news.jpg",
            sourceSlug: "cointelegraph_news",
            sourceName: "Cointelegraph",
            author: "Cointelegraph by Lyne Qian",
            publishedAt: "2025-03-19T12:00:00Z",
            bookmarked: false,

            dataPoint: [1741170107310, 88585.41702795791],
        },
        {
            id: 197180,
            title: "Spot Ethereum ETF Trading Volumes Exceed Expectations",
            expectedPercentChange: 31.6,
            description:
                "Following their May 2024 launch, spot Ethereum ETFs demonstrate unexpectedly strong institutional demand, with combined assets under management reaching $12 billion by September 2024, far exceeding analyst projections of $5-7 billion. Daily trading volumes consistently exceed 15 million shares across all issuers, with BlackRock's EETH and Fidelity's FETH capturing approximately 60% of market share. Institutional allocation reports reveal that university endowments, pension funds, and family offices are allocating 0.5-1.5% of portfolios to Ethereum exposure, primarily through these regulated vehicles. By Q4 2024, ETF issuers collectively hold approximately 3.8 million ETH (about 3.2% of total supply), creating significant supply pressure as new units must be created to meet continuing demand. Traditional financial analysts at major banks issue research reports acknowledging Ethereum's development toward becoming a global settlement layer, with several revising year-end price targets upward by 40-50%. This institutional validation fundamentally alters Ethereum's investor profile and liquidity characteristics.",
            url: "https://crypto.news/embargo-19th-march-2025-530pm-ist-8am-et-polygon-co-founder-donates-over-90m-to-healthcare-through-bfi/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/crypto-news.png",
            sourceSlug: "crypto_news_news",
            sourceName: "Crypto.news",
            author: "Trisha Husada",
            publishedAt: "2025-03-19T12:00:00Z",
            bookmarked: false,

            dataPoint: [1741178438708, 90642.95015625951],
        },
        {
            id: 197260,
            title: "Major DeFi Protocol Security Incident",
            expectedPercentChange: -28.6,
            description:
                "In November 2024, a sophisticated exploit targets a vulnerability common to several major DeFi lending protocols built on Ethereum, resulting in approximately $780 million in losses across three platforms within a 48-hour period. The exploit leverages a previously undiscovered vulnerability in a widely-used smart contract library that bypasses multiple security audits. As news spreads, users rush to withdraw funds from all DeFi platforms, causing total value locked (TVL) across Ethereum DeFi to plummet from $48 billion to under $30 billion in just five days. Gas prices spike to extreme levels during the panic, with average transactions exceeding 300 gwei, making the network nearly unusable for ordinary users. Multiple stablecoins experience brief depegs as liquidity evaporates from DEXs. Mainstream financial media coverage focuses extensively on the security failures, reviving narratives about blockchain technology's inherent risks. Regulatory agencies in multiple jurisdictions announce investigations, with several suggesting immediate consumer protection measures that would significantly restrict DeFi operations. The breach particularly damages institutional confidence, with approximately $4.2 billion in institutional funds exiting Ethereum-based investment products in the following three weeks.",
            url: "https://www.coindesk.com/business/2025/03/19/crypto-wallet-provider-utila-raises-usd18m-as-institutional-demand-for-digital-asset-management-soars",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/coindesk_news.png",
            sourceSlug: "coindesk_news",
            sourceName: "Coindesk",
            author: "Krisztian Sandor",
            publishedAt: "2025-03-19T12:00:00Z",
            bookmarked: false,

            dataPoint: [1741187721785, 88645.80293266727],
        },
        {
            id: 197118,
            title: "Zero-Knowledge EVM Compatibility Breakthrough",
            expectedPercentChange: 19.2,
            description:
                "In October 2024, a major technical breakthrough in zero-knowledge proof systems enables fully EVM-compatible ZK-rollups with performance comparable to optimistic rollups but with instant finality and enhanced security properties. This development eliminates the previous compromise between EVM compatibility and ZK benefits that had fragmented the L2 ecosystem. Leading projects Polygon zkEVM and zkSync announce immediate implementation of these advancements, enabling existing Ethereum applications to deploy on their networks with zero modifications while benefiting from 100x lower fees and transaction finality in under 15 seconds. The breakthrough triggers a developer migration, with over 65% of new DeFi and NFT projects launching directly on ZK-rollups rather than Ethereum mainnet or optimistic rollups by December 2024. Ethereum gains significant advantage over competing Layer 1 blockchains, as its modular architecture with rollups now delivers superior performance without sacrificing security or decentralization. The development community recognizes this as the definitive solution to blockchain's scalability challenges, cementing Ethereum's position as the dominant smart contract platform.",
            url: "https://cryptopotato.com/eos-experiences-25-spike-following-vaulta-rebranding-announcement/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cryptopotato_news.png",
            sourceSlug: "cryptopotato_news",
            sourceName: "CryptoPotato",
            author: "Chayanika Deka",
            publishedAt: "2025-03-19T11:59:00Z",
            bookmarked: false,

            dataPoint: [1741194993156, 89200.38695874772],
        },
        {
            id: 197119,
            title: "ETH 2.0 Upgrade Phase Completion",
            expectedPercentChange: 15.8,
            description:
                "Successful completion of a major Ethereum 2.0 upgrade phase focusing on sharding implementation, which would divide the network into multiple parallel chains. This upgrade would significantly reduce transaction costs from the current average of $2-5 down to cents, while increasing throughput from approximately 15-30 transactions per second to potentially thousands. The improved scalability would make Ethereum viable for everyday microtransactions and high-frequency trading applications, attracting both retail users priced out by previous gas fees and enterprises requiring higher throughput for business operations. Market sentiment typically rallies around successful technical milestones, particularly those addressing Ethereum's most criticized limitation.",
            url: "https://cryptopotato.com/very-important-pi-network-pi-update-heres-what-you-need-to-know/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cryptopotato_news.png",
            sourceSlug: "cryptopotato_news",
            sourceName: "CryptoPotato",
            author: "Dimitar Dzhondzhorov",
            publishedAt: "2025-03-20T16:54:00Z",
            bookmarked: false,

            dataPoint: [1741213299449, 93150.48615154381],
        },
        {
            id: 197280,
            title: "Interoperability Protocol Launch",
            expectedPercentChange: 9.6,
            description:
                "Successful launch and rapid adoption of a protocol enabling seamless interoperability between Ethereum and other major blockchains, including Bitcoin, Solana, and Cosmos. This protocol would allow assets and data to flow between chains without centralized bridges, which have been frequent targets for exploits with over $2 billion lost in bridge hacks to date. Within the first six months, the protocol would secure cross-chain transactions exceeding $50 billion in total volume, with daily flows stabilizing around $500-700 million. This interoperability would position Ethereum as the central hub in a connected blockchain ecosystem due to its established liquidity and developer ecosystem. Approximately 30-40% of value currently isolated on alternative L1 blockchains would become accessible to Ethereum-based applications, expanding the total addressable market for Ethereum DeFi by an estimated $15-20 billion. The reduction in friction between blockchain ecosystems would particularly benefit Ethereum as the largest smart contract platform, reinforcing its network effects rather than diluting them.",
            url: "https://crypto-times.jp/news-coinbase-report-xrp/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/Crypto_times.png",
            sourceSlug: "cryptotimes_news",
            sourceName: "CryptoTimes",
            author: "Crypto Times 編集部",
            publishedAt: "2025-03-20T20:53:00Z",
            bookmarked: false,

            dataPoint: [1741224991917, 95360.60531197047],
        },
        {
            id: 197255,
            title: "Regulatory Clarity for DeFi Protocols",
            expectedPercentChange: -1.2,
            description:
                "Implementation of a comprehensive regulatory framework specifically addressing decentralized finance protocols built on Ethereum. Regulators would likely require enhanced KYC/AML procedures for front-end interfaces, effectively creating a two-tier DeFi ecosystem: compliant protocols accessible to retail and institutional users, and non-compliant protocols limited to users with technical knowledge to interact directly with smart contracts. Major DeFi protocols would face compliance costs estimated at $5-10 million each, with ongoing operational expenses reducing yields by approximately 15-25%. The TVL in compliant DeFi would initially drop by 30-40% before stabilizing as institutional capital gradually enters the regulated space. Ethereum transaction volume would temporarily decrease by 20-25% during this transition period, as users reassess their positions and some exit to more privacy-focused chains. However, long-term price stability would benefit from reduced regulatory uncertainty and increased institutional participation.",
            url: "https://cryptobriefing.com/north-carolina-bitcoin-reserve-bill/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cryptobriefing.jpg",
            sourceSlug: "cryptobriefing_news",
            sourceName: "CryptoBriefing",
            author: "Vivian Nguyen",
            publishedAt: "2025-03-20T23:49:00Z",
            bookmarked: false,

            dataPoint: [1741233957824, 96775.07080936989],
        },
        {
            id: 197201,
            title: "Stablecoin Regulatory Framework",
            expectedPercentChange: -14.2,
            description:
                "Implementation of strict regulatory requirements for stablecoins, mandating full reserves, regular audits, and compliance with banking-style regulations. Major stablecoins like USDT and USDC, which currently account for approximately 40-50% of transaction volume on Ethereum, would face adjustment periods lasting 3-6 months. During this transition, stablecoin market caps might temporarily contract by 15-25% as issuers adjust reserves and liquidity. Smaller or non-compliant stablecoins representing about $15-20 billion in market cap would potentially exit the market or migrate to less regulated chains. Since stablecoin transactions constitute nearly half of Ethereum's gas usage, the reduced activity would lower network fees by 30-40%, potentially decreasing validator revenue by a similar percentage. While long-term regulatory clarity would eventually benefit the ecosystem, the immediate impact would be a significant reduction in network activity and demand for ETH as gas payment, affecting both price and staking yields.",
            url: "https://cryptodaily.co.uk/2025/03/top-memecoins-to-invest-in-right-now",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/Crypto_Daily_w4XrX0d.png",
            sourceSlug: "cryptodaily_news",
            sourceName: "CryptoDaily",
            author: "Ethan Caldwell",
            publishedAt: "2025-03-21T04:01:00Z",
            bookmarked: false,

            dataPoint: [1741239404177, 97496.58285405449],
        },
        {
            id: 197166,
            title: "ETH 2.0 Upgrade Phase Completion",
            expectedPercentChange: 0.8,
            description:
                "Successful completion of a major Ethereum 2.0 upgrade phase focusing on sharding implementation, which would divide the network into multiple parallel chains. This upgrade would significantly reduce transaction costs from the current average of $2-5 down to cents, while increasing throughput from approximately 15-30 transactions per second to potentially thousands. The improved scalability would make Ethereum viable for everyday microtransactions and high-frequency trading applications, attracting both retail users priced out by previous gas fees and enterprises requiring higher throughput for business operations. Market sentiment typically rallies around successful technical milestones, particularly those addressing Ethereum's most criticized limitation.",
            url: "https://www.theblock.co/post/347017/hollywood-filmmaker-arrested-charged-alleged-11-million-usd-fraud-trade-cryptocurrencies?utm_source=rss&utm_medium=rss",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/images-removebg-preview.png",
            sourceSlug: "theblock_news",
            sourceName: "The Block",
            author: "James Hunt",
            publishedAt: "2025-03-20T16:54:00Z",
            bookmarked: false,

            dataPoint: [1741213299449, 90150.48615154381],
        },
        {
            id: 197181,
            title: "Interoperability Protocol Launch",
            expectedPercentChange: 2.6,
            description:
                "Successful launch and rapid adoption of a protocol enabling seamless interoperability between Ethereum and other major blockchains, including Bitcoin, Solana, and Cosmos. This protocol would allow assets and data to flow between chains without centralized bridges, which have been frequent targets for exploits with over $2 billion lost in bridge hacks to date. Within the first six months, the protocol would secure cross-chain transactions exceeding $50 billion in total volume, with daily flows stabilizing around $500-700 million. This interoperability would position Ethereum as the central hub in a connected blockchain ecosystem due to its established liquidity and developer ecosystem. Approximately 30-40% of value currently isolated on alternative L1 blockchains would become accessible to Ethereum-based applications, expanding the total addressable market for Ethereum DeFi by an estimated $15-20 billion. The reduction in friction between blockchain ecosystems would particularly benefit Ethereum as the largest smart contract platform, reinforcing its network effects rather than diluting them.",
            url: "https://crypto.news/hive-digital-completes-acquisition-of-paraguays-yguazu-site-seeks-317-mining-boost/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/crypto-news.png",
            sourceSlug: "crypto_news_news",
            sourceName: "Crypto.news",
            author: "Denis Omelchenko",
            publishedAt: "2025-03-20T20:53:00Z",
            bookmarked: false,

            dataPoint: [1741224991917, 90360.60531197047],
        },
        {
            id: 197182,
            title: "Regulatory Clarity for DeFi Protocols",
            expectedPercentChange: -4.2,
            description:
                "Implementation of a comprehensive regulatory framework specifically addressing decentralized finance protocols built on Ethereum. Regulators would likely require enhanced KYC/AML procedures for front-end interfaces, effectively creating a two-tier DeFi ecosystem: compliant protocols accessible to retail and institutional users, and non-compliant protocols limited to users with technical knowledge to interact directly with smart contracts. Major DeFi protocols would face compliance costs estimated at $5-10 million each, with ongoing operational expenses reducing yields by approximately 15-25%. The TVL in compliant DeFi would initially drop by 30-40% before stabilizing as institutional capital gradually enters the regulated space. Ethereum transaction volume would temporarily decrease by 20-25% during this transition period, as users reassess their positions and some exit to more privacy-focused chains. However, long-term price stability would benefit from reduced regulatory uncertainty and increased institutional participation.",
            url: "https://crypto.news/ethereum-to-discontinue-support-for-holesky-testnet-in-september/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/crypto-news.png",
            sourceSlug: "crypto_news_news",
            sourceName: "Crypto.news",
            author: "Darya Nassedkina",
            publishedAt: "2025-03-20T23:49:00Z",
            bookmarked: false,

            dataPoint: [1741233957824, 91775.07080936989],
        },
        {
            id: 197183,
            title: "Stablecoin Regulatory Framework",
            expectedPercentChange: -14.2,
            description:
                "Implementation of strict regulatory requirements for stablecoins, mandating full reserves, regular audits, and compliance with banking-style regulations. Major stablecoins like USDT and USDC, which currently account for approximately 40-50% of transaction volume on Ethereum, would face adjustment periods lasting 3-6 months. During this transition, stablecoin market caps might temporarily contract by 15-25% as issuers adjust reserves and liquidity. Smaller or non-compliant stablecoins representing about $15-20 billion in market cap would potentially exit the market or migrate to less regulated chains. Since stablecoin transactions constitute nearly half of Ethereum's gas usage, the reduced activity would lower network fees by 30-40%, potentially decreasing validator revenue by a similar percentage. While long-term regulatory clarity would eventually benefit the ecosystem, the immediate impact would be a significant reduction in network activity and demand for ETH as gas payment, affecting both price and staking yields.",
            url: "https://crypto.news/memecoins-will-end-up-worthless-says-ark-invest-ceo/",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/crypto-news.png",
            sourceSlug: "crypto_news_news",
            sourceName: "Crypto.news",
            author: "Trisha Husada",
            publishedAt: "2025-03-21T04:01:00Z",
            bookmarked: false,

            dataPoint: [1741239404177, 92496.58285405449],
        },
        {
            id: 197261,
            title: "ETH 2.0 Upgrade Phase Completion",
            expectedPercentChange: -10.8,
            description:
                "Successful completion of a major Ethereum 2.0 upgrade phase focusing on sharding implementation, which would divide the network into multiple parallel chains. This upgrade would significantly reduce transaction costs from the current average of $2-5 down to cents, while increasing throughput from approximately 15-30 transactions per second to potentially thousands. The improved scalability would make Ethereum viable for everyday microtransactions and high-frequency trading applications, attracting both retail users priced out by previous gas fees and enterprises requiring higher throughput for business operations. Market sentiment typically rallies around successful technical milestones, particularly those addressing Ethereum's most criticized limitation.",
            url: "https://www.coindesk.com/markets/2025/03/19/turkish-lira-crashes-to-record-low-spurring-volume-surge-in-binance-s-bitcoin-lira-pair",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/coindesk_news.png",
            sourceSlug: "coindesk_news",
            sourceName: "Coindesk",
            author: "Omkar Godbole",
            publishedAt: "2025-03-20T16:54:00Z",
            bookmarked: false,

            dataPoint: [1741213299449, 87150.48615154381],
        },
        {
            id: 197262,
            title: "Interoperability Protocol Launch",
            expectedPercentChange: 4.6,
            description:
                "Successful launch and rapid adoption of a protocol enabling seamless interoperability between Ethereum and other major blockchains, including Bitcoin, Solana, and Cosmos. This protocol would allow assets and data to flow between chains without centralized bridges, which have been frequent targets for exploits with over $2 billion lost in bridge hacks to date. Within the first six months, the protocol would secure cross-chain transactions exceeding $50 billion in total volume, with daily flows stabilizing around $500-700 million. This interoperability would position Ethereum as the central hub in a connected blockchain ecosystem due to its established liquidity and developer ecosystem. Approximately 30-40% of value currently isolated on alternative L1 blockchains would become accessible to Ethereum-based applications, expanding the total addressable market for Ethereum DeFi by an estimated $15-20 billion. The reduction in friction between blockchain ecosystems would particularly benefit Ethereum as the largest smart contract platform, reinforcing its network effects rather than diluting them.",
            url: "https://www.coindesk.com/daybook-us/2025/03/19/crypto-daybook-americas-memecoins-take-off-on-tron-while-bitcoin-looks-to-fomc",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/coindesk_news.png",
            sourceSlug: "coindesk_news",
            sourceName: "Coindesk",
            author: "Francisco Rodrigues, Shaurya Malwa",
            publishedAt: "2025-03-20T20:53:00Z",
            bookmarked: false,

            dataPoint: [1741224991917, 85360.60531197047],
        },
        {
            id: 197148,
            title: "Environmental Impact Resolution",
            expectedPercentChange: -11.4,
            description:
                "Ethereum network achieving and widely promoting carbon-negative status through a combination of continued efficiency improvements after the Merge and a coordinated carbon offset program. With Ethereum's energy usage already reduced by over 99.9% compared to its proof-of-work days, the network would partner with verified carbon capture projects to offset the remaining electricity consumption of validators. Independent verification would confirm that Ethereum consumes approximately 99.95% less energy than Bitcoin while processing roughly 30 times the transaction volume. This environmental credential would remove a significant ESG (Environmental, Social, and Governance) barrier for institutional investors, particularly European funds and endowments with strict sustainability mandates. Approximately $15-20 billion in institutional capital previously restricted from crypto investments would become eligible for allocation to Ethereum-based assets. Major corporations previously hesitant to build on Ethereum due to environmental concerns would announce development initiatives, including at least 3-5 Fortune 500 companies. The improved ESG profile would also reduce the risk of punitive environmental regulations that have been proposed for energy-intensive blockchain networks.",
            url: "https://decrypt.co/videos/interviews/y2rR8zoQ/under-exposed-ep17-macro-relief-rally-and-cryptos-political-divide",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/decrypt_news.jpg",
            sourceSlug: "decrypt_news",
            sourceName: "Decrypt",
            author: "",
            publishedAt: "2025-03-20T22:49:00Z",
            bookmarked: false,

            dataPoint: [1741230378341, 86833.40344858613],
        },
        {
            id: 197100,
            title: "Regulatory Clarity for DeFi Protocols",
            expectedPercentChange: -14.2,
            description:
                "Implementation of a comprehensive regulatory framework specifically addressing decentralized finance protocols built on Ethereum. Regulators would likely require enhanced KYC/AML procedures for front-end interfaces, effectively creating a two-tier DeFi ecosystem: compliant protocols accessible to retail and institutional users, and non-compliant protocols limited to users with technical knowledge to interact directly with smart contracts. Major DeFi protocols would face compliance costs estimated at $5-10 million each, with ongoing operational expenses reducing yields by approximately 15-25%. The TVL in compliant DeFi would initially drop by 30-40% before stabilizing as institutional capital gradually enters the regulated space. Ethereum transaction volume would temporarily decrease by 20-25% during this transition period, as users reassess their positions and some exit to more privacy-focused chains. However, long-term price stability would benefit from reduced regulatory uncertainty and increased institutional participation.",
            url: "https://cointelegraph.com/news/europol-ai-crypto-organized-crime-threat-report?utm_source=rss_feed&utm_medium=rss&utm_campaign=rss_partner_inbound",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/cointelegraph_news.jpg",
            sourceSlug: "cointelegraph_news",
            sourceName: "Cointelegraph",
            author: "Cointelegraph by Ezra Reguerra",
            publishedAt: "2025-03-21T01:49:00Z",
            bookmarked: false,

            dataPoint: [1741234857155, 86689.96098257162],
        },
        {
            id: 197149,
            title: "Stablecoin Regulatory Framework",
            expectedPercentChange: -14.2,
            description:
                "Implementation of strict regulatory requirements for stablecoins, mandating full reserves, regular audits, and compliance with banking-style regulations. Major stablecoins like USDT and USDC, which currently account for approximately 40-50% of transaction volume on Ethereum, would face adjustment periods lasting 3-6 months. During this transition, stablecoin market caps might temporarily contract by 15-25% as issuers adjust reserves and liquidity. Smaller or non-compliant stablecoins representing about $15-20 billion in market cap would potentially exit the market or migrate to less regulated chains. Since stablecoin transactions constitute nearly half of Ethereum's gas usage, the reduced activity would lower network fees by 30-40%, potentially decreasing validator revenue by a similar percentage. While long-term regulatory clarity would eventually benefit the ecosystem, the immediate impact would be a significant reduction in network activity and demand for ETH as gas payment, affecting both price and staking yields.",
            url: "https://decrypt.co/310578/notcoin-expands-telegram-not-games-platform",
            sourceIcon:
                "https://s3.eu-west-1.amazonaws.com/dev-zettaday.com/media/icons/sources/decrypt_news.jpg",
            sourceSlug: "decrypt_news",
            sourceName: "Decrypt",
            author: "Andrew Hayward",
            publishedAt: "2025-03-21T04:01:00Z",
            bookmarked: false,

            dataPoint: [1741239404177, 85496.58285405449],
        },
    ],
};

const transformRemoteCoin = (coin: TRemoteCoin): TCoin => {
    const price = coin.price ?? 0;
    return {
        id: coin.id,
        name: coin.name,
        ticker: coin.ticker,
        slug: coin.slug,
        icon: coin.icon,
        description: coin.description,
        pinned: coin.is_pinned,
        tags:
            coin.tags?.map((t) => ({
                ...t,
                tagType: t.tag_type,
            })) ?? [],
        rank: coin.rank,
        price,
        volume: coin.volume ?? 0,
        marketCap: coin.market_cap ?? 0,
        percentChange24h: coin.price_percent_change_24h ?? 0,
    };
};

const staticCoins: Record<string, TRemoteCoin> = {
    "0": {
        id: 1,
        name: "Bitcoin",
        ticker: "BTC",
        slug: "bitcoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
        project: {
            name: "Bitcoin",
            slug: "bitcoin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_bitcoin?w=48&h=48",
        },
        description:
            "Bitcoin (BTC) is a cryptocurrency launched in 2010. Users are able to generate BTC through the process of mining. Bitcoin has a current supply of 19,794,440. The last known price of Bitcoin is 100,893.56218115 USD and is up 2.98 over the last 24 hours. It is currently trading on 11835 active market(s) with $79,744,875,194.36 traded over the last 24 hours. More information can be found at https://bitcoin.org/.",
        price: 83760,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 1663866425862,
        volume: 22678683835.698063,
        price_percent_change_24h: 1.358975987936529,
        rank: 1,
        cmc_id: 1,
        is_pinned: false,
        tags: [],
    },
    "1": {
        id: 31,
        name: "Ethereum",
        ticker: "ETH",
        slug: "ethereum",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
        project: {
            name: "Ethereum",
            slug: "ethereum",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum?w=48&h=48",
        },
        description:
            "Ethereum (ETH) is a cryptocurrency . Ethereum has a current supply of 120,445,329.22953065. The last known price of Ethereum is 3,930.37215806 USD and is up 6.26 over the last 24 hours. It is currently trading on 9669 active market(s) with $36,590,724,284.63 traded over the last 24 hours. More information can be found at https://www.ethereum.org/.",
        price: 2022.55,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 244367898193,
        volume: 14366291827.735811,
        price_percent_change_24h: 6.80573476450904,
        rank: 2,
        cmc_id: 1027,
        is_pinned: false,
        tags: [],
    },
    "2": {
        id: 29,
        name: "Tether USDt",
        ticker: "USDT",
        slug: "tether",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
        project: {
            name: "Tether",
            slug: "tether",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_tether?w=48&h=48",
        },
        description:
            "Tether USDt (USDT) is a cryptocurrency and operates on the Ethereum platform. Tether USDt has a current supply of 142,193,635,647.06675024 with 139,742,488,654.32559471 in circulation. The last known price of Tether USDt is 0.99986595 USD and is down -0.06 over the last 24 hours. It is currently trading on 108038 active market(s) with $180,638,494,402.18 traded over the last 24 hours. More information can be found at https://tether.to.",
        price: 0.999868,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 143418835596,
        volume: 27191460886.92675,
        price_percent_change_24h: -0.00275757341396873,
        rank: 3,
        // gecko_id: "tether",
        cmc_id: 825,
        is_pinned: false,
        tags: [],
    },
    "3": {
        id: 6,
        name: "XRP",
        ticker: "XRP",
        slug: "xrp",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
        project: {
            name: "Ripple",
            slug: "xrp",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_xrp?w=48&h=48",
        },
        description:
            "XRP (XRP) is a cryptocurrency . XRP has a current supply of 99,986,904,872 with 57,117,231,849 in circulation. The last known price of XRP is 2.42558825 USD and is up 3.63 over the last 24 hours. It is currently trading on 1474 active market(s) with $12,753,795,746.50 traded over the last 24 hours. More information can be found at https://xrpl.org/.",
        price: 2.34,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 135898947545,
        volume: 3116958791.633866,
        price_percent_change_24h: 3.0753716996200997,
        rank: 4,
        // gecko_id: "ripple",
        cmc_id: 52,
        is_pinned: false,
        tags: [],
    },
    "4": {
        id: 89,
        name: "BNB",
        ticker: "BNB",
        slug: "bnb",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
        project: {
            name: "Binance",
            slug: "binancecoin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_binance?w=48&h=48",
        },
        description:
            "BNB (BNB) is a cryptocurrency . BNB has a current supply of 144,008,632.85. The last known price of BNB is 724.69300474 USD and is up 5.44 over the last 24 hours. It is currently trading on 2305 active market(s) with $2,410,889,198.96 traded over the last 24 hours. More information can be found at https://bnbchain.org/en.",
        price: 616.95,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 90105219899,
        volume: 1091595009.9722478,
        price_percent_change_24h: -2.395083023849215,
        rank: 5,
        // gecko_id: "binancecoin",
        cmc_id: 1839,
        is_pinned: false,
        tags: [],
    },
    "5": {
        id: 464,
        name: "Solana",
        ticker: "SOL",
        slug: "solana",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
        project: {
            name: "Solana",
            slug: "solana",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_solana?w=48&h=48",
        },
        description:
            "Solana (SOL) is a cryptocurrency launched in 2020. Solana has a current supply of 589,969,265.8029971 with 478,875,613.87371707 in circulation. The last known price of Solana is 232.46059892 USD and is up 4.81 over the last 24 hours. It is currently trading on 808 active market(s) with $5,139,898,261.61 traded over the last 24 hours. More information can be found at https://solana.com.",
        price: 128.63,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 65603027065,
        volume: 2544528066.413763,
        price_percent_change_24h: 4.1020668529609905,
        rank: 6,
        // gecko_id: "solana",
        cmc_id: 5426,
        is_pinned: false,
        tags: [],
    },
    "6": {
        id: 258,
        name: "USDC",
        ticker: "USDC",
        slug: "usd-coin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
        project: {
            name: "USD Coin",
            slug: "usd-coin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_usd-coin?w=48&h=48",
        },
        description:
            "USDC (USDC) is a cryptocurrency and operates on the Ethereum platform. USDC has a current supply of 41,526,903,849.9983605. The last known price of USDC is 0.9995044 USD and is down -0.06 over the last 24 hours. It is currently trading on 23763 active market(s) with $11,550,561,746.95 traded over the last 24 hours. More information can be found at https://www.usdc.com/.",
        price: 0.999854,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 58808017042,
        volume: 8525653434.886081,
        price_percent_change_24h: 0.004115437942133483,
        rank: 7,
        // gecko_id: "usd-coin",
        cmc_id: 3408,
        is_pinned: false,
        tags: [],
    },
    "7": {
        id: 8,
        name: "Dogecoin",
        ticker: "DOGE",
        slug: "dogecoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
        project: {
            name: "Doge",
            slug: "dogecoin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_doge?w=48&h=48",
        },
        description:
            "Dogecoin (DOGE) is a cryptocurrency . Users are able to generate DOGE through the process of mining. Dogecoin has a current supply of 147,167,556,383.7052. The last known price of Dogecoin is 0.41544389 USD and is up 4.51 over the last 24 hours. It is currently trading on 1126 active market(s) with $6,203,171,656.65 traded over the last 24 hours. More information can be found at http://dogecoin.com/.",
        price: 0.170655,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 25376127331,
        volume: 885905490.4618752,
        price_percent_change_24h: 2.464172765638683,
        rank: 8,
        // gecko_id: "dogecoin",
        cmc_id: 74,
        is_pinned: false,
        tags: [],
    },
    "8": {
        id: 106,
        name: "Cardano",
        ticker: "ADA",
        slug: "cardano",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
        project: {
            name: "Cardano",
            slug: "cardano",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_cardano?w=48&h=48",
        },
        description:
            "Cardano (ADA) is a cryptocurrency launched in 2017. Cardano has a current supply of 44,995,057,356.925724 with 35,112,728,715.277787 in circulation. The last known price of Cardano is 1.15680575 USD and is up 14.30 over the last 24 hours. It is currently trading on 1388 active market(s) with $2,426,434,509.72 traded over the last 24 hours. More information can be found at https://www.cardano.org.",
        price: 0.723234,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 26018451447,
        volume: 722299795.8234204,
        price_percent_change_24h: 2.9590946496659623,
        rank: 9,
        // gecko_id: "cardano",
        cmc_id: 2010,
        is_pinned: false,
        tags: [],
    },
    "9": {
        id: 101,
        name: "TRON",
        ticker: "TRX",
        slug: "tron",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
        project: {
            name: "Tron",
            slug: "tron",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_tron?w=48&h=48",
        },
        description:
            "TRON (TRX) is a cryptocurrency . TRON has a current supply of 86,252,453,207.273978 with 86,252,441,006.322698 in circulation. The last known price of TRON is 0.30094013 USD and is up 10.30 over the last 24 hours. It is currently trading on 1082 active market(s) with $1,684,777,624.96 traded over the last 24 hours. More information can be found at https://trondao.org/.",
        price: 0.230646,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 21911501409,
        volume: 1588995392.2015536,
        price_percent_change_24h: 2.657229459504969,
        rank: 11,
        // gecko_id: "tron",
        cmc_id: 1958,
        is_pinned: false,
        tags: [],
    },
    "10": {
        id: 104,
        name: "Chainlink",
        ticker: "LINK",
        slug: "chainlink",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
        project: {
            name: "Chainlink",
            slug: "chainlink",
            project_type: "protocol",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_chainlink?w=48&h=48",
        },
        description:
            "Chainlink (LINK) is a cryptocurrency and operates on the Ethereum platform. Chainlink has a current supply of 1,000,000,000 with 626,849,970.45278671 in circulation. The last known price of Chainlink is 28.38008634 USD and is up 25.40 over the last 24 hours. It is currently trading on 1897 active market(s) with $2,604,492,667.71 traded over the last 24 hours. More information can be found at https://chain.link/.",
        price: 14.42,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 9200227132,
        volume: 421623063.04589355,
        price_percent_change_24h: 5.090961594174986,
        rank: 11,
        // gecko_id: "chainlink",
        cmc_id: 1975,
        is_pinned: false,
        tags: [],
    },
    "11": {
        id: 287,
        name: "Wrapped Bitcoin",
        ticker: "WBTC",
        slug: "wrapped-bitcoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
        project: {
            name: "WBTC",
            slug: "wrapped-bitcoin",
            project_type: "protocol",
            network_id: 0,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
        },
        description:
            "Wrapped Bitcoin (WBTC) is a cryptocurrency and operates on the Ethereum platform. Wrapped Bitcoin has a current supply of 236,810.05951794. The last known price of Wrapped Bitcoin is 22,861.46118948 USD and is down -2.05 over the last 24 hours. It is currently trading on 489 active market(s) with $135,148,714.14 traded over the last 24 hours. More information can be found at https://wbtc.network.",
        price: 83741,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 10803109886,
        volume: 221038689.31928885,
        price_percent_change_24h: 1.584409701209175,
        rank: 12,
        // gecko_id: "wrapped-bitcoin",
        cmc_id: 3717,
        is_pinned: false,
        tags: [],
    },
    "12": {
        id: 1555,
        name: "Sui",
        ticker: "SUI",
        slug: "sui",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png",
        project: {
            name: "Sui",
            slug: "sui",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_sui?w=48&h=48",
        },
        description:
            "Sui (SUI) is a cryptocurrency . Sui has a current supply of 10,000,000,000 with 2,927,660,018.558888 in circulation. The last known price of Sui is 4.69078167 USD and is up 25.77 over the last 24 hours. It is currently trading on 456 active market(s) with $3,805,351,064.08 traded over the last 24 hours. More information can be found at https://sui.io/#.",
        price: 2.36,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 7476086614,
        volume: 607757838.2236912,
        price_percent_change_24h: 4.142643289134332,
        rank: 15,
        // gecko_id: "sui",
        cmc_id: 20947,
        is_pinned: false,
        tags: [],
    },
    "13": {
        id: 508,
        name: "Avalanche",
        ticker: "AVAX",
        slug: "avalanche",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
        project: {
            name: "Avalanche",
            slug: "avalanche-2",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche?w=48&h=48",
        },
        description:
            "Avalanche (AVAX) is a cryptocurrency launched in 2020. Avalanche has a current supply of 448,021,532.92230654 with 409,685,232.92230654 in circulation. The last known price of Avalanche is 51.10255128 USD and is up 13.94 over the last 24 hours. It is currently trading on 818 active market(s) with $967,466,979.13 traded over the last 24 hours. More information can be found at https://avax.network/.",
        price: 19.53,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 8098859284,
        volume: 284262747.90915495,
        price_percent_change_24h: 4.003713873260157,
        rank: 16,
        // gecko_id: "avalanche-2",
        cmc_id: 5805,
        is_pinned: false,
        tags: [],
    },
    "14": {
        id: 530,
        name: "Shiba Inu",
        ticker: "SHIB",
        slug: "shiba-inu",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
        project: {
            name: "Shiba Inu",
            slug: "shiba-inu",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_shiba-inu?w=48&h=48",
        },
        description:
            "Shiba Inu (SHIB) is a cryptocurrency and operates on the Ethereum platform. Shiba Inu has a current supply of 589,508,593,499,298.22321552 with 589,255,623,215,219.46713346 in circulation. The last known price of Shiba Inu is 0.00002909 USD and is up 6.03 over the last 24 hours. It is currently trading on 917 active market(s) with $1,439,288,162.34 traded over the last 24 hours. More information can be found at https://shibatoken.com/.",
        price: 0.0000128,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 7540145021,
        volume: 141363414.8799337,
        price_percent_change_24h: 2.317345676364191,
        rank: 17,
        // gecko_id: "shiba-inu",
        cmc_id: 5994,
        is_pinned: false,
        tags: [],
    },
    "15": {
        id: 23,
        name: "Stellar",
        ticker: "XLM",
        slug: "stellar",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/512.png",
        project: {
            name: "Stellar",
            slug: "stellar",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_stellar?w=48&h=48",
        },
        description:
            "Stellar (XLM) is a cryptocurrency . Stellar has a current supply of 50,001,786,911.162926 with 30,171,794,629.650215 in circulation. The last known price of Stellar is 0.43749917 USD and is up 6.12 over the last 24 hours. It is currently trading on 648 active market(s) with $1,057,163,449.05 traded over the last 24 hours. More information can be found at https://www.stellar.org.",
        price: 0.285364,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 8771392361,
        volume: 250932804.25642076,
        price_percent_change_24h: 6.380739042808221,
        rank: 17,
        // gecko_id: "stellar",
        cmc_id: 512,
        is_pinned: false,
        tags: [],
    },
    "16": {
        id: 2,
        name: "Litecoin",
        ticker: "LTC",
        slug: "litecoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
        project: {
            name: "Coti",
            slug: "coti",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_coti?w=48&h=48",
        },
        description:
            "Litecoin (LTC) is a cryptocurrency . Users are able to generate LTC through the process of mining. Litecoin has a current supply of 84,000,000 with 75,296,649.55410936 in circulation. The last known price of Litecoin is 121.64264773 USD and is up 9.32 over the last 24 hours. It is currently trading on 1285 active market(s) with $1,195,312,270.36 traded over the last 24 hours. More information can be found at https://litecoin.org/.",
        price: 91.43,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 6916020543,
        volume: 490549987.6865198,
        price_percent_change_24h: 3.1080289064371973,
        rank: 18,
        // gecko_id: "litecoin",
        cmc_id: 2,
        is_pinned: false,
        tags: [],
    },
    "17": {
        id: 329,
        name: "UNUS SED LEO",
        ticker: "LEO",
        slug: "unus-sed-leo",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3957.png",
        project: {
            name: "UNUS SED LEO",
            slug: "unus-sed-leo",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_unus-sed-leo?w=48&h=48",
        },
        description:
            "UNUS SED LEO (LEO) is a cryptocurrency and operates on the Ethereum platform. UNUS SED LEO has a current supply of 985,239,504 with 924,538,871.9 in circulation. The last known price of UNUS SED LEO is 9.59010441 USD and is up 6.06 over the last 24 hours. It is currently trading on 53 active market(s) with $633,731.09 traded over the last 24 hours. More information can be found at https://www.bitfinex.com/.",
        price: 9.79,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 9046035500,
        volume: 3054657.1604435365,
        price_percent_change_24h: 0.3102307922211505,
        rank: 18,
        // gecko_id: "leo-token",
        cmc_id: 3957,
        is_pinned: false,
        tags: [],
    },
    "18": {
        id: 921,
        name: "Toncoin",
        ticker: "TON",
        slug: "toncoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
        project: {
            name: "Toncoin",
            slug: "toncoin",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_toncoin?w=48&h=48",
        },
        description:
            "Toncoin (TON) is a cryptocurrency . Toncoin has a current supply of 5,117,225,623.38481374 with 2,550,915,002.21406881 in circulation. The last known price of Toncoin is 6.42349207 USD and is up 5.61 over the last 24 hours. It is currently trading on 634 active market(s) with $313,664,837.67 traded over the last 24 hours. More information can be found at https://ton.org/.",
        price: 3.59,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 8917689711,
        volume: 349595292.63158417,
        price_percent_change_24h: 1.7507130080452786,
        rank: 19,
        // gecko_id: "the-open-network",
        cmc_id: 11419,
        is_pinned: false,
        tags: [],
    },
    "19": {
        id: 386,
        name: "Hedera",
        ticker: "HBAR",
        slug: "hedera",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png",
        project: {
            name: "Hedera",
            slug: "hedera-hashgraph",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_hedera?w=48&h=48",
        },
        description:
            "Hedera (HBAR) is a cryptocurrency launched in 2017. Hedera has a current supply of 50,000,000,000 with 38,228,257,945.3993163 in circulation. The last known price of Hedera is 0.30201521 USD and is up 6.68 over the last 24 hours. It is currently trading on 296 active market(s) with $1,512,268,478.94 traded over the last 24 hours. More information can be found at https://www.hedera.com/.",
        price: 0.192269,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 8118449176,
        volume: 195808786.70017427,
        price_percent_change_24h: 3.6118077564198368,
        rank: 22,
        // gecko_id: "hedera-hashgraph",
        cmc_id: 4642,
        is_pinned: false,
        tags: [],
    },
    "20": {
        id: 2480,
        name: "Hyperliquid",
        ticker: "HYPE",
        slug: "hyperliquid",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/32196.png",
        project: {
            name: "Hyperliquid",
            slug: "hyperliquid",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_hyperliquid?w=48&h=48",
        },
        description:
            "Hyperliquid (HYPE) is a cryptocurrency . Hyperliquid has a current supply of 999,993,930 with 270,908,567 in circulation. The last known price of Hyperliquid is 17.94890438 USD and is up 31.44 over the last 24 hours. It is currently trading on 9 active market(s) with $226,599,605.94 traded over the last 24 hours. More information can be found at https://hyperliquid.xyz/.",
        price: 14.91,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 4977122800,
        volume: 88106585.23288943,
        price_percent_change_24h: 12.618555701079359,
        rank: 22,
        // gecko_id: "hyperliquid",
        cmc_id: 32196,
        is_pinned: false,
        tags: [],
    },
    "21": {
        id: 1942,
        name: "Ethena USDe",
        ticker: "USDe",
        slug: "ethena-usde",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/29470.png",
        project: {
            name: "Ethena USDe",
            slug: "ethena-usde",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_ethena-usde?w=48&h=48",
        },
        description:
            "Ethena USDe (USDe) is a cryptocurrency and operates on the Ethereum platform. Ethena USDe has a current supply of 5,641,054,546.12639334. The last known price of Ethena USDe is 1.00146212 USD and is down -0.02 over the last 24 hours. It is currently trading on 95 active market(s) with $165,438,148.56 traded over the last 24 hours. More information can be found at https://www.ethena.fi/.",
        price: 0.999348,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 5409287858,
        volume: 57082949.531454444,
        price_percent_change_24h: -0.02877866574864365,
        rank: 23,
        // gecko_id: "ethena-usde",
        cmc_id: 29470,
        is_pinned: false,
        tags: [],
    },
    "23": {
        id: 546,
        name: "MANTRA DAO",
        ticker: "OM",
        slug: "mantra-dao",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6536.png",
        project: {
            name: "MANTRA DAO",
            slug: "mantra-dao",
            project_type: "protocol",
            network_id: 0,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6536.png",
        },
        description:
            "MANTRA DAO (OM) is a cryptocurrency and operates on the Ethereum platform. MANTRA DAO has a current supply of 888,888,888 with 498,064,331.17812485 in circulation. The last known price of MANTRA DAO is 0.05461904 USD and is down -1.84 over the last 24 hours. It is currently trading on 49 active market(s) with $1,933,496.53 traded over the last 24 hours. More information can be found at https://mantradao.com/.",
        price: 6.9,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 6790569653,
        volume: 182161832.7782313,
        price_percent_change_24h: -1.877672079749752,
        rank: 24,
        // gecko_id: "mantra-dao",
        cmc_id: 6536,
        is_pinned: false,
        tags: [],
    },
    "24": {
        id: 1927,
        name: "Dai",
        ticker: "DAI",
        slug: "multi-collateral-dai",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
        project: {
            name: "Multi-Collateral Dai",
            slug: "multi-collateral-dai",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_multi-collateral-dai?w=48&h=48",
        },
        description:
            "Dai (DAI) is a cryptocurrency and operates on the Ethereum platform. Dai has a current supply of 5,365,382,702.664872. The last known price of Dai is 1.00009064 USD and is up 0.02 over the last 24 hours. It is currently trading on 3422 active market(s) with $124,562,335.54 traded over the last 24 hours. More information can be found at https://makerdao.com/.",
        price: 1,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 5365382702,
        volume: 124562335,
        price_percent_change_24h: 0.02,
        rank: 25,
        // gecko_id: "multi-collateral-dai",
        cmc_id: 4943,
        is_pinned: false,
        tags: [],
    },
    "25": {
        id: 1413,
        name: "Bitget Token",
        ticker: "BGB",
        slug: "bitget-token-new",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/11092.png",
        project: {
            name: "Bitget Token",
            slug: "bitget-token",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_bitget-token?w=48&h=48",
        },
        description:
            "Bitget Token (BGB) is a cryptocurrency and operates on the Ethereum platform. Bitget Token has a current supply of 2,000,000,000 with 1,400,000,000 in circulation. The last known price of Bitget Token is 3.42102732 USD and is up 11.54 over the last 24 hours. It is currently trading on 22 active market(s) with $374,047,694.98 traded over the last 24 hours. More information can be found at https://www.bitget.com/.",
        price: 4.77,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 5718965460,
        volume: 254682559.3437439,
        price_percent_change_24h: 6.465543310413942,
        rank: 26,
        // gecko_id: "bitget-token",
        cmc_id: 11092,
        is_pinned: false,
        tags: [],
    },
    "26": {
        id: 550,
        name: "Polkadot",
        ticker: "DOT",
        slug: "polkadot-new",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png",
        project: {
            name: "Polkadot",
            slug: "polkadot",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_polkadot?w=48&h=48",
        },
        description:
            "Polkadot (DOT) is a cryptocurrency . Polkadot has a current supply of 1,527,846,383.692722. The last known price of Polkadot is 9.26602764 USD and is up 8.99 over the last 24 hours. It is currently trading on 850 active market(s) with $1,029,860,460.46 traded over the last 24 hours. More information can be found at https://polkadot.com.",
        price: 4.53,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 6892599196,
        volume: 211321142.4443521,
        price_percent_change_24h: 6.32936340316355,
        rank: 26,
        // gecko_id: "polkadot",
        cmc_id: 6636,
        is_pinned: false,
        tags: [],
    },
    "28": {
        id: 18,
        name: "Monero",
        ticker: "XMR",
        slug: "monero",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/328.png",
        project: {
            name: "Monero",
            slug: "monero",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_monero?w=48&h=48",
        },
        description:
            "Monero (XMR) is a cryptocurrency . Users are able to generate XMR through the process of mining. Monero has a current supply of 18,446,744.07370955. The last known price of Monero is 197.2923388 USD and is up 6.12 over the last 24 hours. It is currently trading on 304 active market(s) with $136,092,872.30 traded over the last 24 hours. More information can be found at https://www.getmonero.org/.",
        price: 209.11,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 3855359409,
        volume: 51699973.44362913,
        price_percent_change_24h: -0.17287449975291863,
        rank: 28,
        // gecko_id: "monero",
        cmc_id: 328,
        is_pinned: false,
        tags: [],
    },
    "29": {
        id: 88,
        name: "Bitcoin Cash",
        ticker: "BCH",
        slug: "bitcoin-cash",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png",
        project: {
            name: "Bitcoincash",
            slug: "bitcoin-cash",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_bitcoincash?w=48&h=48",
        },
        description:
            "Bitcoin Cash (BCH) is a cryptocurrency . Users are able to generate BCH through the process of mining. Bitcoin Cash has a current supply of 19,800,812.5. The last known price of Bitcoin Cash is 554.97771198 USD and is up 5.31 over the last 24 hours. It is currently trading on 956 active market(s) with $624,593,910.39 traded over the last 24 hours. More information can be found at http://bch.info.",
        price: 339.6,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 6735874779,
        volume: 169488744.70251307,
        price_percent_change_24h: 0.6660871074772053,
        rank: 29,
        // gecko_id: "bitcoin-cash",
        cmc_id: 1831,
        is_pinned: false,
        tags: [],
    },
    "30": {
        id: 1559,
        name: "Pepe",
        ticker: "PEPE",
        slug: "pepe",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png",
        project: {
            name: "Pepe",
            slug: "pepe",
            project_type: "chain",
            network_id: 0,
            icon: "https://icons.llamao.fi/icons/chains/rsz_pepe?w=48&h=48",
        },
        description:
            "Pepe (PEPE) is a cryptocurrency launched in 2023and operates on the Ethereum platform. Pepe has a current supply of 420,689,899,999,994.7931. The last known price of Pepe is 0.0000248 USD and is up 5.81 over the last 24 hours. It is currently trading on 486 active market(s) with $4,295,495,065.10 traded over the last 24 hours. More information can be found at https://www.pepe.vip/.",
        price: 0.00000749,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 3149821923,
        volume: 763836682.3971452,
        price_percent_change_24h: 9.076214387850783,
        rank: 30,
        // gecko_id: "pepe",
        cmc_id: 24478,
        is_pinned: false,
        tags: [],
    },
    "31": {
        id: 597,
        name: "Uniswap",
        ticker: "UNI",
        slug: "uniswap",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
        project: {
            name: "Uniswap",
            slug: "uniswap",
            project_type: "protocol",
            network_id: 0,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
        },
        description:
            "Uniswap (UNI) is a cryptocurrency launched in 2020and operates on the Ethereum platform. Uniswap has a current supply of 1,000,000,000 with 600,483,073.71 in circulation. The last known price of Uniswap is 18.50705266 USD and is up 18.85 over the last 24 hours. It is currently trading on 1142 active market(s) with $1,027,136,881.16 traded over the last 24 hours. More information can be found at https://uniswap.org/blog/uni/.",
        price: 6.62,
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        market_cap: 3972197066,
        volume: 153839858.9651453,
        price_percent_change_24h: 6.764885946167077,
        rank: 32,
        // gecko_id: "uniswap",
        cmc_id: 7083,
        is_pinned: false,
        tags: [],
    },
};

const widgetConfig = CONFIG.WIDGETS.KASANDRA_PREDICTIONS;
const KasandraTimelineContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(userStore.selectIsAuthenticated);
    const { selectedView } = useView();

    // TODO(xavier-charles): update this once backend is ready
    const kasandraModuleDataHash = useMemo(() => {
        const widgetData = selectedView?.data.widgets.find(
            (w) => w.widget.template.slug === "news_template"
        );
        if (widgetData) return widgetData.hash.replace("0", "x");
        return undefined;
    }, [selectedView?.data.widgets]);

    const prevSelectedMarketData = useAppSelector(
        (state) =>
            state.widgets.market?.[kasandraModuleDataHash || moduleData.hash]
    );

    const selectedDataPoint = useAppSelector(
        (state) =>
            state.widgets.kasandra?.[kasandraModuleDataHash || moduleData.hash]
                ?.selectedDataPoint
    );

    const widgetHeight = useWidgetHeight(moduleData);

    // const [currentPage, setCurrentPage] = useState<number | undefined>(
    //     undefined
    // );

    const defaultFeed = widgetConfig.DEFAULT_FEED_PREFERENCE;

    const feedPreference =
        useAppSelector(selectKasandraFeedPreference(moduleData.hash)) ??
        defaultFeed;

    const setFeedPreference = useCallback(
        (preference: EItemFeedPreference) => {
            dispatch(
                setKasandraFeedPreference({
                    widgetHash: moduleData.hash,
                    preference,
                })
            );
        },
        [dispatch, moduleData.hash]
    );

    const [items, setItems] = useState<TKasandraItem[] | undefined>();

    const tagsSettings = moduleData.settings.filter(
        (s) =>
            s.widget_setting.setting.slug ===
            EWidgetSettingsRegistry.IncludedTags
    );

    const tagsRef = useRef<TBaseTag[]>();

    const tags =
        tagsSettings[0] !== undefined ? tagsSettings[0].tags : undefined;

    // TODO(xavier-charles): remove this once backend is ready
    const coinsDataResponse = useMemo(
        () => ({
            results: Object.values(staticCoins).map((remoteCoin) =>
                transformRemoteCoin(remoteCoin)
            ),
        }),
        []
    );

    const coinsData = useMemo(
        () => coinsDataResponse?.results ?? [],
        [coinsDataResponse]
    );

    const { data: pinnedCoinsData } = useGetPinnedCoinsQuery();
    const pinnedCoins = useMemo(
        () => pinnedCoinsData?.results || [],
        [pinnedCoinsData]
    );

    const selectedChartRange = useMemo(
        () =>
            prevSelectedMarketData?.selectedChartRange ||
            CONFIG.WIDGETS.MARKET.DEFAULT_INTERVAL,
        [prevSelectedMarketData?.selectedChartRange]
    );

    const selectedMarket: TCoin | undefined = useMemo(() => {
        const storedMarket = [...pinnedCoins, ...coinsData].find(
            (c) => c.id === prevSelectedMarketData?.selectedMarket?.id
        );
        return storedMarket ?? pinnedCoins[0] ?? coinsData[0] ?? undefined;
    }, [prevSelectedMarketData?.selectedMarket, coinsData, pinnedCoins]);

    const { data: predictions, isFetching: isLoadingPredictions } =
        useGetPredictionsQuery(
            {
                coin: selectedMarket?.id,
                // TODO: SOmething is wromg with selectedChartRange RTK query is not reading it as the same in KasandraContainer and KasandraTimelineContainer
                interval: selectedChartRange,
                // interval: "1D",
                // limit: CONFIG.WIDGETS.KASANDRA.PREDICTIONS_LIMIT,
                limit: 300,
            },
            {
                pollingInterval:
                    CONFIG.WIDGETS.MARKET.HISTORY_POLLING_INTERVAL * 1000,
                skip: selectedMarket === undefined,
            }
        );

    const itemsData = mockItemsResponse;
    const isSuccess = true;

    const [openItemMut] = useOpenNewsItemMutation();
    const [bookmarkItemMut] = useBookmarkNewsItemMutation();

    const onOpenItem = async (id: number) => {
        if (openItemMut !== undefined) {
            await openItemMut({
                id,
            });
        }
    };

    const onBookmarkItem = useCallback(
        (item: TKasandraItem) => {
            if (bookmarkItemMut !== undefined) {
                if (!isAuthenticated) {
                    toast(
                        globalMessages.callToAction.signUpToBookmark("items")
                    );
                    return;
                }
                bookmarkItemMut({ item })
                    .unwrap()
                    .then(() => {
                        toast("Your preference has been saved successfully.");
                        /**
                         * When a user bookmarks an item, we need to update the list of items
                         * to reflect the change. We do this by updating the list of items
                         */
                        setItems((prevItems) => {
                            if (!prevItems) {
                                /**
                                 * Prev items should never be undefined, but we need to handle this case
                                 */
                                Logger.error(
                                    "KasandraTimelineContainer::onBookmarkNewsItem: prevItems is undefined, this should not happen for news",
                                    item.id
                                );
                                return prevItems;
                            }
                            /**
                             * If the current feedPreference is not bookmarked items, then we need to toggle its bookmark status
                             * else we need to remove it from the list
                             */
                            if (
                                feedPreference !== EItemFeedPreference.Bookmark
                            ) {
                                const bookmarkPos = prevItems.indexOf(item);
                                if (bookmarkPos === -1) {
                                    /**
                                     * Bookmarked item should be in the list of items, but we need to handle this case
                                     */
                                    Logger.error(
                                        "KasandraTimelineContainer::onBookmarkNewsItem: news item is not in prevItems, this should not happen for news",
                                        item.id
                                    );
                                    return prevItems;
                                }
                                const newItems = [...prevItems];
                                newItems[bookmarkPos] = {
                                    ...item,
                                    bookmarked: !item.bookmarked,
                                };
                                return newItems;
                            }
                            // removing from the list ensures bookmarked items only are shown in the list
                            return prevItems.filter((i) => i.id !== item.id);
                        });
                    })
                    .catch(() =>
                        toast(
                            "We could not save your preference. Please try again"
                        )
                    );
            }
        },
        [bookmarkItemMut, feedPreference, isAuthenticated]
    );

    const handleSelectedDataPoint = useCallback(
        (dataPoint: [number, number]) => {
            dispatch(
                setKasandraSelectedDataPoint({
                    widgetHash: kasandraModuleDataHash || moduleData.hash,
                    dataPoint,
                })
            );
        },
        [dispatch, kasandraModuleDataHash, moduleData.hash]
    );

    // reset results when tags preferences changed
    useEffect(() => {
        /**
         * To ensure that the items are not duplicated, we need to check if the
         * new tags are different from the previous ones. If they are, we need to
         * reset the items and the current page.
         *
         * We use a ref to store the previous tags, because we don't want to
         * trigger a re-render when the tags change. And assigning a default
         * value when tagsRef.current is undefined ensures that the first
         * comparison will always be true.
         */
        if (tags && !itemListsAreEqual(tagsRef.current || [], tags)) {
            setItems(undefined);
            // setCurrentPage(undefined);
        }
        tagsRef.current = tags;
    }, [tags]);

    useEffect(() => {
        if (
            !isAuthenticated &&
            feedPreference === EItemFeedPreference.Bookmark
        ) {
            setFeedPreference(EItemFeedPreference.Last);
        }
        // we do not want to track `setFeedPreference`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedPreference, isAuthenticated]);

    // reset results when feed preference changes
    useEffect(() => {
        setItems(undefined);
        // setCurrentPage(undefined);
    }, [feedPreference]);

    useEffect(() => {
        const data = itemsData?.results;
        if (data !== undefined) {
            setItems((prevItems) => {
                if (prevItems) {
                    const newItems = buildUniqueItemList([
                        ...prevItems,
                        ...data,
                    ]);

                    return newItems;
                }
                return data;
            });
        }
    }, [itemsData?.results]);

    const { nextPage, handleNextPage } = usePagination(
        itemsData?.links,
        widgetConfig.MAX_PAGE_NUMBER,
        isSuccess
    );

    // set current page 350ms after next page is set.
    // RTK should cache requests, so we don't need to be too careful about rerenders.
    useEffect(() => {
        if (nextPage === undefined) {
            return () => null;
        }
        const timeout = setTimeout(() => {
            // setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    if (feedPreference !== undefined) {
        return (
            <KasandraTimelineModule
                isLoadingItems={isLoadingPredictions}
                // we default items to newsData?.results to avoid a flickering/infinite loading
                items={
                    (items || itemsData?.results) as TKasandraItem[] | undefined
                }
                selectedPredictions={predictions}
                handlePaginate={handleNextPage}
                feedPreference={feedPreference}
                onSetFeedPreference={setFeedPreference}
                widgetHeight={widgetHeight}
                onClick={onOpenItem}
                onBookmark={onBookmarkItem}
                isAuthenticated={isAuthenticated}
                selectedDataPoint={selectedDataPoint}
                onSelectDataPoint={handleSelectedDataPoint}
            />
        );
    }
    return null;
};

export default KasandraTimelineContainer;
