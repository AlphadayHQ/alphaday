import { useState } from "react";
import { setupIonicReact } from "@ionic/react";
import { Arrow } from "./components/arrow/Arrow";
import { Button } from "./components/buttons/Button";
import { IconButton } from "./components/buttons/IconButton";
import { ApexAreaChart } from "./components/charts/apexchart";
import {
    FormCheckbox,
    FormInput,
    FormRadio,
    FormSelect,
    FormTextArea,
} from "./mobile-components/form-elements/FormElements";

setupIonicReact();

const options = {
    chart: {
        type: "area",
        stacked: false,
        events: {},
        zoom: {
            enabled: true,
            type: "x",
            autoScaleYaxis: false,
            zoomedArea: {
                fill: {
                    color: "var(--alpha-light-blue-100)",
                    opacity: 0.4,
                },
                stroke: {
                    color: "var(--alpha-dark-blue)",
                    opacity: 0.4,
                    width: 1,
                },
            },
        },
        toolbar: {
            show: false,
        },
        animations: {
            enabled: false,
        },
        redrawOnParentResize: true,
    },
    // color selection should match the case
    colors: [
        "var(--alpha-green)",
        "var(--alpha-bullish)",
        "var(--alpha-base)",
        "var(--alpha-bearish)",
    ],
    // colors: [
    //     "var(--alpha-bullish)",
    //     "var(--alpha-bearish)",
    //     "var(--alpha-green)",
    // ],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
        width: [1.5, 1, 1, 1],
        dashArray: [0, 3, 3, 3],
    },
    fill: {
        type: "gradient",
        gradient: {
            type: "vertical",
            gradientToColors: [
                "var(--alpha-dark-base)",
                "var(--alpha-dark-base)",
            ],
            shadeIntensity: 0.01,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 90, 100],
        },
    },
    legend: {
        show: false,
    },
    annotations: {
        xaxis: [
            {
                x: 1741206976945, // TODO use Now date
                borderColor: "#775DD0",
                borderWidth: 1.5,
                strokeDashArray: 4,
                label: {
                    style: {
                        background: "var(--alpha-base-400)",
                        color: "var(--alpha-primary)",
                        fontSize: "11px",
                        fontFamily: "'Open sans', sans-serif",
                        fontWeight: 500,
                        letterSpacing: "1px !important",
                    },
                    text: "Predictions",
                    offsetX: 17.5,
                    offsetY: -10,
                },
            },
            {
                x: 1741189586118,
                x2: 1741195875967,
                fillColor: "#B3F7CA",
                label: {
                    text: "Trump Election",
                    orientation: "horizontal",
                    offsetX: 45,
                    offsetY: 10,
                    style: {
                        background: "var(--alpha-base-400)",
                        color: "var(--alpha-primary)",
                    },
                },
            },
        ],
        points: [
            {
                x: 1741178438708, // TODO use Now date
                y: 90642.95015625951,
                mouseEnter: () => {
                    // console.log("onMouseEnter");
                },
                marker: {
                    size: 4,
                    css: {
                        filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))",
                    },
                    offsetY: 3,
                },
                label: {
                    borderColor: "#775DD0",
                    text: "SEC clears Uniswap",
                    style: {
                        background: "var(--alpha-base-400)",
                        color: "var(--alpha-primary)",
                    },
                },
            },
        ],
    },
    xaxis: {
        type: "datetime",
        tooltip: {
            enabled: false,
        },
        axisTicks: {
            show: false,
        },
        tickPlacement: "between",
        tickAmount: 8,
        labels: {
            datetimeUTC: false,
            style: {
                colors: "var(--alpha-border)",
                fontSize: "10px",
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
                cssClass: "apexcharts-xaxis-label",
            },
        },
        convertedCatToNumeric: false,
    },
    yaxis: {
        show: false,
        tickAmount: 3,
        min: 83328.69486633895,
        max: 97577.94333367079 + (97577.94333367079 - 83328.69486633895) * 0.15, // TODO (max) + size of the future annotation in percentage ~= 15%
        decimalsInFloat: false,
    },
    grid: {
        borderColor: "var(--alpha-border)",
        strokeDashArray: 5,
        xaxis: {
            lines: {
                show: true,
            },
        },
        yaxis: {
            lines: {
                show: false,
            },
        },
        column: {
            colors: "var(--alpha-border)",
            opacity: 1,
        },
    },
    tooltip: {
        shared: true,
        fillSeriesColor: "#121212",
        y: {
            formatter: undefined,
        },
    },
    responsive: [
        {
            breakpoint: 575,
            options: {
                chart: {
                    height: 200,
                },
                xaxis: {
                    show: false,
                },
            },
        },
    ],
};

