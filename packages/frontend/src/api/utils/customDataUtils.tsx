import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import {
    TRemoteCustomDataField,
    TRemoteFormat,
    TRemoteCustomExtraStyle,
    TRemoteCustomIcon,
    ECustomDefaultIcons,
} from "src/api/services";
import { TCustomItem } from "src/api/types";
import { getErrorMessage } from "src/api/utils/errorHandling";
import { formatNumber, ENumberStyle } from "src/api/utils/format";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as LinkIcon } from "src/assets/icons/external-link.svg";

enum ESupportedTypes {
    String = "string",
    Number = "number",
    Boolean = "boolean",
}

export enum EItemValidationErrorCodes {
    FieldMissing = "FIELD_MISSING",
    InvalidField = "INVALID_FIELD",
    InvalidType = "INVALID_TYPE",
}

export type TCustomFieldValidationResult =
    | {
          item: TRemoteCustomDataField;
          errorCode: undefined;
      }
    | {
          item: undefined;
          errorCode: EItemValidationErrorCodes;
      };

export const validateCustomDataField: (
    field: Record<string, unknown>
) => TCustomFieldValidationResult = (field) => {
    // check that type is not missing
    if (field.type == null) {
        return {
            item: undefined,
            errorCode: EItemValidationErrorCodes.FieldMissing,
        };
    }
    // name & type must be a string
    if (field.name !== undefined && typeof field.name !== "string") {
        return {
            item: undefined,
            errorCode: EItemValidationErrorCodes.InvalidField,
        };
    }
    if (typeof field.type !== "string") {
        return {
            item: undefined,
            errorCode: EItemValidationErrorCodes.InvalidField,
        };
    }
    // this could be done more elegantly using "in" but TS can't cast
    // the type correctly in that way
    if (
        field.type !== ESupportedTypes.String &&
        field.type !== ESupportedTypes.Number &&
        field.type !== ESupportedTypes.Boolean
    ) {
        return {
            item: undefined,
            errorCode: EItemValidationErrorCodes.InvalidType,
        };
    }
    // at this point, we know type is either "string", "number" or "boolean".
    // however, its value can be undefined or null, which are valid
    if (field.value == null) {
        return {
            item: {
                name: field.name,
                value: field.value === null ? null : undefined,
                type: field.type,
            },
            errorCode: undefined,
        };
    }
    // check if declared types are consistent
    if (
        (field.type === "string" && typeof field.value !== "string") ||
        (field.type === "number" && typeof field.value !== "number") ||
        (field.type === "boolean" && typeof field.value !== "boolean")
    ) {
        return {
            item: undefined,
            errorCode: EItemValidationErrorCodes.InvalidType,
        };
    }
    if (typeof field.value === "string") {
        return {
            item: {
                name: field.name,
                value: typeof field.value === "string" ? field.value : null,
                type: "string",
            },
            errorCode: undefined,
        };
    }
    if (typeof field.value === "number") {
        return {
            item: {
                name: field.name,
                value: typeof field.value === "number" ? field.value : null,
                type: "number",
            },
            errorCode: undefined,
        };
    }
    if (typeof field.value === "boolean") {
        return {
            item: {
                name: field.name,
                value: typeof field.value === "boolean" ? field.value : null,
                type: "boolean",
            },
            errorCode: undefined,
        };
    }
    return {
        item: undefined,
        errorCode: EItemValidationErrorCodes.InvalidType,
    };
};

export type TCustomDataValidationResult =
    | {
          items: TCustomItem[];
          errorCode: undefined;
      }
    | {
          items: undefined;
          errorCode: EItemValidationErrorCodes;
      };
export const validateCustomData: (
    data: Record<string, Record<string, unknown>>[]
) => TCustomDataValidationResult = (data) => {
    const validData: TCustomItem[] = [];
    for (let i = 0; i < data.length; i += 1) {
        const entries = Object.entries(data[i]);
        for (let j = 0; j < entries.length; j += 1) {
            const [key, rawDataField] = entries[j];
            const validationResult = validateCustomDataField(rawDataField);
            if (validationResult.errorCode !== undefined) {
                return {
                    data: undefined,
                    errorCode: validationResult.errorCode,
                };
            }
            validData[i] = {
                ...validData[i],
                [key]: validationResult.item,
            };
        }
    }
    return {
        items: validData,
        errorCode: undefined,
    };
};

// TODO: in case of parsing error, consider returning an error message instead
export const evaluateTemplate: (
    template: string,
    data: TCustomItem
) => string = (template, data) => {
    const TEMPLATE_REGEX = /\{\{(\w+)\}\}/g;
    if (!TEMPLATE_REGEX.test(template)) {
        Logger.warn(`evaluateTemplate: template "${template}" is invalid`);
        return template;
    }
    TEMPLATE_REGEX.lastIndex = 0;
    let matches;
    let result = template;
    // eslint-disable-next-line no-cond-assign
    while ((matches = TEMPLATE_REGEX.exec(template)) !== null) {
        const dataKey = matches[1];
        if (data[dataKey] == null) {
            Logger.warn(
                `evaluateTemplate: template "${template}" refers to non-existing data`
            );
            return template;
        }
        result = result.replace(matches[0], String(data[dataKey].value));
    }
    return result;
};

// TODO: apply extraStyle
export type TFormatCustomDataFieldInput = {
    rawField: string;
    format: TRemoteFormat | undefined;
    extraStyle?: TRemoteCustomExtraStyle;
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
    f: TRemoteFormat
) => TJustification | undefined = (format) => {
    if (format && ["number", "decimal", "currency"].indexOf(format) !== -1) {
        return "flex-end";
    }
    return "flex-start";
};

export const getCustomIcon: (
    icon: TRemoteCustomIcon | undefined
) => JSX.Element | null = (icon) => {
    if (
        icon !== undefined &&
        icon.type === "internal" &&
        icon.id === ECustomDefaultIcons.ExternalLink
    ) {
        return <LinkIcon />;
    }
    return null;
};
