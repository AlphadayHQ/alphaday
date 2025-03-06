import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCurrentLanguageCode } from "src/api/store/slices/ui";
import { ELanguageCode } from "src/api/types/language";
import type { RootState } from "../store";

export const languageMiddleware = createListenerMiddleware();

languageMiddleware.startListening({
    matcher: isAnyOf(
        (
            action
        ): action is {
            type: string;
        } => {
            return (
                typeof action.type === "string" &&
                action.type.endsWith("/fulfilled")
            );
        }
    ),
    effect(action, { dispatch, getState }) {
        const headers = (
            action as unknown as {
                meta: {
                    baseQueryMeta: {
                        response: {
                            headers: Headers;
                        };
                    };
                };
            }
        )?.meta?.baseQueryMeta?.response?.headers;
        if (!headers) return;

        const currentLanguage = (getState() as RootState).ui
            .selectedLanguageCode;
        const contentLanguage = headers.get(
            "Content-Language"
        ) as ELanguageCode;

        if (
            contentLanguage &&
            Object.values(ELanguageCode).includes(contentLanguage) &&
            currentLanguage !== contentLanguage
        ) {
            dispatch(setCurrentLanguageCode({ code: contentLanguage }));
        }
    },
});
