import { FC } from "react";
import BookmarkSVG from "src/assets/svg/bookmark.svg?react";
import BookmarkedSVG from "src/assets/svg/bookmarked.svg?react";
import { twMerge } from "tailwind-merge";

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
                title={
                    isAuthenticated ? "Bookmark this item" : ""
                    // TODO (xavier-charles): : globalMessages.callToAction.signUpToBookmark("items")
                }
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
