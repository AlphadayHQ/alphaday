import { Logger } from "src/api/utils/logging";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import CONFIG from "src/config/config";

const { PERCENTAGE_DECIMAL_PLACES } = CONFIG.UI;

const MAX_DECIMAL_PLACES = 20;
const FRACTIONAL_SIGNIFICANT_DIGITS = 3;

type TNumberFormatConfig = {
    From: number;
    To: number;
    DecimalPlaces: number | undefined;
    Compact?: boolean;
};

const NUMBER_FORMAT_CONFIG: Record<string, TNumberFormatConfig> = {
    VeryBigNumbers: {
        From: 1_000_000,
        To: Number.MAX_VALUE,
        DecimalPlaces: 1,
        Compact: true,
    },
    BigNumbers: {
        From: 100_000,
        To: 1_000_000,
        DecimalPlaces: 0,
    },
    MediumSizeNumbers: {
        From: 1_000,
        To: 100_000,
        DecimalPlaces: 0,
    },
    SmallNumbers: {
        From: 1,
        To: 1000,
        DecimalPlaces: 2,
    },
    Default: {
        From: 1 / Number.MAX_VALUE,
        To: Number.MAX_VALUE,
        DecimalPlaces: undefined,
        Compact: false,
    },
} as const;

const PERCENT_FORMAT = {
    From: 1 / Number.MAX_VALUE,
    To: Number.MAX_VALUE,
    DecimalPlaces: PERCENTAGE_DECIMAL_PLACES,
    Compact: false,
};

export enum ENumberStyle {
    Percent = "percent",
    Currency = "currency",
    Decimal = "decimal",
}

/**
 * Determine what presentation format should be applied to a given number
 */
const getNumberFormat: (
    value: number | string,
    style?: ENumberStyle
) => TNumberFormatConfig = (value, style) => {
    if (style === ENumberStyle.Percent) return PERCENT_FORMAT;
    let parsedValue = value;
    if (typeof value === "string") {
        parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            Logger.warn(
                "format::computeDecimalPlaces: could not parse value",
                value
            );
            return NUMBER_FORMAT_CONFIG.Default;
        }
    }
    if (typeof parsedValue !== "number") throw new Error("expected a number");
    parsedValue = Math.abs(parsedValue);
    const format = Object.values(NUMBER_FORMAT_CONFIG).find(
        // @ts-ignore
        (config) => parsedValue >= config.From && parsedValue < config.To
    );
    return format ?? NUMBER_FORMAT_CONFIG.Default;
};

export type TFormatTokenRequest = {
    value: number | string;
    locale?: string;
    signed?: boolean;
    currency?: "USD";
    style?: ENumberStyle;
    normalise?: boolean;
    useEllipsis?: boolean;
    ellipsisCutoff?: number;
};
export type TFormatTokenResponse = {
    value: string;
};
export const formatNumber: (r: TFormatTokenRequest) => TFormatTokenResponse = (
    r
) => {
    const format = getNumberFormat(r.value, r.style);
    const rawValue =
        typeof r.value === "string" ? parseFloat(r.value) : r.value;
    // market API gives non-normalised percentage values and
    // applying percentage style will multiply these by 100, hence the normalise
    // prop.
    const factor = r.normalise ? 1 / 100 : 1;
    let value = String(rawValue);
    try {
        const limitSignificantDigits =
            rawValue < 1 && r.style !== ENumberStyle.Percent;
        value = new Intl.NumberFormat(r.locale ?? "en-US", {
            ...(format.Compact && { notation: "compact" }),
            ...(r.style && { style: r.style }),
            ...(r.currency && { currency: r.currency }),
            ...(limitSignificantDigits && {
                maximumSignificantDigits: FRACTIONAL_SIGNIFICANT_DIGITS,
            }),
            ...(!limitSignificantDigits && {
                maximumFractionDigits:
                    format.DecimalPlaces ?? MAX_DECIMAL_PLACES,
            }),
        }).format(rawValue * factor);
    } catch (error) {
        Logger.error("format::formatNumber:error", error);
        Logger.error("format::formatNumber:request", r);
    }
    if (r.signed && Math.sign(rawValue) === 1) value = `+${value}`;
    if (r.useEllipsis && rawValue < 1) {
        value = truncateWithEllipsis(value, r.ellipsisCutoff, "end");
    }
    return { value };
};
