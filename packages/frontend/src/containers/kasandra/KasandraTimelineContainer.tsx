import { FC, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePagination, useView, useWidgetHeight } from "src/api/hooks";
import {
    TBaseTag,
    useBookmarkNewsItemMutation,
    useOpenNewsItemMutation,
} from "src/api/services";
import {
    setKasandraFeedPreference,
    selectKasandraFeedPreference,
    setKasandraSelectedDataPoint,
} from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import * as userStore from "src/api/store/slices/user";
import { TKasandraItem, EItemFeedPreference } from "src/api/types";
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

    const selectedDataPoint = useAppSelector(
        (state) =>
            state.widgets.kasandra?.[kasandraModuleDataHash || moduleData.hash]
                ?.selectedDataPoint
    );

    const widgetHeight = useWidgetHeight(moduleData);

    const [currentPage, setCurrentPage] = useState<number | undefined>(
        undefined
    );

    // TODO(xavier-charles): remove this once backend is ready
    Logger.info("KasandraTimelineContainer::currentPage", currentPage);

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

    // const pollingInterval =
    //     (moduleData.widget.refresh_interval || widgetConfig.POLLING_INTERVAL) *
    //     1000;

    // const queryParameters = {
    //     page: currentPage,
    //     tags: tags ? filterUtils.filteringListToStr(tags) : undefined,
    //     feedPreference,
    // };

    // TODO(xavier-charles): refactor to use the new api
    // const {
    //     currentData: itemsData,
    //     isLoading,
    //     isSuccess,
    // } = useGetNewsListQuery(queryParameters, {
    //     pollingInterval,
    // });

    const itemsData = mockItemsResponse;
    const isLoading = false;
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
            setCurrentPage(undefined);
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
        setCurrentPage(undefined);
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
            setCurrentPage(nextPage);
        }, 350);
        return () => {
            clearTimeout(timeout);
        };
    }, [nextPage]);

    if (feedPreference !== undefined) {
        return (
            <KasandraTimelineModule
                isLoadingItems={isLoading}
                // we default items to newsData?.results to avoid a flickering/infinite loading
                items={
                    (items || itemsData?.results) as TKasandraItem[] | undefined
                }
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
