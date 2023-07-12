const data = {
    options: {
        chart: {
            sparkline: {
                enabled: true,
            },
        },
        labels: ["ETH", "MKR", "AAVE", "USDT", "SHIB", "LINK"],
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "55%",
                },
            },
        },
        legend: {
            show: false,
        },
        colors: [
            "#434871",
            "#19aa9b",
            "#B6509E",
            "#2ea07b",
            "#ffa500",
            "#375BD2",
        ],
    },
    series: [35, 10, 10, 16, 5, 24],
};

export default data;
