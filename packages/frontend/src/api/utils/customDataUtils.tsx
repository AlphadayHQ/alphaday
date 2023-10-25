import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import {
    TRemoteFormat,
    TRemoteCustomData,
    TRemoteCustomDatum,
    TRemoteCustomMeta,
    TCustomMetaCard,
    TCustomMetaChart,
} from "src/api/services";
import { TCustomItem, TCustomSeries } from "src/api/types";
import { getErrorMessage } from "src/api/utils/errorHandling";
import { formatNumber, ENumberStyle } from "src/api/utils/format";
import { Logger } from "src/api/utils/logging";
import { truncateWithEllipsis } from "./textUtils";

export enum EWidgetValidationErrorCodes {
    InvalidDataFieldType = "INVALID_DATA_FIELD_VALUE",
    MissingField = "MISSING_FIELD",
    ExpectedArray = "EXPECTED_ARRAY",
    ExpectedObject = "EXPECTED_OBJECT",
    UnexpectedError = "UNEXPECTED_ERROR",
}

export type TCustomDataValidationResult =
    | {
          items: TRemoteCustomData | undefined;
          errorCode: undefined;
      }
    | {
          items: undefined;
          errorCode: EWidgetValidationErrorCodes;
      };
export const validateCustomData: (
    data: JSONValue
) => TCustomDataValidationResult = (data) => {
    // return undefined if data = null or data = {}
    if (
        data == null ||
        (typeof data === "object" &&
            !Array.isArray(data) &&
            Object.keys(data).length === 0)
    ) {
        return {
            items: undefined,
            errorCode: undefined,
        };
    }
    if (typeof data !== "object" || !Array.isArray(data)) {
        return {
            items: undefined,
            errorCode: EWidgetValidationErrorCodes.ExpectedArray,
        };
    }
    const validData: TRemoteCustomData = [];
    for (let i = 0; i < data.length; i += 1) {
        const currentObj = data[i];
        if (
            currentObj == null ||
            typeof currentObj !== "object" ||
            Array.isArray(currentObj)
        ) {
            return {
                items: undefined,
                errorCode: EWidgetValidationErrorCodes.ExpectedObject,
            };
        }
        const entries = Object.entries(currentObj);
        // make sure each entry has an id
        const currentId =
            currentObj.id != null &&
            (typeof currentObj.id === "string" ||
                typeof currentObj.id === "number")
                ? currentObj.id
                : i;
        const currentValidObj: TRemoteCustomDatum = { id: currentId };
        for (let j = 0; j < entries.length; j += 1) {
            const [key, rawDataField] = entries[j];
            if (
                rawDataField !== null &&
                typeof rawDataField !== "string" &&
                typeof rawDataField !== "number" &&
                typeof rawDataField !== "boolean"
            ) {
                Logger.warn(
                    `customDataUtils::validateCustomData: key ${key} has an invalid value ${rawDataField}`
                );
                return {
                    items: undefined,
                    errorCode: EWidgetValidationErrorCodes.InvalidDataFieldType,
                };
            }
            currentValidObj[key] = rawDataField;
        }
        validData[i] = currentValidObj;
    }
    return {
        items: validData,
        errorCode: undefined,
    };
};

export type TCustomMetaValidationResult =
    | {
          meta: TRemoteCustomMeta | undefined;
          errorCode: undefined;
      }
    | {
          meta: undefined;
          errorCode: EWidgetValidationErrorCodes;
      };

/**
 * note(v-almonacid): more validation is needed to ensure we are getting the proper types
 * but this should be enough for now
 */
export const validateCustomMeta: (
    meta: JSONValue
) => TCustomMetaValidationResult = (meta) => {
    // return undefined if meta = null or data = {}
    if (
        meta == null ||
        (typeof meta === "object" &&
            !Array.isArray(meta) &&
            Object.keys(meta).length === 0)
    ) {
        return {
            meta: undefined,
            errorCode: undefined,
        };
    }
    // make sure meta is an object
    if (typeof meta !== "object" || Array.isArray(meta)) {
        return {
            meta: undefined,
            errorCode: EWidgetValidationErrorCodes.ExpectedObject,
        };
    }
    if (
        meta.layout == null ||
        typeof meta.layout !== "object" ||
        Array.isArray(meta.layout)
    ) {
        return {
            meta: undefined,
            errorCode: EWidgetValidationErrorCodes.MissingField,
        };
    }
    if (meta.layout_type !== "table" && meta.layout_type !== "chart") {
        return {
            meta: undefined,
            errorCode: EWidgetValidationErrorCodes.InvalidDataFieldType,
        };
    }
    try {
        if (
            meta.layout_type === "table" &&
            Array.isArray(meta.layout.columns)
        ) {
            const columnsLayout = meta.layout.columns.reduce((acc, curr, i) => {
                if (
                    typeof curr === "object" &&
                    !Array.isArray(curr) &&
                    Array.isArray(acc)
                ) {
                    if (curr?.id === undefined) {
                        // add an id to each layout entry for convenience
                        return [
                            ...acc,
                            {
                                id: i,
                                ...curr,
                            },
                        ];
                    }
                    return [...acc, curr];
                }
                return acc;
            }, []);
            return {
                meta: {
                    ...meta,
                    layout: {
                        ...meta.layout,
                        columns: columnsLayout,
                    },
                } as TRemoteCustomMeta,
                errorCode: undefined,
            };
        }
        return {
            meta: meta as TRemoteCustomMeta,
            errorCode: undefined,
        };
    } catch (error) {
        Logger.warn(
            "customDataUtils::validateCustomMeta: unexpected error",
            error
        );
        return {
            meta: undefined,
            errorCode: EWidgetValidationErrorCodes.UnexpectedError,
        };
    }
};

