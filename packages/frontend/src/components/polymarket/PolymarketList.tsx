import { FC } from "react";
import { ListItem, CenteredBlock, ScrollBar } from "@alphaday/ui-kit";
import {
	TPolymarketMarket,
	TPolymarketEvent,
} from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";
import { EPolymarketView } from "./types";

export interface IPolymarketList {
	view: EPolymarketView;
	markets: TPolymarketMarket[];
	events: TPolymarketEvent[];
	onSelectMarket?: (market: TPolymarketMarket) => void;
	selectedMarket?: TPolymarketMarket;
}

const PolymarketList: FC<IPolymarketList> = ({
	view,
	markets,
	events,
	onSelectMarket,
}) => {
	if (view === EPolymarketView.Markets) {
		if (markets.length === 0) {
			return (
				<CenteredBlock>
					<p>No markets found</p>
				</CenteredBlock>
			);
		}

		return (
			<ScrollBar>
				{markets.map((market) => {
					const topOutcome =
						market.outcomes && market.outcomes.length > 0
							? market.outcomes.reduce((prev, current) =>
									prev.probability > current.probability ? prev : current,
								)
							: null;

					const endDate = market.end_date ? new Date(market.end_date) : null;
					const isExpired = endDate && endDate < new Date();

					// Create status text
					let statusText = "";
					if (market.resolved) {
						statusText = "Resolved";
					} else if (isExpired) {
						statusText = "Expired";
					} else {
						statusText = "Active";
					}

					// Format volume as tag
					const volumeTag = `$${market.total_volume?.toLocaleString()}`;

					// Create description with top outcome
					let description = market.event.title;
					if (topOutcome) {
						description += ` • ${topOutcome.name} (${Math.round(topOutcome.probability * 100)}%)`;
					}

					return (
						<ListItem
							key={market.id}
							variant="news" // Using news variant for consistent styling
							title={market.question}
							path={`/polymarket/${market.market_slug}`}
							duration={endDate ? computeDuration(market.end_date!) : ""}
							tag={volumeTag}
							tagImg={market.image || undefined}
							source={statusText}
							onClick={async () => {
								if (onSelectMarket) {
									onSelectMarket(market);
								}
							}}
						/>
					);
				})}
			</ScrollBar>
		);
	}

	// Events view
	if (events.length === 0) {
		return (
			<CenteredBlock>
				<p>No events found</p>
			</CenteredBlock>
		);
	}

	return (
		<ScrollBar>
			{events.map((event) => {
				const startDate = event.start_date ? new Date(event.start_date) : null;
				const endDate = event.end_date ? new Date(event.end_date) : null;

				// Use start date for duration, fall back to end date
				const dateForDuration = startDate || endDate;

				return (
					<ListItem
						key={event.id}
						variant="news"
						title={event.title}
						path={`/polymarket/events/${event.slug}`}
						duration={
							dateForDuration
								? computeDuration(dateForDuration.toISOString())
								: ""
						}
						tag={event.category}
						tagImg={event.image || undefined}
						source={event.tags.length > 0 ? event.tags[0].name : undefined}
					/>
				);
			})}
		</ScrollBar>
	);
};

export default PolymarketList;
