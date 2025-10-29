/**
 * Extracts the query ID from a Dune endpoint URL
 * Supports various Dune URL formats:
 * - https://dune.com/queries/[query_id]
 * - https://dune.com/queries/[query_id]/...
 * - https://dune.xyz/queries/[query_id]
 *
 * @param url - The Dune endpoint URL
 * @returns The extracted query ID or null if not found
 */
export const extractDuneQueryId = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter(Boolean);

        // Look for "queries" in the path and get the next part as the query ID
        const queriesIndex = pathParts.findIndex(part => part === "queries");
        if (queriesIndex !== -1 && pathParts[queriesIndex + 1]) {
            return pathParts[queriesIndex + 1];
        }

        return null;
    } catch (error) {
        return null;
    }
};
