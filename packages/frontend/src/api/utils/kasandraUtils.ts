import {
    EPredictionCase,
    TPredictions,
    TPredictionCoin,
    TPredictionItem,
    TInsightSource,
} from "../types";
import { TChartRange } from "../types/market";
import { Logger } from "./logging";

/**
 * Truncates time series data based on a specified chart range.
 *
 * @param data - Array of [timestamp, value] pairs
 * @param range - Chart range to truncate to
 * @returns Truncated data array
 */
export function truncateDataByChartRange(
    data: number[][],
    range: TChartRange
): number[][] {
    // Handle empty data case
    if (data.length === 0) {
        return [];
    }

    // If "ALL" range, return all data
    if (range === "ALL" || range === "YTD") {
        return data;
    }

    // Get current timestamp
    const now = Date.now();
    const date = new Date(now);

    // Calculate cutoff timestamp based on range
    let cutoffTimestamp: number;

    switch (range) {
        case "1D":
            cutoffTimestamp = now + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            break;
        case "1W":
            cutoffTimestamp = now + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
            break;
        case "1M": {
            date.setMonth(date.getMonth() + 1);
            cutoffTimestamp = date.getTime();
            break;
        }
        case "3M": {
            date.setMonth(date.getMonth() + 3);
            cutoffTimestamp = date.getTime();
            break;
        }
        // case "YTD": {
        //     // Start of the current year
        //     const startOfYear = new Date(
        //         new Date().getFullYear(),
        //         0,
        //         1
        //     ).getTime();
        //     cutoffTimestamp = startOfYear;
        //     break;
        // }
        case "1Y": {
            date.setFullYear(date.getFullYear() + 1);
            cutoffTimestamp = date.getTime();
            break;
        }
        case "3Y": {
            date.setFullYear(date.getFullYear() + 3);
            cutoffTimestamp = date.getTime();
            break;
        }
        default:
            return data; // If range not recognized, return all data
    }

    Logger.debug(
        `PREDICTION DATA CUTOFF TIMESTAMP FOR ${range} => ${cutoffTimestamp}`
    );

    // Filter data to include only points on or after the cutoff timestamp
    return data.filter(([timestamp]) => timestamp <= cutoffTimestamp);
}

export const fetchTestPredictions = (
    coin: string,
    interval: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (data: any | undefined) => void
) => {
    let timeframe = "30d";
    if (interval === "1D") {
        timeframe = "1d";
    } else if (interval === "1W") {
        timeframe = "7d";
    }
    fetch(
        `https://vokocnrsbwutyybhaiip.supabase.co/functions/v1/get-predictions?symbol=${coin}&timeframe=${timeframe}`
    )
        .then(async (response) => {
            await response.json().then((data) => {
                callback(data);
            });
        })
        .catch((error) => {
            Logger.error("Error fetching test predictions:", error);
            callback(undefined);
        });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertToPredictions = (rawData: any): TPredictions => {
    const prediction = rawData.predictions;
    const predictionData = prediction.prediction_data;
    const metaData = prediction.meta_data;
    const currentPrice = metaData.current_price;

    Logger.debug("testPredictions =>", predictionData);

    // Create coin object from the available data
    const coin: TPredictionCoin = {
        id: metaData.crypto.id,
        name: metaData.coin_id,
        ticker: metaData.coin_id,
        slug: metaData.coin_id,
        icon: "", // Not provided in the source data
    };

    // Helper function to calculate percentage change from current price
    const calculatePercentChange = (
        price: number,
        _currentPrice: number
    ): number => {
        return ((price - _currentPrice) / _currentPrice) * 100;
    };

    // Convert each scenario to TPredictionData format
    const { neutral, optimistic, pessimistic } = predictionData;

    const result: TPredictions = {
        [EPredictionCase.BASELINE]: {
            id: Number(prediction.id || 0) + 1,
            coin,
            case: EPredictionCase.BASELINE,
            interval: prediction.timeframe as TChartRange,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: neutral.chart_data.map((item: any) => ({
                price: item.price,
                pricePercentChange: calculatePercentChange(
                    item.price,
                    currentPrice
                ),
                timestamp: item.timestamp,
            })),
            created: prediction.created_at,
        },
        [EPredictionCase.OPTIMISTIC]: {
            id: Number(prediction.id || 0) + 2,
            coin,
            case: EPredictionCase.OPTIMISTIC,
            interval: predictionData.timeframe as TChartRange,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: optimistic.chart_data.map((item: any) => ({
                price: item.price,
                pricePercentChange: calculatePercentChange(
                    item.price,
                    currentPrice
                ),
                timestamp: item.timestamp,
            })),
            created: prediction.created_at,
        },
        [EPredictionCase.PESSIMISTIC]: {
            id: Number(prediction.id || 0) + 3,
            coin,
            case: EPredictionCase.PESSIMISTIC,
            interval: predictionData.timeframe as TChartRange,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: pessimistic.chart_data.map((item: any) => ({
                price: item.price,
                pricePercentChange: calculatePercentChange(
                    item.price,
                    currentPrice
                ),
                timestamp: item.timestamp,
            })),
            created: prediction.created_at,
        },
    };

    return result;
};

export const convertToPredictionItems = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawData: any
): TPredictionItem[] => {
    const prediction = rawData?.predictions;
    const predictionData = prediction?.prediction_data;

    if (!predictionData?.insights) {
        return [];
    }

    const { insights } = predictionData;

    // Create coin object
    const coin: TPredictionCoin = {
        id: prediction.crypto_id,
        name: prediction.cryptocurrencies.name,
        ticker: prediction.cryptocurrencies.symbol,
        slug: prediction.cryptocurrencies.symbol
            .toLowerCase()
            .replace(/\s+/g, "-"),
        icon: "", // Not provided in source data
    };

    // Helper function to create insight source
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createInsightSource = (insight: any): TInsightSource => ({
        url: insight.sourceURL,
        title: insight.title,
        name: insight.sourceName,
        icon: "", // Not provided in source data
        slug: insight.sourceName
            .replace(/\./g, "-")
            .replace(/[^a-zA-Z0-9-]/g, ""),
    });

    // Helper function to map scenario names
    const mapScenarioToCase = (scenario: string): string => {
        switch (scenario) {
            case "neutral":
                return "baseline";
            case "optimistic":
                return "optimistic";
            case "pessimistic":
                return "pessimistic";
            default:
                return scenario;
        }
    };

    const items: TPredictionItem[] = [];
    let itemIdCounter = 1;

    // Process each scenario and its insights
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(insights as Record<string, any[]>).forEach(
        ([scenario, insightArray]) => {
            insightArray.forEach((insight) => {
                const item: TPredictionItem = {
                    id: prediction.id * 1000 + itemIdCounter, // Create unique ID
                    coin,
                    price: insight.price,
                    pricePercentChange:
                        insight.percentage_change_from_current_price,
                    insight: {
                        title: insight.title,
                        rationale: insight.rationale,
                        sources: [createInsightSource(insight)],
                    },
                    case: mapScenarioToCase(scenario),
                    targetDate: new Date(insight.timestamp).toISOString(),
                    created: prediction.created_at,
                };

                itemIdCounter += 1;
                items.push(item);
            });
        }
    );

    return items;
};
