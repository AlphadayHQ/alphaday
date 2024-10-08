import logoDay from "@alphaday/ui-kit/src/assets/svg/logo-white.svg";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import wideAlphaImage from "src/assets/placeholders/wide-alpha.png";
import CONFIG from "src/config";
import globalMessages from "src/globalMessages";
import { Logger } from "./logging";

/* eslint-disable no-param-reassign */
export const imgOnError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = logoDay;
};
/* eslint-enable no-param-reassign */

/* eslint-disable no-param-reassign */
export const wideImgOnError = (
    e: React.SyntheticEvent<HTMLImageElement>
): void => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = wideAlphaImage;
};
/* eslint-enable no-param-reassign */

/* eslint-disable no-param-reassign */
export const handleTableImgError =
    (path: string | undefined) =>
    (e: React.SyntheticEvent<HTMLImageElement>): void => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = logoDay;
        if (CONFIG.IS_PROD && path) {
            Logger.error("handleTableImgError: could not resolve image", path);
        }
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

export const getErrorCode = (err: unknown): number | string | undefined => {
    return parseUnknownError(err, EGenericErrorFields.Code);
};

export const getErrorStatus = (err: unknown): number | string | undefined => {
    const status = parseUnknownError(err, EGenericErrorFields.Status);
    if (
        status !== undefined &&
        (typeof status === "number" || typeof status === "string")
    ) {
        return status;
    }
    return undefined;
};

export const getErrorMessage = (err: unknown): string | undefined => {
    const msg = parseUnknownError(err, EGenericErrorFields.Message);
    if (msg !== undefined && typeof msg === "string") return msg;
    return undefined;
};

export const getRtkErrorCode = (
    error: FetchBaseQueryError | SerializedError | undefined
): number | string | undefined => {
    if (!error) return undefined;
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
    return getErrorCode(error);
};
