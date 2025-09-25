import { FC, useState } from "react";
import { ModuleLoader, Button } from "@alphaday/ui-kit";
import {
	TPolymarketMarket,
	TPolymarketEvent,
} from "src/api/services/polymarket/types";
import PolymarketList from "./PolymarketList";
import { EPolymarketView, EPolymarketFilter } from "./types";

export interface IPolymarketModule {
	isLoading?: boolean;
	markets: TPolymarketMarket[];
	events: TPolymarketEvent[];
	onSelectMarket?: (market: TPolymarketMarket) => void;
	selectedMarket?: TPolymarketMarket;
	contentHeight: string;
}

const PolymarketModule: FC<IPolymarketModule> = ({
	isLoading,
	markets,
	events,
	onSelectMarket,
	selectedMarket,
	contentHeight,
}) => {
	const [currentView, setCurrentView] = useState<EPolymarketView>(
		EPolymarketView.Markets,
	);
	const [currentFilter, setCurrentFilter] = useState<EPolymarketFilter>(
		EPolymarketFilter.Active,
	);

	if (isLoading) {
		return <ModuleLoader $height={contentHeight} />;
	}

	const filteredMarkets = markets.filter((market) => {
		switch (currentFilter) {
			case EPolymarketFilter.Active:
				return !market.resolved;
			case EPolymarketFilter.Resolved:
				return market.resolved;
			default:
				return true;
		}
	});

	const handleViewChange = (view: EPolymarketView) => {
		setCurrentView(view);
	};

	const handleFilterChange = (filter: EPolymarketFilter) => {
		setCurrentFilter(filter);
	};

	return (
		<div className="polymarket-widget" style={{ height: contentHeight }}>
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between p-4 border-b border-borderLine">
					<div className="flex space-x-2">
						<Button
							variant={
								currentView === EPolymarketView.Markets
									? "primary"
									: "secondary"
							}
							onClick={() => handleViewChange(EPolymarketView.Markets)}
						>
							Markets
						</Button>
						<Button
							variant={
								currentView === EPolymarketView.Events ? "primary" : "secondary"
							}
							onClick={() => handleViewChange(EPolymarketView.Events)}
						>
							Events
						</Button>
					</div>

					{currentView === EPolymarketView.Markets && (
						<div className="flex space-x-2">
							<Button
								variant={
									currentFilter === EPolymarketFilter.All
										? "primary"
										: "secondary"
								}
								onClick={() => handleFilterChange(EPolymarketFilter.All)}
							>
								All
							</Button>
							<Button
								variant={
									currentFilter === EPolymarketFilter.Active
										? "primary"
										: "secondary"
								}
								onClick={() => handleFilterChange(EPolymarketFilter.Active)}
							>
								Active
							</Button>
							<Button
								variant={
									currentFilter === EPolymarketFilter.Resolved
										? "primary"
										: "secondary"
								}
								onClick={() => handleFilterChange(EPolymarketFilter.Resolved)}
							>
								Resolved
							</Button>
						</div>
					)}
				</div>

				<div className="flex-1 overflow-y-auto">
					<PolymarketList
						view={currentView}
						markets={
							currentView === EPolymarketView.Markets ? filteredMarkets : []
						}
						events={currentView === EPolymarketView.Events ? events : []}
						onSelectMarket={onSelectMarket}
						selectedMarket={selectedMarket}
					/>
				</div>
			</div>
		</div>
	);
};

export default PolymarketModule;
