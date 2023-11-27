export enum EActivityLogEventTypes {
    ViewVisited = "VIEW_VISITED",
    WidgetInteraction = "WIDGET_INTERACTION", // Placeholder, TBD
    KeywordSelected = "KEYWORD_SELECTED",
    CookieChoiceSet = "COOKIE_CHOICE_SET",
}

export enum EActivityLogObjectTypes {
    Keyword = 1,
    Widget,
    View,
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

export type TRemoteActivityLog =
    | TKeywordActivityLog
    | TWidgetActivityLog
    | TViewActivityLog
    | TCookieActivityLog;

export type TActivityLogRequest = TRemoteActivityLog;
export type TActivityLogResponse = TRemoteActivityLog;