const chartSeries = [
    // History
    {
        name: "History",
        data: [
            [1741155686060, 87070.09680238669],
            [1741156600730, 87203.02276071082],
            [1741157431902, 87421.59862371652],
            [1741158392938, 87572.61283398552],
            [1741159276850, 87394.068718299],
            [1741160215492, 87512.04729270047],
            [1741161093932, 87568.57935673255],
            [1741161960389, 87642.61154756158],
            [1741162853435, 87741.56450344747],
            [1741163777268, 87831.07822462625],
            [1741164660348, 87851.52480429214],
            [1741165557707, 87869.06572148163],
            [1741166482658, 88257.91440096953],
            [1741167366580, 88685.04092669683],
            [1741168291081, 88428.58242379213],
            [1741169138517, 88641.41361763507],
            [1741170107310, 88585.41702795791],
            [1741170977226, 90243.38183795087],
            [1741171858406, 89706.76061128601],
            [1741172774876, 89691.95603478217],
            [1741173660267, 89875.04834013591],
            [1741174568261, 89613.36103831575],
            [1741175499208, 90140.69417376975],
            [1741176628226, 90305.75677895504],
            [1741177527266, 90124.05243372297],
            [1741178438708, 90642.95015625951],
            [1741179353302, 90352.05950695107],
            [1741180566106, 89638.32872581233],
            [1741181436710, 89743.67597359545],
            [1741182389371, 89144.4969719099],
            [1741183243769, 89433.26802498609],
            [1741184211348, 89756.27329972007],
            [1741185088580, 89683.23825258194],
            [1741185917175, 89545.54897017432],
            [1741186911952, 88978.99942596417],
            [1741187721785, 88645.80293266727],
            [1741188710594, 88112.7887398987],
            [1741189586118, 88592.06610616272],
            [1741190463569, 88337.21345459952],
            [1741191320984, 87886.51944370828],
            [1741192240526, 87736.82159357124],
            [1741193157713, 88075.58253289662],
            [1741194036812, 89190.8514508287],
            [1741194993156, 89200.38695874772],
            [1741195875967, 90041.10727957473],
            [1741196775292, 89606.83169485522],
            [1741197703771, 89599.76636590458],
            [1741198571942, 89343.8404624817],
            [1741199490187, 89317.72214749803],
            [1741200393447, 89030.86485734794],
            [1741201264128, 89762.80824021908],
            [1741202125771, 89920.56614890922],
            [1741203048299, 89818.59998241573],
            [1741204014753, 89907.26783288509],
            [1741205145809, 90045.67120200407],
            [1741206097140, 89780.34606340837],
            [1741206976945, 90229.56280499678],
        ],
    },
    // Bullish
    {
        name: "Bullish case",
        data: [
            // change starts from below
            [1741206976945, 90229.56280499678],
            [1741207869165, 91428.38468072555],
            [1741208795900, 91211.12432620162],
            [1741209673537, 91185.74460801965],
            [1741210543339, 93008.18178981835],
            [1741211538972, 93267.48450110752],
            [1741212410706, 94315.43269286388],
            [1741213299449, 93150.48615154381],
            [1741214165300, 94127.76107919925],
            [1741215146143, 95327.80751514688],
            [1741216085718, 95435.92803733841],
            [1741216845551, 95427.26168132275],
            [1741217747087, 95717.00822574939],
            [1741218667815, 95785.81744292655],
            [1741219556799, 95746.37808455544],
            [1741220451144, 95618.50394435304],
            [1741221350947, 95187.69196050694],
            [1741222346134, 95114.73965904473],
            [1741223207316, 95173.67851810707],
            [1741224106283, 95347.06311338305],
            [1741224991917, 95360.60531197047],
            [1741225820252, 96856.68173836585],
            [1741226741830, 96565.19124357773],
            [1741227635501, 96617.6068719462],
            [1741228530187, 96116.63871546395],
            [1741229487744, 96613.00422271452],
            [1741230378341, 96833.40344858613],
            [1741231346559, 96723.54005228134],
            [1741232194652, 96511.89606275827],
            [1741233138096, 96452.48735602442],
            [1741233957824, 96775.07080936989],
            [1741234857155, 96689.96098257162],
            [1741235803707, 96881.50168901408],
            [1741236680829, 97168.41247806147],
            [1741237579396, 97314.71892975213],
            [1741238486351, 97364.6233283111],
            [1741239404177, 97496.58285405449],
            [1741240350994, 97577.94333367079],
            [1741241203976, 97392.68173630667],
            [1741241794000, 97370.10171515797],
        ],
    },
    // Base
    {
        name: "Base case",
        data: [
            // change starts from below
            [1741206976945, 90229.56280499678],
            [1741207869165, 90428.38468072555],
            [1741208795900, 90211.12432620162],
            [1741209673537, 90185.74460801965],
            [1741210543339, 90008.18178981835],
            [1741211538972, 90267.48450110752],
            [1741212410706, 90315.43269286388],
            [1741213299449, 90150.48615154381],
            [1741214165300, 90127.76107919925],
            [1741215146143, 90327.80751514688],
            [1741216085718, 90435.92803733841],
            [1741216845551, 90427.26168132275],
            [1741217747087, 90717.00822574939],
            [1741218667815, 90785.81744292655],
            [1741219556799, 90746.37808455544],
            [1741220451144, 90618.50394435304],
            [1741221350947, 90187.69196050694],
            [1741222346134, 90114.73965904473],
            [1741223207316, 90173.67851810707],
            [1741224106283, 90347.06311338305],
            [1741224991917, 90360.60531197047],
            [1741225820252, 91856.68173836585],
            [1741226741830, 91565.19124357773],
            [1741227635501, 91617.6068719462],
            [1741228530187, 91116.63871546395],
            [1741229487744, 91613.00422271452],
            [1741230378341, 91833.40344858613],
            [1741231346559, 91723.54005228134],
            [1741232194652, 91511.89606275827],
            [1741233138096, 91452.48735602442],
            [1741233957824, 91775.07080936989],
            [1741234857155, 91689.96098257162],
            [1741235803707, 91881.50168901408],
            [1741236680829, 92168.41247806147],
            [1741237579396, 92314.71892975213],
            [1741238486351, 92364.6233283111],
            [1741239404177, 92496.58285405449],
            [1741240350994, 92577.94333367079],
            [1741241203976, 92392.68173630667],
            [1741241794000, 92370.10171515797],
        ],
    },
    // Bearish
    {
        name: "Bearish case",
        data: [
            // change starts from below
            [1741206976945, 90229.56280499678],
            [1741207869165, 89428.38468072555],
            [1741208795900, 88211.12432620162],
            [1741209673537, 88185.74460801965],
            [1741210543339, 87008.18178981835],
            [1741211538972, 87267.48450110752],
            [1741212410706, 86315.43269286388],
            [1741213299449, 87150.48615154381],
            [1741214165300, 86127.76107919925],
            [1741215146143, 85327.80751514688],
            [1741216085718, 85435.92803733841],
            [1741216845551, 85427.26168132275],
            [1741217747087, 85717.00822574939],
            [1741218667815, 85785.81744292655],
            [1741219556799, 85746.37808455544],
            [1741220451144, 85618.50394435304],
            [1741221350947, 85187.69196050694],
            [1741222346134, 85114.73965904473],
            [1741223207316, 85173.67851810707],
            [1741224106283, 85347.06311338305],
            [1741224991917, 85360.60531197047],
            [1741225820252, 86856.68173836585],
            [1741226741830, 86565.19124357773],
            [1741227635501, 86617.6068719462],
            [1741228530187, 86116.63871546395],
            [1741229487744, 86613.00422271452],
            [1741230378341, 86833.40344858613],
            [1741231346559, 86723.54005228134],
            [1741232194652, 86511.89606275827],
            [1741233138096, 86452.48735602442],
            [1741233957824, 86775.07080936989],
            [1741234857155, 86689.96098257162],
            [1741235803707, 85881.50168901408],
            [1741236680829, 85168.41247806147],
            [1741237579396, 85314.71892975213],
            [1741238486351, 85364.6233283111],
            [1741239404177, 85496.58285405449],
            [1741240350994, 84577.94333367079],
            [1741241203976, 84392.68173630667],
            [1741241794000, 84370.10171515797],
        ],
    },
];

