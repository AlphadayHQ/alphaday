import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import logoDay from "src/assets/icons/logo-white.svg";
import globalMessages from "src/globalMessages";

/* eslint-disable no-param-reassign */
export const imgOnError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = logoDay;
};
/* eslint-enable no-param-reassign */

export type TErrorId = keyof Omit<
    (typeof globalMessages)["error"],
    "requestFailed" | "boardHasNoRequiredWidget"
>;
export const errorPatterns: Partial<Record<TErrorId, string>> = {
    maxViews: "max views count *",
    maxViewWidgets: "widget .+ exceeded max-per-view limit",
    maxWidgets: "max widget count *",
};

/**
 * Convert errors into readable one
 *
 * @param format Machine error from backend
 */
export const getReadableErrorMessage = (format?: string): string => {
    const selectedPattern = Object.keys(errorPatterns).find((pattern) => {
        const check = errorPatterns[pattern as TErrorId];
        if (check === undefined || format === undefined) return false;
        return new RegExp(check).test(format);
    });
    if (selectedPattern === undefined) {
        return globalMessages.error.generic;
    }
    return globalMessages.error[selectedPattern as TErrorId];
};

enum EGenericErrorFields {
    Code,
    Message,
    Status,
    OriginalStatus,
}

export const parseUnknownError = (
    err: unknown,
    field: EGenericErrorFields
): string | number | undefined => {
    try {
        // note: ts can't infer the type here if we call isObject
        if (err != null && typeof err === "object" && !Array.isArray(err)) {
            if (field === EGenericErrorFields.Code) {
                // @ts-expect-error
                const { code } = err;
                if (
                    code !== undefined &&
                    (typeof code === "number" || typeof status === "string")
                ) {
                    return code;
                }
                return undefined;
            }
            if (field === EGenericErrorFields.Message) {
                // @ts-expect-error
                const { message } = err;
                if (message !== undefined && typeof message === "string") {
                    return message;
                }
                return undefined;
            }
            if (field === EGenericErrorFields.Status) {
                // @ts-expect-error
                const { status } = err;
                if (
                    status !== undefined &&
                    (typeof status === "number" || typeof status === "string")
                ) {
                    return status;
                }
                return undefined;
            }
            if (field === EGenericErrorFields.OriginalStatus) {
                // @ts-expect-error
                const { originalStatus } = err;
                if (
                    originalStatus !== undefined &&
                    typeof originalStatus === "number"
                ) {
                    return originalStatus;
                }
                return undefined;
            }
        }
        return undefined;
    } catch (_e) {
        return "Failed to parse error";
    }
};

export const getErrorCode = (err: unknown): number | undefined => {
    const code = parseUnknownError(err, EGenericErrorFields.Code);
    if (code !== undefined && typeof code === "number") return code;
    return undefined;
};

export const getErrorStatus = (err: unknown): number | string | undefined => {
    const status = parseUnknownError(err, EGenericErrorFields.Status);
    if (
        status !== undefined &&
        (typeof status === "number" || typeof status === "string")
    )
        return status;
    return undefined;
};

export const getErrorMessage = (err: unknown): string | undefined => {
    const msg = parseUnknownError(err, EGenericErrorFields.Message);
    if (msg !== undefined && typeof msg === "string") return msg;
    return undefined;
};

export const getRtkErrorCode = (
    error: FetchBaseQueryError | SerializedError
    // eslint-disable-next-line consistent-return
): number | undefined => {
    // @ts-expect-error
    if (error.status !== undefined) {
        // this is a FetchBaseQueryError
        const status = getErrorStatus(error);
        if (typeof status === "number") return status;
        const originalStatus = parseUnknownError(
            error,
            EGenericErrorFields.OriginalStatus
        );
        if (typeof originalStatus === "number") return originalStatus;
    }
    const code = getErrorCode(error);
    if (code === undefined || typeof code === "number") return code;
    if (code === "string") {
        const parsedCode = parseInt(code, 10);
        if (isNaN(parsedCode)) return undefined;
        return parsedCode;
    }
};
