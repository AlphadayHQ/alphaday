/**
 * for views (and perhaps all user data) we exceptionally use types as defined
 * by the backend API, so these are just aliases of the types from services/
 */
import { ReactNode } from "react";
import {
    TRemoteUserView,
    TRemoteUserViewWidget,
    TRemoteUserViewWidgetSetting,
    IRemoteWidget,
    TRemoteWidgetSetting,
    TRemoteUserViewDraft,
    TRemoteSourceData,
    TRemoteBaseUserView,
    TRemoteUserViewPreview,
} from "src/api/services";
import { TKeyword } from "src/api/types/primitives";

export type TWidgetSetting = TRemoteWidgetSetting;

export type TWidget = IRemoteWidget;

export type TUserViewWidgetSetting = TRemoteUserViewWidgetSetting;

export type TUserViewWidget<T = unknown> = TRemoteUserViewWidget<T>;

export type TUserView = Omit<TRemoteUserView, "keywords"> & {
    keywords: TKeyword[];
};

export type TBaseUserView = TRemoteBaseUserView;

export type TUserViewPreview = TRemoteUserViewPreview;

export type TUserViewDraft = TRemoteUserViewDraft;

export type TSourceData = TRemoteSourceData;

export type TCounterData = {
    date: string;
    announcement: string;
    block_height?: string;
    items?: {
        title: ReactNode;
        value: ReactNode;
    }[][];
};

/**
 * Base type for cached views
 */
export type TCachedViewMeta = {
    lastSynced: string | undefined; // iso string
    lastModified: string | undefined; // iso string
    isReadOnly?: boolean;
    data: Partial<TUserView>;
};

export type TCachedView = TCachedViewMeta & {
    data: TUserView;
};

export type TSubscribedView = TCachedViewMeta & {
    data: TUserViewPreview;
};

export enum EViewDialogState {
    Closed,
    Save,
    Remove,
    Busy,
    Error,
    LimitReached,
}

export enum EWalletViewState {
    Ready = "ready",
    Fetching = "fetching",
    NoTags = "noTags", // Probably the wallet is empty
    Authenticated = "authenticated",
    Disabled = "disabled",
}
