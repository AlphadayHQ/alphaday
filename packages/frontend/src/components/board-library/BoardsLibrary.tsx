import { FC, FormEvent, useCallback } from "react";
import {
    BoardPreview,
    ModuleLoader,
    ScrollBar,
    TabButton,
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
import { truncateWithEllipsis } from "src/api/utils/textUtils";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import { ReactComponent as CloseSVG } from "src/assets/icons/close2.svg";
import { ReactComponent as PlusSVG } from "src/assets/icons/plus.svg";

const SORT_BUTTONS: { label: string; value: EItemsSortBy }[] = [
    {
        label: "(A-Z)",
        value: EItemsSortBy.Name,
    },
    {
        label: "Popular",
        value: EItemsSortBy.Popular,
    },
    {
        label: "New",
        value: EItemsSortBy.New,
    },
];

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
    category: string | undefined;
    boards: ReadonlyArray<TRemoteUserViewPreview> | undefined;
    subscribedViews: ReadonlyArray<TRemoteUserViewPreview> | undefined;
    categories: ReadonlyArray<TRemoteWidgetCategory> | undefined;
    selectedViewId: number | undefined;
    isBoardsLibOpen: boolean;
    isAuthenticated: boolean;
    sortBy: EItemsSortBy;
    onSortBy(sort: EItemsSortBy): void;
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
    category,
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

    return (
        <div
            data-testid="boards-library"
            className={twMerge(
                "bg-backgroundVariant900 transition-all max-h-0 ease-in-out duration-300 [&>*]:invisible",
                isBoardsLibOpen && "max-h-[500px] [&>*]:visible [&>*]:delay-300"
            )}
        >
            <div className="flex justify-between items-center p-[17px_25px] border-solid border-b border-btnRingVariant500 text-primaryVariant100 font-normal">
                <div className="meta">
                    <div className="fontGroup-highlightSemi uppercase">
                        Boards Library
                    </div>
                    <div className="fontGroup-normal">
                        Switch between boards to optimize your workflow, and pin
                        the ones you use most often.
                    </div>
                </div>
                <div
                    title="Close Boards Library"
                    className="cursor-pointer bg-btnBackgroundVariant100 rounded-full border border-solid border-btnRingVariant300 flex p-1.5 hover:bg-backgroundVariant500"
                    tabIndex={0}
                    onClick={onToggleBoardsLib}
                    role="button"
                >
                    <CloseSVG className="w-3 h-3" />
                </div>
            </div>
            <div className="flex justify-between items-center p-[17px_25px] border-solid border-b border-btnRingVariant500 text-primaryVariant100 font-normal">
                <div className="flex justify-around items-center [&>span]:mr-[7px]">
                    <span className="text-primary mr-3">Categories</span>
                    <span className="wrap">
                        <TabButton
                            variant="small"
                            uppercase={false}
                            open={category === undefined}
                            onClick={() => {
                                onCategorySelect(undefined);
                            }}
                        >
                            All
                        </TabButton>
                    </span>
                    {categories?.map((cat) => (
                        <span key={String(cat.slug)} className="wrap">
                            <TabButton
                                variant="small"
                                uppercase={false}
                                open={cat.slug === category}
                                onClick={() => {
                                    onCategorySelect(cat.slug);
                                }}
                            >
                                {cat.name}
                            </TabButton>
                        </span>
                    ))}
                </div>
                <div className="flex justify-around items-center [&>span]:mr-[7px]">
                    {SORT_BUTTONS.length > 0 && (
                        <>
                            <span className="text-primary mr-3">Sort by</span>
                            {SORT_BUTTONS.map((nav) => (
                                <span key={String(nav.value)} className="wrap">
                                    <TabButton
                                        variant="small"
                                        uppercase={false}
                                        open={nav.value === sortBy}
                                        onClick={() => onSortBy(nav.value)}
                                    >
                                        {nav.label}
                                    </TabButton>
                                </span>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="h-72">
                {customBoards === undefined || allBoards === undefined ? (
                    <ModuleLoader $height="100%" />
                ) : (
                    <div className="flex flex-row justify-between">
                        <div className="w-full p-[25px] pr-[15px] max-w-[395px] border-r border-solid border-btnRingVariant500">
                            <div className="flex fontGroup-highlightSemi py-[5px] text-primary">
                                Custom Boards
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleCreateEmptyBoard}
                                    className={twMerge(
                                        "flex justify-center items-center ml-[10px] w-[18px] h-[18px] rounded-full border border-solid border-primary cursor-pointer hover:border-btnRingVariant100 hover:text-primary",
                                        !isAuthenticated && "cursor-not-allowed"
                                    )}
                                    title={
                                        isAuthenticated
                                            ? "Create an empty board to be populated"
                                            : "Connect and verify your wallet to create new boards"
                                    }
                                    data-testid="create-empty-board"
                                >
                                    <PlusSVG />
                                </span>
                            </div>
                            <div className="h-[234px]">
                                <ScrollBar onScroll={handleScrollEvent}>
                                    <div className="flex box-border flex-row flex-wrap h-[234px] w-full gap-5 mt-[10px]">
                                        {customBoards.length === 0 ? (
                                            <p className="ml-[15px] pr-3 font-normal text-primary">
                                                {isAuthenticated
                                                    ? "You have not created any custom boards."
                                                    : "Connect and verify your wallet to see your custom boards"}
                                            </p>
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
                                        <div className="spacer py-2 w-full" />
                                    </div>
                                </ScrollBar>
                            </div>
                        </div>
                        <div className="w-full p-[25px]">
                            <div className="flex fontGroup-highlightSemi p-[5px_15px] text-primary">
                                All Boards
                            </div>
                            <div className="h-[234px]">
                                <ScrollBar onScroll={handleScrollEvent}>
                                    <div className="flex box-border flex-row flex-wrap h-[234px] w-full gap-5 mt-[10px]">
                                        {allBoards.length === 0 ? (
                                            <p className="ml-[15px] font-normal text-primary">
                                                No boards found in this
                                                category.
                                            </p>
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
