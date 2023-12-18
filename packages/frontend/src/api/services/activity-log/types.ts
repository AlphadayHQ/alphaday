export enum EActivityLogEventTypes {
    ViewVisited = "VIEW_VISITED",
    WidgetInteraction = "WIDGET_INTERACTION", // Placeholder, TBD
    KeywordSelected = "KEYWORD_SELECTED",
    CookieChoiceSet = "COOKIE_CHOICE_SET",
    WalletConnect = "WALLET_CONNECT",
}

export enum EActivityLogObjectTypes {
    Keyword = 1,
    Widget,
    View,
    WalletConnect,
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

export type TWalletConnectActivityLog = {
    event_type: EActivityLogEventTypes.WalletConnect;
    object_type: EActivityLogObjectTypes.WalletConnect;
    data?: JSONValue;
};

export type TRemoteActivityLog =
    | TKeywordActivityLog
    | TWidgetActivityLog
    | TViewActivityLog
    | TCookieActivityLog
    | TWalletConnectActivityLog;

export type TActivityLogRequest = TRemoteActivityLog;
export type TActivityLogResponse = TRemoteActivityLog;
