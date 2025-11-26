import { FC, FormEvent, useCallback, useState } from "react";
import {
    BoardPreview,
    ModuleLoader,
    SortBy,
    TabsBar,
    twMerge,
} from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    EItemsSortBy,
    TRemoteUserViewPreview,
    TRemoteWidgetCategory,
} from "src/api/services";
import { TUserViewPreview, TViewMeta } from "src/api/types";
import { validateEthAddr } from "src/api/utils/accountUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { generateSortOptions } from "src/api/utils/sortOptions";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import {
    ETranslationValues,
    translateLabels,
    TTranslationValues,
} from "src/api/utils/translationUtils";
import { ReactComponent as EmptySVG } from "src/assets/icons/empty.svg";
import { ReactComponent as PlusSVG } from "src/assets/icons/plus.svg";

const DEFAULT_TAB_OPTION = {
    label: "All",
    value: "all",
};

const NoBoards = ({ msg }: { msg: string }) => (
    <div className="w-full flex flex-col items-center pt-14">
        <div>
            <EmptySVG className="w-10 h-10 text-primaryVariant100" />
        </div>
        <p className="mt-4 font-normal text-primaryVariant100 text-center px-4">
            {msg}
        </p>
    </div>
);

const BoardPreviewWrap: FC<{
    view: TRemoteUserViewPreview;
    selectedViewId: number | undefined;
    isAuthenticated: boolean;
    isCustomBoard?: boolean;
    onSelectView: (viewId: number) => void;
    onRemoveView?: ({
        id,
        isReadOnly,
        hash,
        slug,
        isWalletView,
    }: TViewMeta) => void;
    onEditView?: (viewId: number, viewHash: string) => void;
    onBoardPin?: (view: Omit<TUserViewPreview, "id">, id: number) => void;
}> = ({
    view,
    selectedViewId,
    isAuthenticated,
    isCustomBoard,
    onEditView,
    onSelectView,
    onRemoveView,
    onBoardPin,
}) => (
    <div className="w-full">
        <BoardPreview
            previewImg={view.icon || ""}
            title={
                validateEthAddr(view.name)
                    ? truncateWithEllipsis(view.name, 10)
                    : view.name
            }
            padding="none"
            pinned={view.is_subscribed}
            description={view.description}
            active={selectedViewId === view.id}
            isAuthenticated={isAuthenticated}
            onClick={() => onSelectView(view.id)}
            onRemove={
                isCustomBoard
                    ? () =>
                          onRemoveView?.({
                              id: view.id,
                              isReadOnly: false,
                              hash: view.hash,
                              slug: view.slug,
                              isWalletView: view.is_smart,
                          })
                    : undefined
            }
            onEdit={
                onEditView ? () => onEditView(view.id, view.hash) : undefined
            }
            onPin={
                !isCustomBoard ? () => onBoardPin?.(view, view.id) : undefined
            }
        />
    </div>
);

interface IMobileBoardsList {
    selectedCategory: string | undefined;
    boards: ReadonlyArray<TRemoteUserViewPreview> | undefined;
    subscribedViews: ReadonlyArray<TRemoteUserViewPreview> | undefined;
    categories: ReadonlyArray<TRemoteWidgetCategory> | undefined;
    selectedViewId: number | undefined;
    isAuthenticated: boolean;
    sortBy: EItemsSortBy;
    isFetching: boolean;
    onSortBy(sort: string): void;
    onSelectView: (viewId: number) => void;
    onSubscribeView: (viewId: number) => void;
    onUnsubscribeView: (viewId: number) => void;
    onCategorySelect: (category: string | undefined) => void;
    onCreateEmptyBoard: () => void;
    handlePaginate: (type: "next" | "previous") => void;
    onRemoveView: ({
        id,
        isReadOnly,
        hash,
        slug,
        isWalletView,
    }: TViewMeta) => void;
    onEditView: (viewId: number, viewHash: string) => void;
}

