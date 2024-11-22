import i18next from "i18next";
import { evaluateTemplate } from "./api/utils/textUtils";

const SlugToWidgetNameMap: Record<string, string> = {
    calendar_template: "Calendar",
};
const globalMessages = {
    error: {
        title: i18next.t("messages.error.title"),
        notFound: i18next.t("messages.error.notFound"),
        generic: i18next.t("messages.error.generic"),
        forbidden: i18next.t("messages.error.forbidden"),
        unauthorized: i18next.t("messages.error.unauthorized"),
        notAuthenticated: i18next.t("messages.error.notAuthenticated"),
        maxViews: i18next.t("messages.error.maxViews"),
        maxWidgets: i18next.t("messages.error.maxWidgets"),
        maxViewWidgets: i18next.t("messages.error.maxViewWidgets"),
        requestFailed(term = "the data"): string {
            return evaluateTemplate(i18next.t("messages.error.requestFailed"), {
                term,
            });
        },
        boardHasNoRequiredWidget(
            widget_template: string | undefined,
            boardName: string | undefined
        ): string {
            if (
                boardName &&
                widget_template &&
                widget_template in SlugToWidgetNameMap
            ) {
                return evaluateTemplate(
                    i18next.t("messages.error.boardHasNoRequiredWidget"),
                    {
                        boardName: boardName || "",
                        widgetName: SlugToWidgetNameMap[widget_template],
                    }
                );
            }
            return "";
        },
    },
    success: {
        title: i18next.t("messages.success.title"),
        generic: i18next.t("messages.success.generic"),
    },
    queries: {
        noResults: i18next.t("messages.queries.noResults"),
        noMatchFound: (item: string): string =>
            evaluateTemplate(i18next.t("messages.queries.noMatchFound"), {
                item,
            }),
    },
    portfolio: {
        signUp: i18next.t("messages.portfolio.signUp"),
        connectWallet: i18next.t("messages.portfolio.connectWallet"),
        verifyWallet: i18next.t("messages.portfolio.verifyWallet"),
    },
    callToAction: {
        signUpToBookmark: (item?: string) =>
            evaluateTemplate(
                i18next.t("messages.callToAction.signUpToBookmark"),
                {
                    item: item || "",
                }
            ),
    },
};

export const calendarMessages = {
    noEvents: i18next.t("calendar.no_events"),
};

export default globalMessages;
