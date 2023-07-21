import SEO_CONFIG from "src/config/seo";

export const getBoardTitle = (
    boardName: string | undefined
): string | undefined => {
    if (
        boardName !== undefined &&
        !SEO_CONFIG.BOARDS_WITH_DEFAULT_CONFIG.includes(boardName.toLowerCase())
    ) {
        return `${boardName} - News, Information & Curated Research - Alphaday`;
    }
    return undefined;
};
export const getBoardDescription = (
    boardName: string | undefined
): string | undefined => {
    if (
        boardName !== undefined &&
        !SEO_CONFIG.BOARDS_WITH_DEFAULT_CONFIG.includes(boardName.toLowerCase())
    ) {
        return `Explore the world of ${boardName} with alphaday - the ultimate customizable dashboard for tracking, analyzing, and managing your cryptocurrency.`;
    }
    return undefined;
};