const MobileBoardsList: FC<IMobileBoardsList> = ({
    sortBy,
    boards,
    categories,
    selectedCategory,
    selectedViewId,
    onSortBy,
    onSelectView,
    onSubscribeView,
    onUnsubscribeView,
    onCategorySelect,
    handlePaginate,
    onRemoveView,
    onCreateEmptyBoard,
    isAuthenticated,
    subscribedViews,
    onEditView,
    isFetching,
}) => {
    const sortOptions = generateSortOptions();
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<"custom" | "all">("custom");

    const customBoards = subscribedViews
        ?.filter((board) => !board.is_system_view)
        .sort((a, b) => a.sort_order - b.sort_order);

    const allBoards = boards
        ?.filter((board) => board.is_system_view)
        .map((v) => ({
            ...v,
            is_subscribed: !!subscribedViews?.some((sv) => sv.id === v.id),
        }));

    const tabOptions =
        categories?.map((cat) =>
            cat.slug === "default"
                ? DEFAULT_TAB_OPTION
                : {
                      label: cat.name,
                      value: cat.slug,
                  }
        ) || [];

    const handleScrollEvent = useCallback(
        ({ currentTarget }: FormEvent<HTMLElement>) => {
            if (shouldFetchMoreItems(currentTarget)) {
                handlePaginate("next");
            }
        },
        [handlePaginate]
    );

    const onBoardPin = useCallback(
        (view: Omit<TUserViewPreview, "id">, id: number) => {
            if (isAuthenticated) {
                if (view.is_subscribed) {
                    onUnsubscribeView(id);
                } else {
                    onSubscribeView(id);
                }
            } else {
                toast("Sign up to pin boards and enjoy more customizations", {
                    type: EToastRole.Error,
                });
            }
        },
        [isAuthenticated, onSubscribeView, onUnsubscribeView]
    );

    const handleCreateEmptyBoard = useCallback(() => {
        if (isAuthenticated) {
            onCreateEmptyBoard();
        }
    }, [isAuthenticated, onCreateEmptyBoard]);

    const sortByKey =
        Object.keys(EItemsSortBy)[Object.values(EItemsSortBy).indexOf(sortBy)];

    const selectedSortValue =
        Object.keys(ETranslationValues).indexOf(sortByKey.toLowerCase()) !== -1
            ? translateLabels(sortByKey.toLowerCase() as TTranslationValues, {
                  isKey: true,
              })
            : sortByKey;

    if (customBoards === undefined || allBoards === undefined) {
        return <ModuleLoader $height="100%" />;
    }

    return (
        <div
            data-testid="mobile-boards-list"
            className="w-full h-full overflow-y-auto overscroll-contain bg-background"
            onScroll={handleScrollEvent}
        >
            {/* Section Tabs */}
            <div className="sticky top-0 z-10 bg-background border-b border-borderLine">
                <div className="flex w-full">
                    <button
                        type="button"
                        onClick={() => setActiveSection("custom")}
                        className={twMerge(
                            "flex-1 py-4 text-center fontGroup-highlight border-b-2 transition-colors",
                            activeSection === "custom"
                                ? "border-accentVariant100 text-primary"
                                : "border-transparent text-primaryVariant100"
                        )}
                    >
                        My Boards
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection("all")}
                        className={twMerge(
                            "flex-1 py-4 text-center fontGroup-highlight border-b-2 transition-colors",
                            activeSection === "all"
                                ? "border-accentVariant100 text-primary"
                                : "border-transparent text-primaryVariant100"
                        )}
                    >
                        All Boards
                    </button>
                </div>
            </div>

            {/* Custom Boards Section */}
            {activeSection === "custom" && (
                <div className="px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <span className="fontGroup-highlightSemi text-primary">
                                {t("navigation.boardsLibrary.customBoardsTitle")}
                            </span>
                            <span className="text-sm text-primaryVariant100 mt-1">
                                {isAuthenticated
                                    ? t("navigation.boardsLibrary.customBoardsDescriptionWithAuth")
                                    : t("navigation.boardsLibrary.customBoardsDescription")}
                            </span>
                        </div>
                        {isAuthenticated && (
                            <button
                                type="button"
                                onClick={handleCreateEmptyBoard}
                                className="flex justify-center items-center w-8 h-8 rounded-full border border-solid border-primary hover:border-accentVariant100 hover:text-primary"
                                title="Create an empty board and add widgets"
                                data-testid="create-empty-board"
                            >
                                <PlusSVG className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {customBoards.length === 0 && isAuthenticated ? (
                            <NoBoards msg="You have not created any custom boards" />
                        ) : (
                            customBoards.map((view) => (
                                <BoardPreviewWrap
                                    key={view.id}
                                    view={view}
                                    selectedViewId={selectedViewId}
                                    isAuthenticated={isAuthenticated}
                                    isCustomBoard
                                    onSelectView={onSelectView}
                                    onRemoveView={onRemoveView}
                                    onEditView={onEditView}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* All Boards Section */}
            {activeSection === "all" && (
                <div className="px-4 py-4">
                    <div className="flex flex-col gap-4 mb-4">
                        <TabsBar
                            options={tabOptions}
                            onChange={(name) => {
                                onCategorySelect(name);
                            }}
                            selectedOption={
                                selectedCategory
                                    ? {
                                          label: selectedCategory,
                                          value: selectedCategory,
                                      }
                                    : DEFAULT_TAB_OPTION
                            }
                        />
                        <div className="flex justify-between items-center">
                            <span className="fontGroup-highlightSemi text-primary">
                                System Boards
                            </span>
                            <SortBy
                                selected={selectedSortValue}
                                onSortBy={onSortBy}
                                options={sortOptions}
                                label={t("navigation.sortBy")}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isFetching && allBoards.length === 0 ? (
                            <ModuleLoader $height="200px" />
                        ) : allBoards.length === 0 ? (
                            <NoBoards msg="No boards found in this category" />
                        ) : (
                            allBoards.map((view) => (
                                <BoardPreviewWrap
                                    key={view.id}
                                    view={view}
                                    selectedViewId={selectedViewId}
                                    isAuthenticated={isAuthenticated}
                                    onSelectView={onSelectView}
                                    onBoardPin={onBoardPin}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileBoardsList;
