export enum EActivityLogEventTypes {
    ViewVisited = "VIEW_VISITED",
    WidgetInteraction = "WIDGET_INTERACTION", // Placeholder, TBD
    KeywordSelected = "KEYWORD_SELECTED",
    CookieChoiceSet = "COOKIE_CHOICE_SET",
    WalletConnection = "WALLET_CONNECT",
    ShareSuperfeedItem = "SHARE_ITEM",
    ButtonClicked = "BUTTON_CLICKED",
}

export enum EActivityLogObjectTypes {
    Keyword = 1,
    Widget,
    View,
    WalletConnection,
    ShareSuperfeedItem,
    Button,
}

export type TKeywordActivityLog = {
    event_type: EActivityLogEventTypes.KeywordSelected;
    object_type: EActivityLogObjectTypes.Keyword;
    object_id: number;
    data?: JSONValue;
};

export type TWidgetActivityLog = {
    event_type: EActivityLogEventTypes.WidgetInteraction;
    object_type: EActivityLogObjectTypes.Widget;
    object_id: number;
    data?: JSONValue;
};

export type TViewActivityLog = {
    event_type: EActivityLogEventTypes.ViewVisited;
    object_type: EActivityLogObjectTypes.View;
    object_id: number;
    data?: JSONValue;
};

export type TCookieActivityLog = {
    event_type: EActivityLogEventTypes.CookieChoiceSet;
    data: JSONValue;
};

export type TWalletConnectionActivityLog = {
    event_type: EActivityLogEventTypes.WalletConnection;
    object_type: EActivityLogObjectTypes.WalletConnection;
    data?: JSONValue;
};

export type TShareSuperfeedItemActivityLog = {
    event_type: EActivityLogEventTypes.ShareSuperfeedItem;
    object_type: EActivityLogObjectTypes.ShareSuperfeedItem;
    object_id: number;
    data: JSONValue;
};

export type TButtonClickedActivityLog = {
    event_type: EActivityLogEventTypes.ButtonClicked;
    object_name: string;
    data?: JSONValue;
};

export type TRemoteActivityLog =
    | TKeywordActivityLog
    | TWidgetActivityLog
    | TViewActivityLog
    | TCookieActivityLog
    | TWalletConnectionActivityLog
    | TShareSuperfeedItemActivityLog
    | TButtonClickedActivityLog;

export type TActivityLogRequest = TRemoteActivityLog;
export type TActivityLogResponse = TRemoteActivityLog;
