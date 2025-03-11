import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
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

        const state = getState() as RootState;
        const contentLanguage = headers.get(
            "Content-Language"
        ) as ELanguageCode;

        if (
            contentLanguage &&
            Object.values(ELanguageCode).includes(contentLanguage)
        ) {
            // Update the last request's response, add lang field to it
            // eslint-disable-next-line no-restricted-syntax
            for (const key in state.alphadayApi.queries) {
                if (
                    state.alphadayApi.queries[key] &&
                    state.alphadayApi.queries[key]?.endpointName ===
                        "getViewByHash"
                ) {
                    state.alphadayApi.queries[key].data = {
                        // @ts-expect-error - no types
                        ...state.alphadayApi.queries[key].data,
                        lang: contentLanguage,
                    };
                }
            }

            dispatch({
                type: "alphadayApi/util/resetApiState",
                payload: state,
            });
        }
    },
});
