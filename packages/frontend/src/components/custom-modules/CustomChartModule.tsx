import { FC, useMemo } from "react";
import {
    ApexAreaChart,
    ApexBarChart,
    ApexDonutChart,
    ApexLineChart,
    ApexPieChart,
    themeColors,
} from "@alphaday/ui-kit";
import { TCustomMetaChart } from "src/api/services";
import { TCustomSeries } from "src/api/types";
import { getXSeries, getYSeries } from "src/api/utils/customDataUtils";

export interface IChartModuleProps {
    id: number;
    series: TCustomSeries;
    meta: TCustomMetaChart | undefined;
    name: string;
}

const CustomChartModule: FC<IChartModuleProps> = ({
    id,
    series,
    meta,
    name,
}) => {
    const labels = useMemo(() => {
        return getXSeries(series, meta, name);
    }, [meta, series, name]);

    const options = {
        id,
        sparkline: {
            enabled: false,
        },
        background: "transparent",
        redrawOnWindowResize: true,
        height: "500px",
        labels,
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                donut: {
                    background: "transparent",
                },
            },
        },
        stroke: {
            colors: undefined,
        },
        legend: {
            show: true,
            fontSize: "11px",
            position: "left",
            offsetX: 0,
            offsetY: 0,
            height: 500,
            labels: {
                colors: [themeColors.primaryVariant100],
                useSeriesColors: false,
            },
            markers: {
                radius: 3,
            },
        },
    };

    const ySeries = useMemo(() => {
        return getYSeries(series, meta, name);
    }, [meta, series, name]);

    if (meta?.layout.variant === "donut") {
        return (
            <ApexDonutChart
                options={options}
                series={ySeries}
                width="400px"
                height="500px"
            />
        );
    }
    if (meta?.layout.variant === "pie") {
        return (
            <ApexPieChart
                options={options}
                series={ySeries}
                width="400px"
                height="500px"
            />
        );
    }
    if (meta?.layout.variant === "bar") {
        return (
            <ApexBarChart
                options={options}
                series={ySeries}
                width="400px"
                height="500px"
            />
        );
    }
    if (meta?.layout.variant === "area") {
        return (
            <ApexAreaChart
                options={options}
                series={ySeries}
                width="400px"
                height="500px"
            />
        );
    }
    return (
        <ApexLineChart
            options={options}
            series={ySeries}
            width="400px"
            height="500px"
        />
    );
};
export default CustomChartModule;
