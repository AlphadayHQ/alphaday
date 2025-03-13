import { FC } from "react";
import { ReactComponent as BookmarkSVG } from "src/assets/svg/bookmark.svg";
import { ReactComponent as BookmarkedSVG } from "src/assets/svg/bookmarked.svg";
import { twMerge } from "tailwind-merge";
// import globalMessages from "src/globalMessages";

interface IBookmark {
    isAuthenticated: boolean | undefined;
    onBookmark: (() => MaybeAsync<void>) | undefined;
    bookmarked: boolean | undefined;
    showSpacer?: boolean;
    authenticatedOnly?: boolean;
    className?: string;
}
const ItemBookmark: FC<IBookmark> = ({
    isAuthenticated,
    authenticatedOnly = false,
    onBookmark,
    bookmarked,
    showSpacer = true,
    className,
}) => {
    if (authenticatedOnly && !isAuthenticated) {
        return null;
    }
    return (
        <>
            {showSpacer && <span className="spacer self-center mx-2">•</span>}
            <span
                className={twMerge("bookmark self-end", className)}
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                    const handler = async () => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onBookmark) await onBookmark();
                    };
                    handler().catch(() => ({}));
                }}
                title={isAuthenticated ? "Bookmark this item" : ""}
            >
                {bookmarked ? (
                    <BookmarkedSVG className={className} />
                ) : (
                    <BookmarkSVG className={className} />
                )}
            </span>
        </>
    );
};

export default ItemBookmark;
