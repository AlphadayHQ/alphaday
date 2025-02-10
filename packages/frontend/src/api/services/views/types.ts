import { EnumLanguageCode } from "src/api/types/language";
import { EWidgetSettingsRegistry } from "src/constants";
import { TWidgetSlug, TTemplateSlug } from "src/types";
import { TPagination, TRemoteTagReadOnly, EItemsSortBy } from "../baseTypes";

/**
 * Primitive types
 */

export enum EWidgetData {
    Static = "static",
    Internal = "internal_api",
    External = "external_api",
}

export type TRemoteWidgetSetting = {
    setting: {
        slug: EWidgetSettingsRegistry;
    };
    sort_order: number;
};

export type TRemoteWidgetTemplate = {
    id: number;
    name: string;
    slug: TTemplateSlug;
    icon: string;
    status: number;
};

export type TRemoteSourceData = {
    name: string;
    source_url: string;
};

export type TRemoteColumnData = {
    name: string;
};

/**
 * @deprecated
 * This field has been deprecated in favor of `custom_data` and `custom_meta`.
 */
export type TRemoteFormatStructure<T> = {
    data?: T;
    columns?: TRemoteFormatStructureColumns[];
} | null;

export type TRemoteColumn =
    | "string"
    | "number"
    | "date"
    | "decimal"
    | "link"
    | "image"
    | "percentage"
    | "markdown";

export type TRemoteFormatStructureColumns = {
    name: string;
    width: number;
    column_type: TRemoteColumn;
    href?: TRemoteFormatStructureColumnsField;
    field: TRemoteFormatStructureColumnsField;
};

export type TRemoteFormatStructureColumnsField = {
    name: string;
    type: TRemoteColumn;
    showLinkIcon?: boolean;
};

export enum ERemoteWidgetStatus {
    Offline,
    Staging,
    Production,
}

/**
 * Types related to custom widgets
 */

export type TRemoteFormat =
    | "plain-text"
    | "date"
    | "link"
    | "image"
    | "icon"
    | "markdown"
    | "number"
    | "decimal"
    | "currency"
    | "percentage"
    | "checkmark";

// types to define the layout of a table column
export type TRemoteCustomLayoutEntry = {
    id: number; // note: this is added on the frontend when transforming response
    title?: string; // eg. the column name displayed in tables
    desc?: string;
    /**
     * eg. "field_name", "{{field_name}}" or, for composite values, "{{field_name_a}} {{field_name_b}}"
     */
    template?: string;
    format?: TRemoteFormat;
    width?: number;
    uri_ref?: string; // should point to data field entry
    image_uri_ref?: string; // should point to data field entry
    capitalize?: boolean;
    signed_number?: boolean;
    hide_title?: boolean; // hides title in table
    hidden?: boolean; // hides whole column
    justify?: "left" | "center" | "right";
    prefix?: string; // eg. "$"
    suffix?: string; // eg. "B"
};

export type TRemoteCustomRowProps = {
    uri_ref?: string; // if given, whole row should point to this url (with highest predecence)
};

// tables consume data from either data.items or from an API
export type TCustomLayoutTable = {
    columns: TRemoteCustomLayoutEntry[];
    row_props?: TRemoteCustomRowProps;
};

export type TCustomLayoutChart = {
    variant?: "bar" | "pie" | "lines" | "area" | "donut";
    title?: string; // unsure if this is going to be used since there is a widget name
    series: {
        data_ref: string; // a field from custom_data
        color?: string;
    }[];
};

/**
 * For simplicity we model a Card as a Table containing 1 cell.
 * This way we avoid introducing a new custom model.
 */
export type TCustomLayoutCard = {
    columns: [TRemoteCustomLayoutEntry];
    row_props?: TRemoteCustomRowProps;
};

export type TRemoteCustomDatum = { id: number | string } & Record<
    string,
    number | string | boolean | null
>;

export type TRemoteCustomData = TRemoteCustomDatum[];

// note: not consumed anywhere so far
type TLayoutSettings = {
    settings?: {
        show_header?: boolean;
        text_wrap?: "truncate" | "break";
    };
};