function App() {
    const [name, setName] = useState("");
    const [checked, setChecked] = useState(false);
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <h1 className="text-primary text-lg font-semibold">
                Vite + React + Ionic + Tailwind
            </h1>
            <div className="market-widget mt-72">
                <div className="w-[800px] p-20 h-[300px] [&>div]:-mx-[10px] two-col:h-[464px] line-chart">
                    <ApexAreaChart
                        options={options}
                        series={chartSeries}
                        width="100%"
                        height="100%"
                    />
                </div>
            </div>
            <div className="max-w-md w-full">
                <div className="m-1">
                    <FormInput
                        value={name}
                        label="Full name"
                        placeholder="Nina Faraggi"
                        defaultValue="test"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        errorMsg="This field is required"
                    />
                </div>
                <div className="m-1 mt-4">
                    <FormTextArea
                        value={name}
                        label="A little about yourself"
                        placeholder="I am a software engineer who loves to code and build things."
                        defaultValue="test"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="m-1 mt-4">
                    <FormSelect
                        selected={{
                            id: name.toString(),
                            value: name.toString(),
                        }}
                        label="A little about yourself"
                        placeholder="I am a software engineer who loves to code and build things."
                        onChange={(e) => setName(e.value)}
                        options={[
                            { id: "1000", value: "1000" },
                            { id: "1000", value: "20000" },
                            { id: "1000", value: "3erty" },
                        ]}
                        defaultValue={{ id: "1", value: "1000" }}
                    />
                </div>
                <div className="m-1 mt-4">
                    <FormCheckbox
                        checked={checked}
                        onChange={() => setChecked((prev) => !prev)}
                        label="I agree to the terms and conditions"
                        subtext="By checking this box, you agree to the terms and conditions of this website."
                    />
                </div>
                <div className="m-1 mt-4">
                    <FormRadio
                        checked={checked}
                        onChange={() => setChecked((prev) => !prev)}
                        label="I agree to the terms and conditions"
                        subtext="By checking this box, you agree to the terms and conditions of this website."
                    />
                </div>
            </div>
            <div className="bg-primary m-10 flex flex-col gap-3 p-10">
                <Button variant="small">Primary</Button>
                <div className="bg-secondaryOrange">
                    <p className=" fontGroup-highlightSemi m-4">
                        Tyring out Prose
                    </p>
                </div>
                <Arrow direction="up" />
                <Arrow direction="down" />
                <IconButton variant="star" />d
            </div>
        </div>
    );
}

export default App;
