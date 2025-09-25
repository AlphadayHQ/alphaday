import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { TPolymarketMarket } from "src/api/services/polymarket/types";
import { computeDuration } from "src/api/utils/dateUtils";

interface IPolymarketCard {
	market: TPolymarketMarket;
	onSelectMarket?: (market: TPolymarketMarket) => void;
}

const PolymarketCard: FC<IPolymarketCard> = ({ market, onSelectMarket }) => {
	const topOutcome =
		market.outcomes && market.outcomes.length > 0
			? market.outcomes.reduce((prev, current) =>
					prev.probability > current.probability ? prev : current,
				)
			: null;

	const endDate = market.end_date ? new Date(market.end_date) : null;
	const isExpired = endDate && endDate < new Date();

	let statusText = "";
	let statusColor = "";
	if (market.resolved) {
		statusText = "Resolved";
		statusColor = "text-gray-500";
	} else if (isExpired) {
		statusText = "Expired";
		statusColor = "text-orange-500";
	} else {
		statusText = "Active";
		statusColor = "text-green-500";
	}

	const formatVolume = (volume?: number) => {
		if (!volume) return "$0";
		if (volume >= 1000000) {
			return `$${(volume / 1000000).toFixed(1)}M`;
		}
		if (volume >= 1000) {
			return `$${(volume / 1000).toFixed(1)}K`;
		}
		return `$${volume.toLocaleString()}`;
	};

	const handleClick = () => {
		if (onSelectMarket) {
			onSelectMarket(market);
		}
	};

	const handleBuyClick = (e: React.MouseEvent, outcome: string) => {
		e.stopPropagation();
		const polymarketUrl = `https://polymarket.com/market/${market.market_slug}?outcome=${outcome}`;
		window.open(polymarketUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<div
			className="bg-background border border-borderLine rounded-lg p-4 cursor-pointer hover:bg-backgroundBlue hover:border-accentVariant100 transition-all duration-200"
			onClick={handleClick}
		>
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-sm font-semibold text-primary line-clamp-2 leading-tight">
					{market.question}
				</h3>
				<span className={twMerge("text-xs font-medium", statusColor)}>
					{statusText}
				</span>
			</div>

			{topOutcome && (
				<div className="mb-3 p-2 bg-backgroundVariant100 rounded-md">
					<div className="flex items-center justify-between mb-2">
						<span className="text-xs text-primaryVariant100 font-medium">
							{topOutcome.name}
						</span>
						<div className="flex items-center space-x-1">
							<span className="text-xs font-bold text-primary">
								{Math.round(topOutcome.probability * 100)}%
							</span>
							<span className="text-xs text-primaryVariant100">
								${topOutcome.price.toFixed(2)}
							</span>
						</div>
					</div>
					{market.outcomes && market.outcomes.length >= 2 && (
						<div className="flex space-x-2 mt-2">
							<button
								onClick={(e) => handleBuyClick(e, "yes")}
								className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors duration-200"
							>
								Buy Yes {Math.round(market.outcomes[0].probability * 100)}¢
							</button>
							<button
								onClick={(e) => handleBuyClick(e, "no")}
								className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors duration-200"
							>
								Buy No {Math.round((1 - market.outcomes[0].probability) * 100)}¢
							</button>
						</div>
					)}
				</div>
			)}

			<div className="flex items-center justify-between text-xs text-primaryVariant100">
				<div className="flex items-center space-x-3">
					<span className="font-medium">
						{formatVolume(market.total_volume)} vol
					</span>
					{endDate && !market.resolved && (
						<span>{computeDuration(market.end_date!)}</span>
					)}
				</div>
				{market.image && (
					<img
						src={market.image}
						alt="Market"
						className="w-5 h-5 rounded-full object-cover"
					/>
				)}
			</div>
		</div>
	);
};

export default PolymarketCard;