// TODO: in case of parsing error, consider returning an error message instead
export const evaluateTemplate: (
    template: string,
    data: TCustomItem
) => string = (template, data) => {
    const TEMPLATE_REGEX = /\{\{(\w+)\}\}/g;
    if (!TEMPLATE_REGEX.test(template)) {
        const value = data[template];
        if (value === undefined) {
            Logger.warn(`evaluateTemplate: template "${template}" is invalid`);
            return template;
        }
        return String(value);
    }
    TEMPLATE_REGEX.lastIndex = 0;
    let matches;
    let result = template;
    // eslint-disable-next-line no-cond-assign
    while ((matches = TEMPLATE_REGEX.exec(template)) !== null) {
        const dataKey = matches[1];
        if (data[dataKey] == null) {
            Logger.warn(
                `evaluateTemplate: template "${template}" refers to non-existing or null data. Data:`,
                data
            );
            return template;
        }
        result = result.replace(matches[0], String(data[dataKey]));
    }
    return result;
};

export type TFormatCustomDataFieldInput = {
    rawField: string;
    format: TRemoteFormat | undefined;
    uri?: string;
};
export type TFormatCustomDataFieldOutput = {
    field: string | React.ReactNode;
    error: string | undefined;
};
export const formatCustomDataField: (
    req: TFormatCustomDataFieldInput
) => TFormatCustomDataFieldOutput = ({ rawField, format = "plain-text" }) => {
    try {
        if (format === "plain-text" || format === "link") {
            return {
                field: rawField,
                error: undefined,
            };
        }
        if (format === "date") {
            return {
                field: moment(rawField).format("YYYY-MM-DDTHH:mmZ").toString(),
                error: undefined,
            };
        }
        if (format === "decimal" || format === "number") {
            return {
                field: formatNumber({ value: rawField }).value,
                error: undefined,
            };
        }
        if (format === "currency") {
            return {
                field: formatNumber({
                    value: rawField,
                    style: ENumberStyle.Currency,
                    currency: "USD",
                }).value,
                error: undefined,
            };
        }
        if (format === "percentage") {
            return {
                field: formatNumber({
                    value: rawField,
                    style: ENumberStyle.Percent,
                }).value,
                error: undefined,
            };
        }
        if (format === "markdown") {
            const field = (
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                    {rawField}
                </ReactMarkdown>
            );
            return {
                field,
                error: undefined,
            };
        }
        return {
            field: rawField,
            error: undefined,
        };
    } catch (error) {
        return {
            field: rawField,
            error: getErrorMessage(error),
        };
    }
};

type TJustification = "flex-start" | "flex-end" | "center";
export const getColumnJustification: (
    f: TRemoteFormat,
    j?: "left" | "center" | "right" | undefined
) => TJustification | undefined = (format, justify) => {
    if (justify) {
        switch (justify) {
            case "left":
                return "flex-start";
            case "center":
                return "center";
            case "right":
                return "flex-end";
            default:
        }
    }
    if (format && ["number", "decimal", "currency"].indexOf(format) !== -1) {
        return "flex-end";
    }
    return "flex-start";
};

export const customDataAsSeries: (items: TRemoteCustomData) => TCustomSeries = (
    items
) => {
    if (items.length === 0) {
        return [];
    }
    // initialise series (output)
    const series: TCustomSeries = [];
    Object.keys(items[0]).forEach((key) => {
        // recall: each entry has an id but we don't need it for charts
        if (key !== "id") {
            series.push({ name: key, data: [] });
        }
    });
    items.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
            const matchedSeries = series.find((s) => s.name === key);
            if (typeof value === "string" || typeof value === "number") {
                matchedSeries?.data.push(value);
            }
        });
    });
    return series;
};

