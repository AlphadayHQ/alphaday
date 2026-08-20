import { FC, memo, useMemo, useState } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import moment from "moment-with-locales-es6";
import { TDeveloperActivitySnapshot } from "src/api/types";
import { formatNumber, ENumberStyle } from "src/api/utils/format";
import globalMessages from "src/globalMessages";
import DeveloperActivityChart from "./DeveloperActivityChart";

export enum EDeveloperActivityMetric {
    Stars = "stars",
    Forks = "forks",
    Commits = "commitsLast4Weeks",
    Contributors = "contributorsCount",
    OpenIssues = "openIssues",
}

type TMetricKey = keyof Pick<
    TDeveloperActivitySnapshot,
    "stars" | "forks" | "commitsLast4Weeks" | "contributorsCount" | "openIssues"
>;

const METRICS: Array<{
    key: TMetricKey;
    value: EDeveloperActivityMetric;
    label: string;
}> = [
    {
        key: "stars",
        value: EDeveloperActivityMetric.Stars,
        label: "Stars",
    },
    {
        key: "forks",
        value: EDeveloperActivityMetric.Forks,
        label: "Forks",
    },
    {
        key: "commitsLast4Weeks",
        value: EDeveloperActivityMetric.Commits,
        label: "Commits (4w)",
    },
    {
        key: "contributorsCount",
        value: EDeveloperActivityMetric.Contributors,
        label: "Contributors",
    },
    {
        key: "openIssues",
        value: EDeveloperActivityMetric.OpenIssues,
        label: "Open Issues",
    },
];

const formatCount = (value: number): string =>
    formatNumber({ value, style: ENumberStyle.Decimal }).value;

const StatTile: FC<{
    label: string;
    value: number;
    active: boolean;
    onClick: () => void;
}> = ({ label, value, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-start justify-center flex-1 min-w-[72px] px-2 py-1.5 rounded-md border transition-colors ${
            active
                ? "border-accentVariant100 bg-backgroundVariant200"
                : "border-borderLine bg-transparent hover:bg-backgroundVariant100"
        }`}
    >
        <span className="fontGroup-support text-primaryVariant100 whitespace-nowrap">
            {label}
        </span>
        <span className="fontGroup-highlightSemi text-primary">
            {formatCount(value)}
        </span>
    </button>
);

interface IDeveloperActivity {
    isLoading: boolean;
    snapshots: TDeveloperActivitySnapshot[] | undefined;
    coin: string | undefined;
    widgetHeight: number;
}

const DeveloperActivityModule: FC<IDeveloperActivity> = memo(
    function DeveloperActivityModule({
        isLoading,
        snapshots,
        coin,
        widgetHeight,
    }) {
        const [selectedMetric, setSelectedMetric] =
            useState<EDeveloperActivityMetric>(EDeveloperActivityMetric.Stars);

        const latest = snapshots?.[snapshots.length - 1];

        const selectedMetricConfig =
            METRICS.find((m) => m.value === selectedMetric) ?? METRICS[0];

        const chartSeries = useMemo<Array<[number, number]>>(() => {
            if (!snapshots) return [];
            return snapshots.map((s) => [
                moment(s.date).unix(),
                Number(s[selectedMetricConfig.key]),
            ]);
        }, [snapshots, selectedMetricConfig.key]);

        const TILES_HEIGHT = 60;
        const chartHeight = Math.max(widgetHeight - TILES_HEIGHT, 120);

        if (isLoading) {
            return <ModuleLoader $height={`${widgetHeight}px`} />;
        }

        if (coin === undefined) {
            return (
                <div
                    className="flex w-full justify-center items-center bg-background px-4 text-center"
                    style={{ height: `${widgetHeight}px` }}
                >
                    <p className="text-primary fontGroup-highlightSemi">
                        Pin a coin to this widget to see its GitHub developer
                        activity.
                    </p>
                </div>
            );
        }

        if (latest === undefined || snapshots?.length === 0) {
            return (
                <div
                    className="flex w-full justify-center items-center bg-background"
                    style={{ height: `${widgetHeight}px` }}
                >
                    <p className="text-primary fontGroup-highlightSemi">
                        {globalMessages.queries.noMatchFound(
                            "developer activity"
                        )}
                    </p>
                </div>
            );
        }

        return (
            <div className="flex flex-col px-2 pt-1">
                <div className="flex flex-row flex-wrap gap-1.5 pb-1.5">
                    {METRICS.map((metric) => (
                        <StatTile
                            key={metric.value}
                            label={metric.label}
                            value={Number(latest[metric.key])}
                            active={metric.value === selectedMetric}
                            onClick={() => setSelectedMetric(metric.value)}
                        />
                    ))}
                </div>
                <div className="flex flex-row items-baseline justify-between px-1 pb-1">
                    <span className="fontGroup-highlightSemi text-primary">
                        {selectedMetricConfig.label}
                    </span>
                    <span className="fontGroup-support text-primaryVariant100">
                        {moment(latest.date).format("DD MMM YYYY")}
                    </span>
                </div>
                <DeveloperActivityChart
                    series={chartSeries}
                    height={chartHeight}
                />
            </div>
        );
    }
);

export default DeveloperActivityModule;
