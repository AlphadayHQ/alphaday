import { FC, FormEvent, useCallback } from "react";
import {
    BoardPreview,
    ModuleLoader,
    ScrollBar,
    SortBy,
    TabsBar,
    twMerge,
} from "@alphaday/ui-kit";
import {
    EItemsSortBy,
    TRemoteUserViewPreview,
    TRemoteWidgetCategory,
} from "src/api/services";
import { TUserViewPreview, TViewMeta } from "src/api/types";
import { validateEthAddr } from "src/api/utils/accountUtils";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import { getSortOptionsArray } from "src/api/utils/sortOptions";
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { ReactComponent as CloseSVG } from "src/assets/icons/close2.svg";
import { ReactComponent as EmptySVG } from "src/assets/icons/empty.svg";
import { ReactComponent as PlusSVG } from "src/assets/icons/plus.svg";

const DEFAULT_TAB_OPTION = {
    label: "All",
    value: "all",
};

const NoBoards = ({ msg }: { msg: string }) => (
    <div className="w-full h-full flex flex-col items-center pt-14">
        <div>
            <EmptySVG className="w-10 h-10 text-primaryVariant100" />
        </div>

        <p className="mt-4 font-normal text-primaryVariant100 text-center">
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
    <div className="w-min max-w-min">
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

interface IBoardsLibrary {
    selectedCategory: string | undefined;
    boards: ReadonlyArray<TRemoteUserViewPreview> | undefined;
    subscribedViews: ReadonlyArray<TRemoteUserViewPreview> | undefined;
    categories: ReadonlyArray<TRemoteWidgetCategory> | undefined;
    selectedViewId: number | undefined;
    isBoardsLibOpen: boolean;
    isAuthenticated: boolean;
    sortBy: EItemsSortBy;
    onSortBy(sort: string): void;
    onToggleBoardsLib: () => void;
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

const BoardsLibrary: FC<IBoardsLibrary> = ({
    sortBy,
    boards,
    categories,
    selectedCategory,
    selectedViewId,
    onToggleBoardsLib,
    onSortBy,
    onSelectView,
    onSubscribeView,
    onUnsubscribeView,
    onCategorySelect,
    handlePaginate,
    onRemoveView,
    isBoardsLibOpen,
    onCreateEmptyBoard,
    isAuthenticated,
    subscribedViews,
    onEditView,
}) => {
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

    return (
        <div
            data-testid="boards-library"
            className={twMerge(
                "bg-backgroundVariant100 rounded-xl transition-all max-h-0 ease-in-out duration-300 [&>*]:invisible mx-5",
                isBoardsLibOpen &&
                    "max-h-[500px] [&>*]:visible [&>*]:delay-300  mb-3"
            )}
        >
            <div className="flex justify-between items-center p-4 pb-0">
                <div className="meta">
                    <div className="uppercase">Boards Library</div>
                    <div className="text-primaryVariant100">
                        Switch between boards to optimize your workflow, and pin
                        the ones you use most often.
                    </div>
                </div>
                <div
                    title="Close Boards Library"
                    className="cursor-pointer bg-backgroundVariant200 rounded-full border border-solid border-borderLine flex p-1.5 hover:bg-background"
                    tabIndex={0}
                    onClick={onToggleBoardsLib}
                    role="button"
                >
                    <CloseSVG className="w-3 h-3" />
                </div>
            </div>
            <div>
                {customBoards === undefined || allBoards === undefined ? (
                    <ModuleLoader $height="100%" />
                ) : (
                    <div className="flex flex-row justify-between mt-8">
                        <div className="w-full pl-4 pr-6 pb-0 max-w-[395px] border-r border-solid border-borderLine">
                            <div className="flex justify-between text-primary">
                                <span className="flex flex-col">
                                    <span className="fontGroup-highlightSemi">
                                        Custom Boards
                                    </span>
                                    <span className="text-primaryVariant100">
                                        {isAuthenticated
                                            ? "Create an empty board and add widgets"
                                            : "Connect and verify your wallet to create new boards and see your custom boards"}
                                    </span>
                                </span>
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleCreateEmptyBoard}
                                    className={twMerge(
                                        "flex justify-center items-center ml-[10px] w-5 h-5 self-center rounded-full border border-solid border-primary cursor-pointer hover:border-accentVariant100 hover:text-primary",
                                        !isAuthenticated &&
                                            "cursor-not-allowed hidden"
                                    )}
                                    title={
                                        isAuthenticated
                                            ? "Create an empty board and add widgets"
                                            : "Connect and verify your wallet to create new boards"
                                    }
                                    data-testid="create-empty-board"
                                >
                                    <PlusSVG />
                                </span>
                            </div>
                            <div className="h-[248px] mt-3">
                                <ScrollBar onScroll={handleScrollEvent}>
                                    <div className="flex box-border flex-row flex-wrap w-full gap-5">
                                        {customBoards.length === 0 &&
                                        isAuthenticated ? (
                                            <NoBoards msg="You have not created any custom boards" />
                                        ) : (
                                            customBoards.map((view) => (
                                                <BoardPreviewWrap
                                                    key={view.id}
                                                    view={view}
                                                    selectedViewId={
                                                        selectedViewId
                                                    }
                                                    isAuthenticated={
                                                        isAuthenticated
                                                    }
                                                    isCustomBoard
                                                    onSelectView={onSelectView}
                                                    onRemoveView={onRemoveView}
                                                    onEditView={onEditView}
                                                />
                                            ))
                                        )}
                                        {/* Add extra space after the list boards preview list */}
                                        {customBoards.length > 2 && (
                                            <div className="spacer py-2 w-full" />
                                        )}
                                    </div>
                                </ScrollBar>
                            </div>
                        </div>
                        <div className="w-full pr-4 pl-6 pb-0">
                            {/* pb-1 is used here to align the boards list to the custom boards list */}
                            <div className="flex pb-1">
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
                                <SortBy
                                    selected={sortByKey}
                                    onSortBy={onSortBy}
                                    options={getSortOptionsArray()}
                                />
                            </div>
                            <div className="h-[248px] mt-3">
                                <ScrollBar onScroll={handleScrollEvent}>
                                    <div className="flex box-border flex-row flex-wrap h-[248px] w-full gap-5">
                                        {allBoards.length === 0 ? (
                                            <NoBoards msg="No boards found in this category" />
                                        ) : (
                                            allBoards.map((view) => (
                                                <BoardPreviewWrap
                                                    key={view.id}
                                                    view={view}
                                                    selectedViewId={
                                                        selectedViewId
                                                    }
                                                    isAuthenticated={
                                                        isAuthenticated
                                                    }
                                                    onSelectView={onSelectView}
                                                    onBoardPin={onBoardPin}
                                                />
                                            ))
                                        )}
                                        <div className="spacer py-2 w-full" />
                                    </div>
                                </ScrollBar>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardsLibrary;
