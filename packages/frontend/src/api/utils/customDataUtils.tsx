import moment from "moment-with-locales-es6";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import {
	TRemoteFormat,
	TRemoteCustomData,
	TRemoteCustomDatum,
	TRemoteCustomMeta,
	TCustomMetaChart,
	TCustomMetaCard,
	TRemoteCustomLayoutEntry,
} from "src/api/services";
import { TCustomItem, TCustomSeries } from "src/api/types";
import { getErrorMessage } from "src/api/utils/errorHandling";
import { formatNumber, ENumberStyle } from "src/api/utils/format";
import { Logger } from "src/api/utils/logging";
import { getValueByPath } from "./itemUtils";
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
	data: JSONValue,
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
			(typeof currentObj.id === "string" || typeof currentObj.id === "number")
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
					`customDataUtils::validateCustomData: key ${key} has an invalid value ${rawDataField}`,
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
	meta: JSONValue,
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
	if (
		meta.layout_type !== "table" &&
		meta.layout_type !== "chart" &&
		meta.layout_type !== "card"
	) {
		return {
			meta: undefined,
			errorCode: EWidgetValidationErrorCodes.InvalidDataFieldType,
		};
	}
	try {
		if (meta.layout_type === "table" && Array.isArray(meta.layout.columns)) {
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
		Logger.warn("customDataUtils::validateCustomMeta: unexpected error", error);
		return {
			meta: undefined,
			errorCode: EWidgetValidationErrorCodes.UnexpectedError,
		};
	}
};

