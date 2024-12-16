import { TPortfolio } from "../types";
import { getAssetPrefix } from "./portfolioUtils";

describe("getAssetPrefix", () => {
    it("should return empty string for ethereum network", () => {
        const portfolio = {
            network: "ethereum",

            // Add other required TPortfolio properties
        } as TPortfolio;
        expect(getAssetPrefix(portfolio)).toBe("");
    });

    it("should return correct prefix for polygon network", () => {
        const portfolio = {
            network: "polygon",
            // Add other required TPortfolio properties
        } as TPortfolio;
        expect(getAssetPrefix(portfolio)).toBe("(poly)");
    });

    it("should return correct prefix for arbitrum network", () => {
        const portfolio = {
            network: "arbitrum",
            // Add other required TPortfolio properties
        } as TPortfolio;
        expect(getAssetPrefix(portfolio)).toBe("(arb)");
    });

    it("should handle case insensitive network names", () => {
        const portfolio = {
            network: "POLYGON",
            // Add other required TPortfolio properties
        } as TPortfolio;
        expect(getAssetPrefix(portfolio)).toBe("(poly)");
    });

    it("should return empty string and log warning for unsupported network", () => {
        const portfolio = {
            network: "unsupported",
            // Add other required TPortfolio properties
        } as TPortfolio;
        expect(getAssetPrefix(portfolio)).toBe("");
    });

    it("should handle undefined network property", () => {
        const portfolio = {
            network: "nonexistent",
            // Add other required TPortfolio properties
        } as TPortfolio;
        expect(getAssetPrefix(portfolio)).toBe("");
    });
});
