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

    const handleScrollEvent = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

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

    return (
        <div
            data-testid="boards-library"
            className={twMerge(
                "bg-backgroundVariant900 transition-all h-0 ease-in-out duration-300 [&>*]:invisible",
                isBoardsLibOpen &&
                    "h-[500px] max-h-[500px] [&>*]:visible [&>*]:delay-300"
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
            <div className="h-80">
                {customBoards === undefined || allBoards === undefined ? (
                    <ModuleLoader $height="100%" />
                ) : (
                    <div className="flex flex-row justify-between">
                        <div className="w-full p-6 max-w-[405px] border-r border-solid border-btnRingVariant500">
                            <div className="flex fontGroup-highlightSemi p-[5px_15px] text-primary">
                                Custom Boards
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        if (isAuthenticated) {
                                            onCreateEmptyBoard();
                                        }
                                    }}
                                    className={twMerge(
                                        "flex justify-center items-center ml-[10px] w-5 h-5 rounded-full border border-solid border-primary cursor-pointer hover:border-btnRingVariant100 hover:text-primary",
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
                            <div className="h-[316px]">
                                <ScrollBar onScroll={handleScrollEvent}>
                                    <div className="flex box-border flex-row flex-wrap h-[316px] w-full">
                                        {customBoards.length === 0 ? (
                                            <p className="ml-[15px] pr-3 font-normal text-primary">
                                                {isAuthenticated
                                                    ? "You have not created any custom boards."
                                                    : "Connect and verify your wallet to see your custom boards"}
                                            </p>
                                        ) : (
                                            customBoards.map(
                                                ({
                                                    id,
                                                    hash,
                                                    slug,
                                                    ...view
                                                }) => (
                                                    <BoardPreview
                                                        key={id}
                                                        previewImg={
                                                            view.icon || ""
                                                        }
                                                        title={view.name}
                                                        padding="none"
                                                        pinned={
                                                            view.is_subscribed
                                                        }
                                                        active={
                                                            selectedViewId ===
                                                            id
                                                        }
                                                        isAuthenticated={
                                                            isAuthenticated
                                                        }
                                                        onClick={() => {
                                                            onSelectView(id);
                                                        }}
                                                        onRemove={() => {
                                                            onRemoveView({
                                                                id,
                                                                isReadOnly:
                                                                    false,
                                                                hash,
                                                                slug,
                                                                isWalletView:
                                                                    view.is_smart,
                                                            });
                                                        }}
                                                        onEdit={() =>
                                                            onEditView(id, hash)
                                                        }
                                                    />
                                                )
                                            )
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
                            <div className="h-[316px]">
                                <ScrollBar onScroll={handleScrollEvent}>
                                    <div className="flex box-border flex-row flex-wrap h-[316px] w-full">
                                        {allBoards.length === 0 ? (
                                            <p className="ml-[15px] font-normal text-primary">
                                                No boards found in this
                                                category.
                                            </p>
                                        ) : (
                                            allBoards.map(({ id, ...view }) => (
                                                <div
                                                    key={id}
                                                    className="w-min max-w-min m-[10px]"
                                                >
                                                    <BoardPreview
                                                        key={id}
                                                        previewImg={
                                                            view.icon || ""
                                                        }
                                                        title={
                                                            validateEthAddr(
                                                                view.name
                                                            )
                                                                ? truncateWithEllipsis(
                                                                      view.name,
                                                                      10
                                                                  )
                                                                : view.name
                                                        }
                                                        description={
                                                            view.description
                                                        }
                                                        pinned={
                                                            view.is_subscribed
                                                        }
                                                        active={
                                                            selectedViewId ===
                                                            id
                                                        }
                                                        isAuthenticated={
                                                            isAuthenticated
                                                        }
                                                        onClick={() => {
                                                            onSelectView(id);
                                                        }}
                                                        onPin={() => {
                                                            onBoardPin(
                                                                view,
                                                                id
                                                            );
                                                        }}
                                                    />
                                                </div>
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
