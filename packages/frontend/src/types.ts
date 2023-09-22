import React, { lazy } from "react";
import {
    TUserViewWidget,
    TDynamicItem,
    TSourceData,
    TCounterData,
} from "src/api/types";
import { TAgendaItem } from "src/api/types/agenda";
import { ETemplateNameRegistry } from "./constants";

/**
 * For all widget templates, we use types as defined in the container's type args.
 *
 * This type is used to define the type of the data that is passed to its resulting widget's structure.
 * This way, the data can be handled properly in the templates container before the data is passed to the modules.
 * By default, this data type is unknown, but can be overridden in the template's container.
 */
export interface IModuleContainer<T = unknown> {
    showFullSize?: boolean;
    moduleData: TUserViewWidget<T>;
    toggleAdjustable(): void;
}

export type TTemplateSlug = `${Lowercase<ETemplateNameRegistry>}_template`;
export type TBaseWidgetSlug = `${Lowercase<ETemplateNameRegistry>}_widget`;
export type TWidgetSlug = `${string}_${TBaseWidgetSlug}` | TBaseWidgetSlug;

/**
 * Widget specific types
 *
 * Here we define types for each module containers
 */
export type TItem = TDynamicItem<string>;

export type TCategoryData = {
    name: string;
    description: string;
};

/**
 * When a template has a dynamic data type, we need to define the type of the data that would passed to the widget's structure here.
 * This way, the template component would be identified. `TItem` should suffice in most cases.
 * However, if the data type is known explicitly, then we should add it here as well
 */
export type TTemplateComponent =
    | React.FC<IModuleContainer<TCategoryData[][]>>
    | React.FC<IModuleContainer<TCounterData[]>>
    | React.FC<IModuleContainer<TSourceData[]>>
    | React.FC<IModuleContainer<TItem[][]>>
    | React.FC<IModuleContainer<TItem[]>>
    | React.FC<IModuleContainer<TAgendaItem[]>>
    | React.FC<IModuleContainer>;

export type TTemplatesDict = {
    [key in TTemplateSlug]: TTemplateComponent;
};

export const TEMPLATES_DICT: Partial<TTemplatesDict> = {
    blog_template: lazy(() => import("./containers/items/ItemsContainer")),
    dao_template: lazy(() => import("./containers/items/ItemsContainer")),
    discord_template: lazy(() => import("./containers/items/ItemsContainer")),
    forum_template: lazy(() => import("./containers/items/ItemsContainer")),
    news_template: lazy(() => import("./containers/items/ItemsContainer")),
    reddit_template: lazy(() => import("./containers/items/ItemsContainer")),
    sample_template: lazy(() => import("./containers/sample/SampleContainer")),
};

export type TFullSizeRoute = {
    [path in TTemplateSlug]?: {
        routes: string[];
    };
};

/**
 * Whats the big idea behind string indexes?
 * - it allows to use any path not just the ones defined in the enum
 * - it allows for ease of matching paths without an overkill of type comparisons.
 * - it allows for easy addition of new paths without the need to update the enum
 */
export const FULLSIZE_ROUTES_DICT: TFullSizeRoute = {
    calendar_template: {
        routes: ["/calendar", "/calendar/event/:eventId/:eventTitle"],
    },
};

/**
 * Full size widget routes.
 *
 * This should never be edited manually.
 * It is generated automatically from the FULLSIZE_ROUTES_DICT
 */
export const FULLSIZE_ROUTES = Object.entries(FULLSIZE_ROUTES_DICT).reduce(
    (routes, [template, props]) => [
        ...routes,
        ...(props?.routes.map((path) => ({ path, template })) ?? []),
    ],
    [] as { path: string; template: string }[]
);

/**
 * A flat array containing all full size routes
 */
export const FULLSIZE_ROUTES_ARR = Object.values(FULLSIZE_ROUTES).reduce(
    (acc, curr) => [...acc, curr.path],
    [] as string[]
);
