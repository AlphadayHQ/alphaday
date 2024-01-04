import {
    // IonDatetime,
    setupIonicReact,
} from "@ionic/react";
import { ApexBarChart } from "./components/charts/apexchart";
import {
    BarChartSampleOptions,
    BarChartSampleSeries,
} from "./components/charts/mockData";

setupIonicReact();

function App() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <h1 className="text-primary text-lg font-semibold">
                Vite + React + Ionic + Tailwind
            </h1>
            {/* <IonDatetime className="mt-10" /> */}
            <div className="custom-charts-widget">
                <div className="barchart-styles bg-background w-[600px] h-[500px] flex flex-col gap-3 py-10 border-primary border">
                    <ApexBarChart
                        options={BarChartSampleOptions}
                        series={BarChartSampleSeries}
                        width="100%"
                        height="100%"
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
