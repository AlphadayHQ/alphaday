export type TPolymarketMeta = {
	id: number;
	question: string;
	event_title: string;
	category: string;
	total_volume: number;
	end_date: string | null;
	resolved: boolean;
	market_slug: string;
	image: string | null;
};

export enum EPolymarketFilter {
	All = "all",
	Active = "active",
	Resolved = "resolved",
}
