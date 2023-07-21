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

export type TRemoteFormatStructure<T> = {
    data?: T;
    columns?: TRemoteFormatStructureColumns[];
};

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

export enum ECustomDefaultIcons {
    SignalSuccess = "signal_success",
    SignalWarning = "signal_warning",
    SignalDanger = "signal_danger",
    ExternalLink = "external_link",
}

export type TRemoteCustomIcon =
    | {
          type: "external";
          url: "string";
          position: "left" | "right";
      }
    | {
          type: "internal";
          id: ECustomDefaultIcons;
          position?: "left" | "right";
      };

export type TRemoteCustomDataField =
    | {
          name?: string;
          value: string | undefined | null;
          type: "string";
          icon?: TRemoteCustomIcon;
      }
    | {
          name?: string;
          value: number | undefined | null;
          type: "number";
          icon?: TRemoteCustomIcon;
      }
    | {
          name?: string;
          value: boolean | undefined | null;
          type: "boolean";
          icon?: TRemoteCustomIcon;
      }
    | {
          name?: string;
          value: string[] | undefined | null;
          type: "array";
          icon?: TRemoteCustomIcon;
      };

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

export type TRemoteCustomExtraStyle = {
    capitalize?: boolean;
    signed_number?: boolean;
    hide_in_header?: boolean;
    hidden?: boolean;
    icon?: TRemoteCustomIcon;
};

export type TCustomLayoutEntry = {
    name: string;
    title: string; // eg. the column name displayed in tables
    desc?: string;
    template?: string; // eg "{{field_name}}" or "{{field_name_a}} {{field_name_b}}"
    format?: TRemoteFormat;
    extra_style?: TRemoteCustomExtraStyle;
    width: number;
    uri_ref?: string; // should point to data field entry
    image_uri_ref?: string; // should point to data field entry
};

export type TCustomRowProps = {
    clickable?: boolean;
    uri_ref?: string;
};

// tables consume data from either data.items or from an API
export type TCustomLayoutTable = {
    layout_type: "table";
    columns: TCustomLayoutEntry[];
    row_props?: TCustomRowProps;
};

export type TCustomLayoutChart = {
    layout_type: "chart";
    variant?: "bar" | "pie" | "lines"; // etc
    data: {
        series_ref: string;
        label_ref?: string;
        title?: string;
        x_label?: string;
        y_label?: string;
        color?: string;
        // possibly more styling properties
    }[];
};

export type TCustomLayoutDefault = {
    layout_type: "default";
    layout: Record<string, TCustomLayoutEntry>;
};

export type TRemoteCustomData = {
    fields?: Record<string, TRemoteCustomDataField>;
    items?: Record<string, TRemoteCustomDataField>[]; // typically used in table widgets
    data_sets?: Record<string, [number, number][]>;
};

export type TRemoteCustomMeta = {
    settings?: {
        show_header?: boolean;
        text_wrap?: "truncate" | "break";
    };
    layout: TCustomLayoutTable | TCustomLayoutChart | TCustomLayoutDefault;
};

export interface TBaseRemoteWidget<T = undefined> {
    id: number;
    name: string;
    slug: TWidgetSlug;
    icon: string;
    status: ERemoteWidgetStatus;
    short_description: string;
    description: string;
    template: TRemoteWidgetTemplate;
    endpoint_header: Record<string, unknown>;
    format_structure: TRemoteFormatStructure<T>; // deprecated
    custom_data: TRemoteCustomData | Record<string, never>;
    custom_meta: TRemoteCustomMeta | Record<string, never>;
    settings: TRemoteWidgetSetting[];
    max_per_view: number | null;
    refresh_interval: number | null;
    sort_order: number;
    featured: boolean;
    hide_in_library: boolean;
    categories: TRemoteWidgetCategory[];
}

export interface IRemoteStaticDataWidget<T> extends TBaseRemoteWidget<T> {
    data_type: EWidgetData.Static;
    endpoint_url: null;
}

export interface IRemoteApiDataWidget<T> extends TBaseRemoteWidget<T> {
    data_type: EWidgetData.External | EWidgetData.Internal;
    endpoint_url: string;
}

export type IRemoteWidget<T = undefined> =
    | IRemoteApiDataWidget<T>
    | IRemoteStaticDataWidget<T>;

export type TRemoteUserViewWidgetSetting = {
    setting: {
        name: string;
        slug: EWidgetSettingsRegistry;
        setting_type: string;
    };
    tags: TRemoteTagReadOnly[];
    toggle_value: boolean;
};

export type TRemoteBaseUserViewWidget = {
    sort_order: number;
};

export type TRemoteUserViewWidget<T = unknown> = TRemoteBaseUserViewWidget & {
    id: number;
    hash: string;
    name: string;
    widget: IRemoteWidget<T>;
    settings: TRemoteUserViewWidgetSetting[];
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

export type TRemoteUserView = TRemoteBaseUserView & {
    id: number;
    hash: string;
    icon: string | null;
    widgets: TRemoteUserViewWidget[];
    keywords: {
        id: number;
        name: string;
        tag: TRemoteTagReadOnly;
    }[];
    max_widgets: number;
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

export type TRemoteUserViewWidgetSettingDraft = {
    setting: {
        slug: string;
    };
    tags: {
        name: string;
        slug: string;
    }[];
    toggle_value: boolean;
};

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
} | void;
export type TViewsRawResponse = TPagination & {
    results: ReadonlyArray<TRemoteUserViewPreview>;
};
export type TViewsResponse = TViewsRawResponse;

export type TSubscribedViewsRequest = void;
export type TSubscribedViewsRawResponse = ReadonlyArray<TRemoteUserViewPreview>;
export type TSubscribedViewsResponse = TSubscribedViewsRawResponse;

export type TViewCategoriesRequest = void;
export type TViewCategoriesRawResponse = ReadonlyArray<TRemoteViewCategory>;
export type TViewCategoriesResponse = TViewCategoriesRawResponse;

export type TViewByIdRequest = { id: number };
export type TViewByIdRawResponse = Readonly<TRemoteUserView>;
export type TViewByIdResponse = TViewByIdRawResponse;

export type TViewByHashOrSlugRequest = { hash?: string } | { slug?: string };
export type TViewByHashOrSlugResponse = TViewByIdResponse;

export type TViewForWalletRequest = void;
export type TViewForWalletResponse = TViewByIdResponse;

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

export type TWidgetsRequest = { sortBy?: EItemsSortBy } | void;
export type TWidgetsRawResponse = ReadonlyArray<IRemoteWidget>;
export type TWidgetsResponse = TWidgetsRawResponse;

export type TWidgetByIdRequest = { id: number };
export type TWidgetByIdRawResponse = Readonly<IRemoteWidget>;
export type TWidgetByIdResponse = TWidgetByIdRawResponse;

export type TWidgetsCategoryRequest = {
    page?: number;
    limit?: number;
} | void;
export type TWidgetsCategoryResponse = TPagination & {
    results: ReadonlyArray<TRemoteWidgetCategory>;
};
