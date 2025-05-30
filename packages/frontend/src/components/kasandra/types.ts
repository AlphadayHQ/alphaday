import { TCoin } from "src/api/types";

export type TMarketMeta = {
    id: number;
    name: string;
    slug: string;
    ticker: string;
    icon?: string | undefined;
};

export enum EChartType {
    Line = "line",
    Candlestick = "candlestick",
}

export type IPromptEditorProps = {
    prompts: {
        system: string;
        user: string;
    };
    onPromptsChange: (prompts: { system: string; user: string }) => void;
    selectedMarket: TCoin | undefined;
    selectedChartRange: string | undefined;
};