/**
 * From an array of data series, retrieve the series corresponding to the x axis
 */
export const getXSeries: (
    series: TCustomSeries,
    meta: TCustomMetaChart | undefined,
    widgetName: string
) => (string | number)[] = (series, meta, widgetName) => {
    if (meta === undefined) {
        // with no meta, we assume the x axis corresponds to the first series
        return series[0].data;
    }
    const xAxisRef = meta.layout.series[0]?.data_ref;
    if (xAxisRef) {
        const xAxis = series.find((s) => s.name === xAxisRef)?.data;
        if (xAxis) return xAxis.map((n) => truncateWithEllipsis(String(n)));
    }
    Logger.warn(
        `customDataUtils::getXSeries: Could not find x series in chart widget ${widgetName}`
    );
    return series[0].data;
};

/**
 * From an array of series, returns a single series.
 * @param series An array of series (ie. chart data)
 * @param name The name of the series we want to retrieve
 * @returns A single series
 */
export const getSeriesByName: (
    series: TCustomSeries,
    name: string
) => { data: number[]; name: string } | undefined = (series, name) => {
    const matchedSeries = series.find((s) => s.name === name);
    if (matchedSeries) {
        return {
            data: matchedSeries.data.map((s) => Number(s)),
            name,
        };
    }
    return undefined;
};

/**
 * From an array of data series, retrieve those series that correspond to y axis values
 */
export const getYSeries: (
    series: TCustomSeries,
    meta: TCustomMetaChart | undefined,
    widgetName: string
) => TCustomSeries | number[] = (series, meta, widgetName) => {
    try {
        if (meta === undefined) {
            return series.slice(1);
        }
        if (meta.layout.series.length < 2) {
            Logger.warn(
                `customDataUtils::getYSeries: Layout of widget ${widgetName} should include at least 2 series (x and y) `
            );
            return series;
        }
        /**
         * pie charts are an exception, data is provided as a plain number array
         */
        if (meta.layout.variant === "pie" || meta.layout.variant === "donut") {
            const yDataKey = meta.layout.series[1]?.data_ref;
            if (yDataKey) {
                const yDataSet = getSeriesByName(series, yDataKey);
                if (yDataSet) return yDataSet.data;
            }
        }
        const newSeries: { name: string; data: number[] }[] = [];
        meta.layout.series.slice(1).forEach((dataSetMeta) => {
            const dataSet = getSeriesByName(series, dataSetMeta.data_ref);
            if (dataSet) newSeries.push(dataSet);
        });
        return newSeries;
    } catch (e) {
        Logger.error(
            `customDataUtils::getYSeries: Could not parse chart data for widget ${widgetName}. Error:`,
            e
        );
        return series;
    }
};

/**
 * Attemtps to extract the Card fields `title` and `value` from a custom_data and custom_meta objects.
 */
export const customDataAsCardData: (
    customData: TRemoteCustomData,
    meta: TCustomMetaCard | undefined,
    widgetName: string
) => { title?: string; value?: string | React.ReactNode } | undefined = (
    customData,
    meta,
    widgetName
) => {
    try {
        const rawData = customData[0];
        if (rawData === undefined || Object.keys(rawData).length === 0) {
            Logger.warn(
                `customDataUtils::customDataAsCardData: Widget ${widgetName} has no data`
            );
            return undefined;
        }
        // recall: We might have appended a dummy id when transforming the response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = rawData;

        /**
         * Parse data optimistically (ie. ignoring meta)
         * if no meta is provided, assume title and value are the key and value of the first element
         * in the datum object, respectively.
         */
        const keys = Object.keys(data);
        const optimisticData = {
            title: String(keys[0]),
            value: String(data[keys[0]]),
        };

        if (meta?.layout === undefined) {
            return optimisticData;
        }
        const cardMeta = meta.layout?.columns[0];
        let rawValue = cardMeta.template
            ? evaluateTemplate(cardMeta.template, rawData)
            : optimisticData.value;
        if (cardMeta.prefix) rawValue = `${cardMeta.prefix} ${rawValue}`;
        if (cardMeta.suffix) rawValue = `${rawValue} ${cardMeta.suffix}`;
        return {
            title: String(cardMeta?.title),
            value: formatCustomDataField({
                rawField: rawValue,
                format: cardMeta.format ?? "markdown",
            }).field,
        };
    } catch (error) {
        Logger.error(
            `customDataUtils::customDataAsCardData: Parsing error in widget ${widgetName}`,
            error
        );
        return undefined;
    }
};
