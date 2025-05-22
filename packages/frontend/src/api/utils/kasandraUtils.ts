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
