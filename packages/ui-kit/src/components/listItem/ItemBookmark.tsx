import { FC } from "react";
import { ReactComponent as BookmarkSVG } from "src/assets/svg/bookmark.svg";
import { ReactComponent as BookmarkedSVG } from "src/assets/svg/bookmarked.svg";
// import globalMessages from "src/globalMessages";

interface IBookmark {
    isAuthenticated: boolean | undefined;
    onBookmark: (() => MaybeAsync<void>) | undefined;
    bookmarked: boolean | undefined;
    showSpacer?: boolean;
    authenticatedOnly?: boolean;
}
const ItemBookmark: FC<IBookmark> = ({
    isAuthenticated,
    authenticatedOnly = false,
    onBookmark,
    bookmarked,
    showSpacer = true,
}) => {
    if (authenticatedOnly && !isAuthenticated) return <></>;
    return (
        <>
            {showSpacer && <span className="spacer">•</span>}
            <span
                className="bookmark"
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
                {bookmarked ? <BookmarkedSVG /> : <BookmarkSVG />}
            </span>
        </>
    );
};

export default ItemBookmark;