export type TCustomMetaTable = TLayoutSettings & {
    layout_type: "table";
    layout: TCustomLayoutTable;
};

export type TCustomMetaChart = TLayoutSettings & {
    layout_type: "chart";
    layout: TCustomLayoutChart;
};

export type TCustomMetaCard = TLayoutSettings & {
    layout_type: "card";
    layout?: TCustomLayoutCard;
};

export type TRemoteCustomMeta =
    | TCustomMetaTable
    | TCustomMetaChart
    | TCustomMetaCard;

export interface TBaseRemoteRawWidget<T = undefined> {
    id: number;
    name: string;
    slug: TWidgetSlug;
    icon: string;
    status: ERemoteWidgetStatus;
    short_description: string;
    description: string;
    template: TRemoteWidgetTemplate;
    endpoint_header: Record<string, unknown>;
    format_structure: TRemoteFormatStructure<T>;
    custom_data: JSONValue;
    custom_meta: JSONValue;
    settings: TRemoteWidgetSetting[];
    max_per_view: number | null;
    refresh_interval: number | null;
    sort_order: number;
    featured: boolean;
    hide_in_library: boolean;
    categories: TRemoteWidgetCategory[];
}

export interface IRemoteStaticDataWidget<T> extends TBaseRemoteRawWidget<T> {
    data_type: EWidgetData.Static;
    endpoint_url: null;
}

export interface IRemoteApiDataWidget<T> extends TBaseRemoteRawWidget<T> {
    data_type: EWidgetData.External | EWidgetData.Internal;
    endpoint_url: string;
}

export type IRemoteRawWidget<T = undefined> =
    | IRemoteApiDataWidget<T>
    | IRemoteStaticDataWidget<T>;

export type IRemoteWidget<T = undefined> = Omit<
    IRemoteRawWidget<T>,
    "custom_data" | "custom_meta"
> & {
    custom_data: TRemoteCustomData | undefined;
    custom_meta: TRemoteCustomMeta | undefined;
};

export type TRemoteUserViewWidgetSetting = {
    widget_setting: {
        setting: {
            name: string;
            slug: EWidgetSettingsRegistry;
            setting_type: string;
        };
        sort_order: number;
        default_toggle_value: boolean | null;
    };
    tags: TRemoteTagReadOnly[];
    toggle_value: boolean | null;
};

export type TRemoteBaseUserViewWidget = {
    sort_order: number;
};

export type TRemoteRawUserViewWidget<T = unknown> =
    TRemoteBaseUserViewWidget & {
        id: number;
        hash: string;
        name: string;
        widget: IRemoteRawWidget<T>;
        settings: TRemoteUserViewWidgetSetting[];
    };

export type TRemoteUserViewWidget<T = unknown> = Omit<
    TRemoteRawUserViewWidget,
    "widget"
> & {
    widget: IRemoteWidget<T>;
};

export type TRemoteBaseUserView = {
    name: string;
    slug?: string;
    icon?: string | null;
    description: string;
    is_subscribed: boolean;
    is_system_view: boolean;
    is_smart: boolean;
    sort_order: number;
    updated_at: string; // eg. 2022-06-17T10:49:43.659579Z
};

export type TRemoteUserViewMeta = {
    id: number;
    hash: string;
    name: string;
    slug?: string;
    icon: string | null;
};

export type TRemoteUserViewPreview = TRemoteUserViewMeta & TRemoteBaseUserView;

// Full view data before data validation
export type TRemoteRawUserView = TRemoteBaseUserView & {
    id: number;
    hash: string;
    icon: string | null;
    widgets: TRemoteRawUserViewWidget[];
    keywords: {
        id: number;
        name: string;
        tag: TRemoteTagReadOnly;
    }[];
    max_widgets: number;
};

export type TRemoteUserView = Omit<TRemoteRawUserView, "widgets"> & {
    widgets: TRemoteUserViewWidget[];
};

export type TRemoteViewCategory = {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
    featured: boolean;
};

export type TRemoteWidgetCategory = {
    id: number;
    name: string;
    slug: string;
    featured: boolean;
    sort_order: number;
};

