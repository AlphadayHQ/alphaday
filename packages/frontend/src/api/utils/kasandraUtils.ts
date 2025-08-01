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
    } else if (interval === "1Y") {
        timeframe = "1y";
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