// TODO: in case of parsing error, consider returning an error message instead
export const evaluateTranslationTemplate: (
	template: string,
	data: TCustomItem,
) => string = (template, data) => {
	const TEMPLATE_REGEX = /\{\{([^}]+)\}\}/g;
	if (!TEMPLATE_REGEX.test(template)) {
		const value = getValueByPath(data, template);
		if (value === undefined) {
			Logger.warn(
				`evaluateTranslationTemplate: template "${template}" is invalid`,
			);
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
		if (getValueByPath(data, dataKey) == null) {
			Logger.warn(
				`evaluateTranslationTemplate: template "${template}" refers to non-existing or null data. Data:`,
				data,
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
	dateFormat?: string;
};
export type TFormatCustomDataFieldOutput = {
	field: string | React.ReactNode;
	error: string | undefined;
};
export const formatCustomDataField: (
	req: TFormatCustomDataFieldInput,
) => TFormatCustomDataFieldOutput = ({
	rawField,
	format = "plain-text",
	dateFormat,
}) => {
	try {
		if (format === "plain-text" || format === "link") {
			return {
				field: rawField,
				error: undefined,
			};
		}
		if (format === "date") {
			const parsedDate = moment(rawField, [
				moment.ISO_8601,
				"YYYY-MM-DD HH:mm:ss.SSS UTC",
				"YYYY-MM-DD HH:mm:ss UTC",
				"YYYY-MM-DD HH:mm:ss.SSS",
				"YYYY-MM-DD HH:mm:ss",
			]);

			if (!parsedDate.isValid()) {
				Logger.warn(
					`formatCustomDataField: Invalid date format for "${rawField}"`,
				);
				return {
					field: rawField,
					error: "Invalid date format",
				};
			}

			const outputFormat = dateFormat || "YYYY-MM-DDTHH:mmZ";
			return {
				field: parsedDate.format(outputFormat).toString(),
				error: undefined,
			};
		}
		if (format === "decimal" || format === "number") {
			// Handle null or invalid numeric values
			if (
				rawField === null ||
				rawField === undefined ||
				rawField === "" ||
				(typeof rawField === "string" && isNaN(parseFloat(rawField)))
			) {
				return {
					field: "-",
					error: undefined,
				};
			}
			return {
				field: formatNumber({ value: rawField }).value,
				error: undefined,
			};
		}
		if (format === "currency") {
			// Handle null or invalid numeric values
			if (
				rawField === null ||
				rawField === undefined ||
				rawField === "" ||
				(typeof rawField === "string" && isNaN(parseFloat(rawField)))
			) {
				return {
					field: "-",
					error: undefined,
				};
			}
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
			// Handle null or invalid numeric values
			if (
				rawField === null ||
				rawField === undefined ||
				rawField === "" ||
				(typeof rawField === "string" && isNaN(parseFloat(rawField)))
			) {
				return {
					field: "-",
					error: undefined,
				};
			}
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
				<ReactMarkdown remarkPlugins={[remarkBreaks]}>{rawField}</ReactMarkdown>
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

/**
 * Resolve the format for a given column and row when column.format is "auto".
 * Priority:
 * 1. Check row-specific overrides: item[`${key}_format`] or item.format key(s)
 * 2. If none found, attempt to infer from the rawField value (number, boolean, date, percentage)
 */
export const resolveCellFormat: (
	column: TRemoteCustomLayoutEntry,
	item: TRemoteCustomDatum,
	rawField: string | number | boolean | null | undefined,
) => TRemoteFormat = (column, item, rawField) => {
	const VALID_FORMATS: TRemoteFormat[] = [
		"plain-text",
		"date",
		"link",
		"image",
		"icon",
		"markdown",
		"number",
		"decimal",
		"currency",
		"percentage",
		"checkmark",
		"auto",
	];

	const isValidFormat = (f: unknown): f is TRemoteFormat =>
		typeof f === "string" && VALID_FORMATS.indexOf(f as TRemoteFormat) !== -1;

	const tryGetFieldKeysFromTemplate = (): string[] => {
		if (!column.template) return [];
		const TEMPLATE_REGEX = /\{\{([^}]+)\}\}/g;
		const matches = column.template.match(TEMPLATE_REGEX);
		if (matches === null) return [column.template];
		const keys: string[] = [];
		for (let i = 0; i < matches.length; i += 1) {
			const key = matches[i].replace(/\{\{|\}\}/g, "").trim();
			if (key) keys.push(key);
		}
		return keys.length ? keys : [column.template];
	};

	// If column is not auto, return it
	if (column.format !== "auto") {
		return column.format ?? "plain-text";
	}

	// 1/ Row-specific overrides
	const fieldKeys = tryGetFieldKeysFromTemplate();
	// prefer array iteration to `for...of` to satisfy eslint no-restricted-syntax rule
	let foundFormat: TRemoteFormat | undefined;
	fieldKeys.some((key) => {
		const k1 = `${key}_format`;
		const k2 = `${key}__format`;
		if (item != null && typeof item === "object") {
			const itemRecord = item as Record<
				string,
				string | number | boolean | null | Record<string, unknown>
			>;
			const f1 = itemRecord[k1];
			if (isValidFormat(f1)) {
				foundFormat = f1;
				return true;
			}
			const f2 = itemRecord[k2];
			if (isValidFormat(f2)) {
				foundFormat = f2;
				return true;
			}
			if (isValidFormat(itemRecord[key])) {
				foundFormat = itemRecord[key] as TRemoteFormat;
				return true;
			}
			// check `.format` top-level field
			const topFormat = itemRecord.format;
			if (isValidFormat(topFormat)) {
				foundFormat = topFormat;
				return true;
			}
			// if top-level `format` is an object mapping, check for field-specific format
			if (topFormat && typeof topFormat === "object") {
				const mapped = topFormat[key];
				if (isValidFormat(mapped)) {
					foundFormat = mapped;
					return true; // break out of some()
				}
			}
		}
		return false;
	});
	if (foundFormat) return foundFormat;

	// 2/ Try to infer from rawField
	if (rawField === undefined || rawField === null) return "plain-text";
	// boolean
	if (rawField === true || rawField === false) return "checkmark";
	if (
		typeof rawField === "string" &&
		(rawField.toLowerCase() === "true" || rawField.toLowerCase() === "false")
	) {
		return "checkmark";
	}
	// percentage
	if (String(rawField).trim().endsWith("%")) return "percentage";
	// number
	const parsedNumber = Number(String(rawField).replace(/[^0-9.-]+/g, ""));
	if (!Number.isNaN(parsedNumber)) {
		// if value contains a decimal point, pick decimal else number
		if (String(rawField).indexOf(".") !== -1) return "decimal";
		return "number";
	}
	// date
	const parsedDate = moment(
		rawField,
		[moment.ISO_8601, "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss"],
		true,
	);
	if (parsedDate.isValid()) return "date";

	return "plain-text";
};

// these correspond to tailwind jargon
type TJustification = "justify-start" | "justify-end" | "justify-center";
export const getColumnJustification: (
	f: TRemoteFormat,
	j?: "left" | "center" | "right" | undefined,
) => TJustification | undefined = (format, justify) => {
	if (justify) {
		switch (justify) {
			case "left":
				return "justify-start";
			case "center":
				return "justify-center";
			case "right":
				return "justify-end";
			default:
		}
	}
	if (format && ["number", "decimal", "currency"].indexOf(format) !== -1) {
		return "justify-end";
	}
	return "justify-start";
};

export const customDataAsSeries: (items: TRemoteCustomData) => TCustomSeries = (
	items,
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
	widgetName: string,
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
		`customDataUtils::getXSeries: Could not find x series in chart widget ${widgetName}`,
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
	name: string,
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
	widgetName: string,
) => TCustomSeries | number[] = (series, meta, widgetName) => {
	try {
		if (meta === undefined) {
			return series.slice(1);
		}
		if (meta.layout.series.length < 2) {
			Logger.warn(
				`customDataUtils::getYSeries: Layout of widget ${widgetName} should include at least 2 series (x and y) `,
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
			e,
		);
		return series;
	}
};

/**
 * Infers column layout from the first row of data when no columns are explicitly defined.
 * Generates sensible defaults for format, width, and template based on data types.
 */
export const generateColumnsFromRowData: (
	items: TRemoteCustomData,
) => TRemoteCustomLayoutEntry[] = (items) => {
	if (items.length === 0) {
		return [];
	}

	const firstRow = items[0];
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { id, ...dataFields } = firstRow;

	return Object.entries(dataFields).map(([key, value], index) => {
		let format: TRemoteFormat = "plain-text";

		// Infer format from value type
		if (typeof value === "number") {
			format = Number.isInteger(value) ? "number" : "decimal";
		} else if (typeof value === "boolean") {
			format = "checkmark";
		}

		return {
			id: index,
			title: key,
			template: key,
			format,
			width: 1,
		};
	});
};

export const customDataAsCardData: (
	customData: TRemoteCustomData,
	customMeta: TCustomMetaCard | undefined,
	widgetName: string,
) => { title?: string; value?: string | React.ReactNode } | undefined = (
	customData,
	meta,
	widgetName,
) => {
	try {
		const rawData = customData[0];
		if (rawData === undefined || Object.keys(rawData).length === 0) {
			Logger.warn(
				`customDataUtils::customDataAsCardData: Widget ${widgetName} has no data`,
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
			? evaluateTranslationTemplate(cardMeta.template, rawData)
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
			error,
		);
		return undefined;
	}
};