export type TRemoteWidgetMini = Pick<
    TBaseRemoteRawWidget,
    | "id"
    | "name"
    | "slug"
    | "icon"
    | "short_description"
    | "description"
    | "template"
    | "max_per_view"
    | "refresh_interval"
    | "sort_order"
    | "featured"
    | "categories"
>;

/**
 * "Draft" types are those used to build views locally
 */

export type TRemoteWidgetSettingDraft = {
    setting: {
        slug: string;
    };
    sort_order: number;
};

export type TRemoteWidgetMinValidate = {
    slug: string;
    settings: TRemoteWidgetSettingDraft[];
};

export type TRemoteUserViewWidgetSettingDraft = TRemoteUserViewWidgetSetting;

export type TRemoteUserViewWidgetDraft = TRemoteBaseUserViewWidget & {
    hash?: string;
    widget: TRemoteWidgetMinValidate;
    settings: TRemoteUserViewWidgetSettingDraft[];
};

export type TRemoteUserViewDraft = TRemoteBaseUserView & {
    widgets: TRemoteUserViewWidgetDraft[];
    keywords: {
        id: number;
    }[];
};

/**
 * Query types
 */

export type TViewsRequest = {
    category?: string;
    limit?: number;
    page?: number;
    sortBy?: EItemsSortBy;
    // needed to add lang to rtk key
    lang: EnumLanguageCode;
} | void;
export type TViewsRawResponse = TPagination & {
    results: ReadonlyArray<TRemoteUserViewPreview>;
};
export type TViewsResponse = TViewsRawResponse;

export type TSubscribedViewsRequest = {
    // needed to add lang to rtk key
    lang: EnumLanguageCode;
};
export type TSubscribedViewsRawResponse = ReadonlyArray<TRemoteUserViewPreview>;
export type TSubscribedViewsResponse = TSubscribedViewsRawResponse;

export type TViewCategoriesRequest = void;
export type TViewCategoriesRawResponse = ReadonlyArray<TRemoteViewCategory>;
export type TViewCategoriesResponse = TViewCategoriesRawResponse;

export type TViewByIdRequest = { id: number };
export type TViewByIdRawResponse = Readonly<TRemoteRawUserView>;
export type TViewByIdResponse = Readonly<TRemoteUserView>;

export type TViewByHashOrSlugRequest = { hash?: string } | { slug?: string };
export type TViewByHashOrSlugRawResponse = Readonly<TRemoteRawUserView>;
export type TViewByHashOrSlugResponse = Readonly<TRemoteUserView>;

export type TViewForWalletRequest = void;
export type TViewForWalletRawResponse = Readonly<TRemoteRawUserView>;
export type TViewForWalletResponse = Readonly<TRemoteUserView>;

export type TSaveViewAsRequest = TRemoteUserViewDraft;
export type TSaveViewAsResponse = TRemoteUserView;

export type TSaveViewRequest = { id: number; body: TRemoteUserViewDraft };
export type TSaveViewResponse = TRemoteUserView;

export type TSaveViewMetaRequest = {
    id: number;
    body: Partial<TRemoteBaseUserView>;
};
export type TSaveViewMetaResponse = TRemoteUserViewPreview;

export type TDeleteViewRequest = { id: number };
export type TDeleteViewResponse = null;

export type TSubscribeViewRequest = { id: number };
export type TSubscribeViewResponse = null;

export type TWidgetsRequest = {
    sortBy?: EItemsSortBy;
    search?: string;
    limit?: number;
    page?: number;
} | void;
export type TWidgetsRawResponse = TPagination & {
    results: ReadonlyArray<TRemoteWidgetMini>;
};
export type TWidgetsResponse = TWidgetsRawResponse;

export type TWidgetByIdRequest = { id: number };
export type TWidgetByIdRawResponse = Readonly<IRemoteRawWidget>;
export type TWidgetByIdResponse = Readonly<IRemoteWidget>;

export type TWidgetsCategoryRequest = {
    page?: number;
    limit?: number;
} | void;
export type TWidgetsCategoryResponse = TPagination & {
    results: ReadonlyArray<TRemoteWidgetCategory>;
};
