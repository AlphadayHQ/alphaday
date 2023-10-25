const getRandomTvl = () => Math.random() * 1_000_000_000 + 100_000_000;
const getRandomTvlInEth = () => Math.random() * 1_000_000 + 100_000;

export const dummyTvlHistory = [
    {
        date: "2022-01-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-02-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-03-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-04-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-05-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-06-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-07-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-08-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-09-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-10-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-11-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
    {
        date: "2022-12-01",
        tvl_usd: getRandomTvl(),
        tvl_eth: getRandomTvlInEth(),
    },
];
