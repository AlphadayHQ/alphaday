const SlugToWidgetNameMap: Record<string, string> = {
    calendar_template: "Calendar",
};
const globalMessages = {
    error: {
        title: "Error",
        notFound: "The requested page could not be found.",
        generic: "An error occurred while processing your request.",
        forbidden: "You do not have permission to access this page.",
        unauthorized: "You are not authorized to access this page.",
        notAuthenticated: "Please connect and verify your wallet to continue",
        maxViews: "You have created maximum allowed boards",
        maxWidgets: "Your board has more widgets than allowed",
        maxViewWidgets:
            "You have exceeded the allowed count of this widget on a board",
        requestFailed(term = "the data"): string {
            return `An error occurred fetching ${term}, please try again later`;
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
                return `This ${
                    boardName || ""
                } board does not have the required ${
                    SlugToWidgetNameMap[widget_template]
                } widget, to access this route you need to add the ${
                    SlugToWidgetNameMap[widget_template]
                } widget to this board and refresh the page.`;
            }
            return "";
        },
    },
    success: {
        title: "Success",
        generic: "Your request was processed successfully.",
    },
    queries: {
        noResults: "No results found",
        noMatchFound: (item: string): string => `No matching ${item} found.`,
    },
    portfolio: {
        signUp: "Sign up to save your portfolio",
        connectWallet: "To signup, first connect your wallet.",
        verifyWallet:
            "Sign a fee-less message to confirm ownership and log in to Alphaday to save your configuration.",
    },
    callToAction: {
        signUpToBookmark: (item?: string) =>
            `Sign up to bookmark ${item ?? ""} and unlock more features`,
    },
};

export const calendarMessages = {
    noEvents: "No upcoming events found",
};

export default globalMessages;
