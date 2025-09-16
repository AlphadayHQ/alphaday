import {
    useState,
    useEffect,
    useCallback,
    useImperativeHandle,
    useMemo,
} from "react";
import { ApexLineChart } from "@alphaday/ui-kit";
import { ENumberStyle, formatNumber } from "src/api/utils/format";

type TDataPoint = {
    x: number;
    y: number;
};
type TChartPoint = TDataPoint & {
    isAnchor?: boolean;
};
type TSeries = {
    name: string;
    data: TDataPoint[];
    type: string;
    color: string;
    strokeWidth: number;
    zIndex: number;
    strokeDashArray?: number;
    opacity?: number;
};

const FedData = {
    id: 1,
    coin: {
        id: 1,
        name: "Bitcoin",
        ticker: "BTC",
        slug: "bitcoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    },
    interval: "1W",
    case: "baseline",
    chart_data: {
        case: "baseline",
        coin: {
            id: 1,
            name: "Bitcoin",
            slug: "bitcoin",
            ticker: "BTC",
        },
        interval: "1W",
        metadata: {
            generated_at: 1758007323000,
            case_specific: true,
            selection_method: "price_chart_anchored",
            predictions_displayed: 6,
            total_predictions_available: 6,
        },
        timeframe: {
            start_timestamp: 1757404923129,
            end_timestamp: 1758007323000,
        },
        past_predictions: [
            {
                id: "prediction_557",
                case: "baseline",
                chart_data: [
                    {
                        price: 109610,
                        timestamp: 1757404923129,
                        volatility: 0,
                    },
                    {
                        price: 109610,
                        timestamp: 1757408523129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 109911.88054871465,
                        timestamp: 1757412123129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 109982.77907515493,
                        timestamp: 1757415723129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110153.22513571575,
                        timestamp: 1757419323129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110148.12399836098,
                        timestamp: 1757422923129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110321.46621322884,
                        timestamp: 1757426523129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 109853.2445604307,
                        timestamp: 1757430123129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 109985.77943833118,
                        timestamp: 1757433723129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110240.31083759377,
                        timestamp: 1757437323129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110389.35387010487,
                        timestamp: 1757440923129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110374.23262108813,
                        timestamp: 1757444523129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110499.9138179348,
                        timestamp: 1757448123129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110326.15286810734,
                        timestamp: 1757451723129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110205.15226643156,
                        timestamp: 1757455323129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110487.79426779572,
                        timestamp: 1757458923129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110429.93469711086,
                        timestamp: 1757462523129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110670.12026486054,
                        timestamp: 1757466123129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110785.35850006118,
                        timestamp: 1757469723129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 110725.84624899754,
                        timestamp: 1757473323129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111385.9764363328,
                        timestamp: 1757476923129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111145.3109029317,
                        timestamp: 1757480523129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111493.36946726484,
                        timestamp: 1757484123129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111801.52912467574,
                        timestamp: 1757487723129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111933.0733436123,
                        timestamp: 1757491323129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 112257.46221359342,
                        timestamp: 1757494923129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111905.69796439633,
                        timestamp: 1757498523129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111768.28659780143,
                        timestamp: 1757502123129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111749.33968135818,
                        timestamp: 1757505723129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111665.81256868283,
                        timestamp: 1757509323129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111554.0191475584,
                        timestamp: 1757512923129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111566.68623299811,
                        timestamp: 1757516523129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111694.0041747911,
                        timestamp: 1757520123129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111926.64644649616,
                        timestamp: 1757523723129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111869.97214833852,
                        timestamp: 1757527323129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 111954.06363357391,
                        timestamp: 1757530923129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 112020.59677468768,
                        timestamp: 1757534523129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 112235.05356380725,
                        timestamp: 1757538123129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 112382.19330642378,
                        timestamp: 1757541723129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 112345.03792633975,
                        timestamp: 1757545323129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 112369.57284424151,
                        timestamp: 1757548923129,
                        volatility: 3.9614017267648562,
                    },
                    {
                        price: 112307.3269149856,
                        timestamp: 1757552523129,
                        volatility: 3.9614017267648562,
                    },
                ],
                created_at: "2025-09-01T08:15:20.283000+00:00",
                anchor_point: {
                    price: 109681.77674236635,
                    timestamp: 1757404172145,
                    time_diff_hours: 0.22,
                },
                accuracy_score: 95,
                truncation_info: {
                    method: "fixed_time_span",
                    actual_end: 1757552523129,
                    span_hours: 42,
                    actual_start: 1757404923129,
                    truncation_end: 1757555372145,
                    original_length: 169,
                    anchor_timestamp: 1757404172145,
                    truncated_length: 42,
                },
                prediction_set_id: 65,
            },
            {
                id: "prediction_756",
                case: "baseline",
                chart_data: [
                    {
                        price: 109913,
                        timestamp: 1757501307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110150.20318403249,
                        timestamp: 1757504907108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110758.88327559453,
                        timestamp: 1757508507108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110764.71497128141,
                        timestamp: 1757512107108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110961.75633636562,
                        timestamp: 1757515707108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110806.05508527519,
                        timestamp: 1757519307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110980.96097992526,
                        timestamp: 1757522907108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110482.96659910254,
                        timestamp: 1757526507108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110178.41350638392,
                        timestamp: 1757530107108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110221.9890066277,
                        timestamp: 1757533707108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110139.81185102258,
                        timestamp: 1757537307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110935.54896229017,
                        timestamp: 1757540907108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111369.7399025988,
                        timestamp: 1757544507108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111384.61816264859,
                        timestamp: 1757548107108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111136.94373929407,
                        timestamp: 1757551707108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111082.31528781238,
                        timestamp: 1757555307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111275.6992795536,
                        timestamp: 1757558907108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111388.9212392745,
                        timestamp: 1757562507108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111278.59090169515,
                        timestamp: 1757566107108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111407.3633768719,
                        timestamp: 1757569707108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111247.05633829752,
                        timestamp: 1757573307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111123.415400751,
                        timestamp: 1757576907108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110991.37562702698,
                        timestamp: 1757580507108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110775.74302288365,
                        timestamp: 1757584107108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110887.29495608679,
                        timestamp: 1757587707108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110855.56759955452,
                        timestamp: 1757591307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110786.38887036925,
                        timestamp: 1757594907108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110619.30645917071,
                        timestamp: 1757598507108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110545.3946753288,
                        timestamp: 1757602107108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110640.89968612602,
                        timestamp: 1757605707108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110594.86248422382,
                        timestamp: 1757609307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110690.84199859574,
                        timestamp: 1757612907108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110789.80891423135,
                        timestamp: 1757616507108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 110951.25491924441,
                        timestamp: 1757620107108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111015.20004236579,
                        timestamp: 1757623707108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111039.09927440237,
                        timestamp: 1757627307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111171.58614249263,
                        timestamp: 1757630907108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111175.29458218465,
                        timestamp: 1757634507108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111250.74010710133,
                        timestamp: 1757638107108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111379.76607523653,
                        timestamp: 1757641707108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111420.4823398848,
                        timestamp: 1757645307108.36,
                        volatility: 2.9680617958876594,
                    },
                    {
                        price: 111500,
                        timestamp: 1757648865751.36,
                        volatility: 2.9680617958876594,
                    },
                ],
                created_at: "2025-09-02T11:45:30.774000+00:00",
                anchor_point: {
                    price: 109726.00873584817,
                    timestamp: 1757498805127.36,
                    time_diff_hours: 0.3,
                },
                accuracy_score: 95,
                truncation_info: {
                    method: "fixed_time_span",
                    actual_end: 1757648865751.36,
                    span_hours: 42,
                    actual_start: 1757501307108.36,
                    truncation_end: 1757650005127.36,
                    original_length: 169,
                    anchor_timestamp: 1757498805127.36,
                    truncated_length: 42,
                },
                prediction_set_id: 65,
            },
            {
                id: "prediction_1293",
                case: "baseline",
                chart_data: [
                    {
                        price: 112193.39231476202,
                        timestamp: 1757597691087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 112087.48985086045,
                        timestamp: 1757601291087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 112216.35484173676,
                        timestamp: 1757604891087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 112454.30658525044,
                        timestamp: 1757608491087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113036.14403463696,
                        timestamp: 1757612091087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113660.19806336063,
                        timestamp: 1757615691087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113479.54483312136,
                        timestamp: 1757619291087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113537.39746407932,
                        timestamp: 1757622891087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113848.97491086237,
                        timestamp: 1757626491087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113679.719419013,
                        timestamp: 1757630091087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114144.11225092188,
                        timestamp: 1757633691087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114990.0203568346,
                        timestamp: 1757637291087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114959.91179357532,
                        timestamp: 1757640891087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114798.07676669318,
                        timestamp: 1757644491087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114957.11296784376,
                        timestamp: 1757648091087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114888.44090911307,
                        timestamp: 1757651691087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 115210.51596594069,
                        timestamp: 1757655291087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113816.75582192872,
                        timestamp: 1757658891087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113064.60579658415,
                        timestamp: 1757662491087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113206.02328655103,
                        timestamp: 1757666091087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113312.96245436087,
                        timestamp: 1757669691087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113473.61202135419,
                        timestamp: 1757673291087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114127.33338201354,
                        timestamp: 1757676891087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113971.70971405445,
                        timestamp: 1757680491087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114489.86524917147,
                        timestamp: 1757684091087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114703.42715752093,
                        timestamp: 1757687691087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114508.92378670942,
                        timestamp: 1757691291087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114236.14753172029,
                        timestamp: 1757694891087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114200.69594052609,
                        timestamp: 1757698491087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114174.71991461042,
                        timestamp: 1757702091087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 114049.3916675889,
                        timestamp: 1757705691087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113567.44060681098,
                        timestamp: 1757709291087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113385.05814964704,
                        timestamp: 1757712891087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113425.59148296787,
                        timestamp: 1757716491087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113408.53701695919,
                        timestamp: 1757720091087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113283.39398517334,
                        timestamp: 1757723691087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113231.24285725919,
                        timestamp: 1757727291087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113232.28483146837,
                        timestamp: 1757730891087.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113500,
                        timestamp: 1757734453776.72,
                        volatility: 5.576627370579188,
                    },
                    {
                        price: 113500,
                        timestamp: 1757738091087.72,
                        volatility: 7.589343729694608,
                    },
                    {
                        price: 113653.62451624841,
                        timestamp: 1757741691087.72,
                        volatility: 7.589343729694608,
                    },
                    {
                        price: 114275.66025169649,
                        timestamp: 1757745291087.72,
                        volatility: 7.589343729694608,
                    },
                ],
                created_at: "2025-09-03T12:29:16.530000+00:00",
                anchor_point: {
                    price: 112291.2372439524,
                    timestamp: 1757596103617.72,
                    time_diff_hours: 3.56,
                },
                accuracy_score: 95,
                truncation_info: {
                    method: "fixed_time_span",
                    actual_end: 1757745291087.72,
                    span_hours: 42,
                    actual_start: 1757597691087.72,
                    truncation_end: 1757747303617.72,
                    original_length: 169,
                    anchor_timestamp: 1757596103617.72,
                    truncated_length: 42,
                },
                prediction_set_id: 65,
            },
            {
                id: "prediction_1499",
                case: "baseline",
                chart_data: [
                    {
                        price: 109943.25979996171,
                        timestamp: 1757694075067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110224.21485400356,
                        timestamp: 1757697675067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 111097.28252911552,
                        timestamp: 1757701275067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110717.09047157828,
                        timestamp: 1757704875067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110822.87442716074,
                        timestamp: 1757708475067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110938.77708247758,
                        timestamp: 1757712075067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110429.57902927618,
                        timestamp: 1757715675067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110290.05836290492,
                        timestamp: 1757719275067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110377.72845728228,
                        timestamp: 1757722875067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 112714.72111959827,
                        timestamp: 1757726475067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 111320.0795677987,
                        timestamp: 1757730075067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110447.1282440182,
                        timestamp: 1757733675067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110342.77189801716,
                        timestamp: 1757737275067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110830.35970609133,
                        timestamp: 1757740875067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 110952.28848470595,
                        timestamp: 1757744475067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 112065.56758709806,
                        timestamp: 1757748075067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 112823.92475688134,
                        timestamp: 1757751675067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 112799.99201819752,
                        timestamp: 1757755275067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 112764.98496925944,
                        timestamp: 1757758875067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 112595.68918371834,
                        timestamp: 1757762475067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113216.47489580695,
                        timestamp: 1757766075067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113243.08048968001,
                        timestamp: 1757769675067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113147.13599770585,
                        timestamp: 1757773275067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113062.38959514725,
                        timestamp: 1757776875067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 112678.86838274554,
                        timestamp: 1757780475067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 112455.92711335042,
                        timestamp: 1757784075067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113053.30748394965,
                        timestamp: 1757787675067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113801.48410831144,
                        timestamp: 1757791275067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113850.6719724863,
                        timestamp: 1757794875067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113676.32042499699,
                        timestamp: 1757798475067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113746.92595287629,
                        timestamp: 1757802075067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113791.25965051781,
                        timestamp: 1757805675067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113882.96707015572,
                        timestamp: 1757809275067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113808.80841130918,
                        timestamp: 1757812875067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113902.26170788598,
                        timestamp: 1757816475067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 114046.03910866787,
                        timestamp: 1757820075067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113931.83186964152,
                        timestamp: 1757823675067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113888.94559852147,
                        timestamp: 1757827275067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 113955.63715958834,
                        timestamp: 1757830875067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 114022.36433139804,
                        timestamp: 1757834475067.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 114000,
                        timestamp: 1757838033329.08,
                        volatility: 6.061614042270098,
                    },
                    {
                        price: 114000,
                        timestamp: 1757841675067.08,
                        volatility: 4.478462898030157,
                    },
                ],
                created_at: "2025-09-04T18:03:32.882000+00:00",
                anchor_point: {
                    price: 109873.8930916779,
                    timestamp: 1757694018245.08,
                    time_diff_hours: 1.98,
                },
                accuracy_score: 95,
                truncation_info: {
                    method: "fixed_time_span",
                    actual_end: 1757841675067.08,
                    span_hours: 42,
                    actual_start: 1757694075067.08,
                    truncation_end: 1757845218245.08,
                    original_length: 169,
                    anchor_timestamp: 1757694018245.08,
                    truncated_length: 42,
                },
                prediction_set_id: 65,
            },
            {
                id: "prediction_1880",
                case: "baseline",
                chart_data: [
                    {
                        price: 111286,
                        timestamp: 1757790459046.44,
                        volatility: 0,
                    },
                    {
                        price: 111286,
                        timestamp: 1757794059046.44,
                        volatility: 9.924477013829526,
                    },
                    {
                        price: 111852.73248627638,
                        timestamp: 1757797659046.44,
                        volatility: 9.924477013829526,
                    },
                    {
                        price: 112249.41281117278,
                        timestamp: 1757801259046.44,
                        volatility: 9.924477013829526,
                    },
                    {
                        price: 113529.4031671491,
                        timestamp: 1757804859046.44,
                        volatility: 9.924477013829526,
                    },
                    {
                        price: 112896.1119102542,
                        timestamp: 1757808459046.44,
                        volatility: 9.924477013829526,
                    },
                ],
                created_at: "2025-09-07T12:21:24.929000+00:00",
                anchor_point: {
                    price: 110656.308978032,
                    timestamp: 1757659701131.44,
                    time_diff_hours: 36.33,
                },
                accuracy_score: 95,
                truncation_info: {
                    method: "fixed_time_span",
                    actual_end: 1757808459046.44,
                    span_hours: 42,
                    actual_start: 1757790459046.44,
                    truncation_end: 1757810901131.44,
                    original_length: 169,
                    anchor_timestamp: 1757659701131.44,
                    truncated_length: 6,
                },
                prediction_set_id: 65,
            },
            {
                id: "prediction_1942",
                case: "baseline",
                chart_data: [
                    {
                        price: 111168,
                        timestamp: 1757886843025.8,
                        volatility: 0,
                    },
                    {
                        price: 111168,
                        timestamp: 1757890443025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111466.65791550753,
                        timestamp: 1757894043025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111803.07928378748,
                        timestamp: 1757897643025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111307.67879325316,
                        timestamp: 1757901243025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111171.7954410211,
                        timestamp: 1757904843025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111496.09648623476,
                        timestamp: 1757908443025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111244.69507737183,
                        timestamp: 1757912043025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111307.6907761069,
                        timestamp: 1757915643025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111548.47527693382,
                        timestamp: 1757919243025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111476.72553946773,
                        timestamp: 1757922843025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111395.48857249437,
                        timestamp: 1757926443025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111507.46630056293,
                        timestamp: 1757930043025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111389.03621719568,
                        timestamp: 1757933643025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111411.05772270603,
                        timestamp: 1757937243025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111388.89161629695,
                        timestamp: 1757940843025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111482.87237249209,
                        timestamp: 1757944443025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111381.73631290569,
                        timestamp: 1757948043025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111456.37981172198,
                        timestamp: 1757951643025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111493.12723099694,
                        timestamp: 1757955243025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111501.13957146849,
                        timestamp: 1757958843025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111453.207886568,
                        timestamp: 1757962443025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111503.93703851459,
                        timestamp: 1757966043025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111583.43899396149,
                        timestamp: 1757969643025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111725.09170053655,
                        timestamp: 1757973243025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 111787.14442851182,
                        timestamp: 1757976843025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 112090.16504613664,
                        timestamp: 1757980443025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 112150.95076801753,
                        timestamp: 1757984043025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 112078.19600069363,
                        timestamp: 1757987643025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 112198.80319252408,
                        timestamp: 1757991243025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 112173.2979761082,
                        timestamp: 1757994843025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 112155.10736830003,
                        timestamp: 1757998443025.8,
                        volatility: 2.146969844832634,
                    },
                    {
                        price: 112254.16230285178,
                        timestamp: 1758002043025.8,
                        volatility: 2.146969844832634,
                    },
                ],
                created_at: "2025-09-07T13:03:22.411000+00:00",
                anchor_point: {
                    price: 110619.14326203972,
                    timestamp: 1757854425087.8,
                    time_diff_hours: 9.01,
                },
                accuracy_score: 95,
                truncation_info: {
                    method: "fixed_time_span",
                    actual_end: 1758002043025.8,
                    span_hours: 42,
                    actual_start: 1757886843025.8,
                    truncation_end: 1758005625087.8,
                    original_length: 169,
                    anchor_timestamp: 1757854425087.8,
                    truncated_length: 33,
                },
                prediction_set_id: 65,
            },
        ],
        base_chart_anchors: 6,
        truncation_span_hours: 42,
    },
    generation_metadata: {
        task_id: "69449877-ebf3-487b-b03d-36b58429f693",
        max_predictions: 6,
        generation_method: "price_chart_anchored",
    },
    is_active: true,
    generation_timestamp: 1758007323000,
    expires_at: "2025-09-09T07:57:20.242057Z",
};

const baseData = {
    id: 18,
    coin: {
        id: 1,
        name: "Bitcoin",
        ticker: "BTC",
        slug: "bitcoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
        description:
            "Bitcoin (BTC) is a cryptocurrency launched in 2010. Users are able to generate BTC through the process of mining. Bitcoin has a current supply of 19,794,440. The last known price of Bitcoin is 100,893.56218115 USD and is up 2.98 over the last 24 hours. It is currently trading on 11835 active market(s) with $79,744,875,194.36 traded over the last 24 hours. More information can be found at https://bitcoin.org/.",
        max_supply: 0,
        circulating_supply: 0,
        total_supply: 0,
        rank: 1,
        gecko_id: "bitcoin",
        cmc_id: 1,
        allow_filter: true,
        kasandra_supported: true,
        kasandra_special: false,
        project: 234,
        tags: [136],
        users: [3399],
    },
    interval: "1W",
    currency: "USD",
    history: {
        prices: [
            [1757404923129, 113070.31854691613],
            [1757408595191, 112951.8697006361],
            [1757412173726, 112921.314592305],
            [1757416001451, 112717.27875782315],
            [1757419240406, 112500.52744001287],
            [1757422918540, 112676.69684972118],
            [1757426488094, 112774.8919592429],
            [1757430145704, 111729.81552424721],
            [1757433738185, 110870.22649131795],
            [1757437340509, 110976.01267464506],
            [1757440910813, 111031.54556997617],
            [1757444784550, 111145.96752255705],
            [1757448111690, 111319.25301235504],
            [1757451748074, 111359.19585339191],
            [1757455296633, 111301.75137263995],
            [1757458933353, 111518.10122362581],
            [1757462518797, 111521.54423183508],
            [1757466141837, 111062.11173220031],
            [1757469705193, 111023.09957073671],
            [1757473235162, 111397.55074284918],
            [1757476940585, 111525.92713938442],
            [1757480499509, 111521.6910568116],
            [1757484104524, 111567.4027745938],
            [1757491359241, 112528.44834154386],
            [1757494957039, 112363.70010957935],
            [1757498671275, 112249.77986728513],
            [1757502095220, 112321.22186740591],
            [1757505755564, 112255.32408911726],
            [1757509310368, 113426.4487582137],
            [1757513007515, 113934.39669773277],
            [1757516576153, 113891.18838609783],
            [1757520167240, 113903.95331929345],
            [1757523765040, 113672.21437753727],
            [1757527361235, 113734.63302411242],
            [1757530953877, 113592.01651974638],
            [1757534558220, 113402.84560367846],
            [1757538163267, 113625.82028845928],
            [1757541757931, 113885.30512691998],
            [1757545336643, 113935.59752053465],
            [1757548944417, 114000.12092296442],
            [1757552542679, 113898.88515467383],
            [1757556117331, 113925.24673335499],
            [1757559676610, 113851.68539357337],
            [1757563305613, 114419.6275852975],
            [1757566902786, 114167.93383345696],
            [1757570498161, 114273.22997057601],
            [1757574176015, 114409.3605035541],
            [1757577751948, 114077.07046607311],
            [1757581350436, 114055.54421450144],
            [1757584858161, 113916.23703791054],
            [1757588553513, 114074.88061462918],
            [1757592044973, 114016.78333491352],
            [1757595611356, 114045.24306152646],
            [1757599367248, 114181.76302947623],
            [1757602936287, 114499.29484245343],
            [1757606558478, 114136.79634924185],
            [1757610016404, 114499.52326893095],
            [1757613737055, 114546.6290692586],
            [1757617306198, 114309.82612735903],
            [1757620954225, 114435.8890920037],
            [1757624561482, 114402.34864966485],
            [1757628156526, 114531.97774766892],
            [1757631755315, 115251.54504573994],
            [1757635331931, 115503.16663193036],
            [1757638847600, 116083.02684089626],
            [1757642559108, 115541.43745371678],
            [1757646140659, 115321.70299565145],
            [1757649743377, 115198.04689576305],
            [1757653320681, 115430.88537282546],
            [1757656967846, 115656.41297780728],
            [1757660585554, 115339.65347651657],
            [1757664157781, 115143.92060273138],
            [1757667764701, 115090.51727175506],
            [1757671350254, 114977.79702489631],
            [1757674945697, 114970.87662702953],
            [1757678476911, 114944.79334030187],
            [1757682171250, 115175.7456241166],
            [1757685759203, 115182.63512744215],
            [1757689271665, 115285.82631433172],
            [1757692887205, 115142.91591236314],
            [1757696543182, 115501.53307003953],
            [1757700168958, 115870.54337234636],
            [1757703743134, 116488.13043144876],
            [1757707407777, 116704.71486571954],
            [1757710903796, 116206.13807664244],
            [1757714421908, 115951.31496911978],
            [1757718159610, 116094.98634284323],
            [1757721750890, 116160.14344594491],
            [1757725360260, 116299.90574103985],
            [1757728950447, 115817.78761225037],
            [1757732508947, 115929.71072468456],
            [1757736179076, 115987.13156450838],
            [1757739726190, 115761.02619141128],
            [1757743351028, 115744.35387449336],
            [1757746991576, 115790.53202643781],
            [1757750516989, 115828.38046332698],
            [1757754155122, 116027.12405597334],
            [1757757734685, 116073.3506135664],
            [1757761363344, 116017.51962998649],
            [1757764932834, 116020.66710769299],
            [1757768497877, 116060.83417133584],
            [1757772134948, 115768.32118748053],
            [1757775702113, 115842.8482057885],
            [1757779372275, 115784.10669515507],
            [1757782966879, 115342.81410658239],
            [1757786574699, 115567.65641109124],
            [1757790125801, 115688.73490201971],
            [1757793714246, 115837.62867738264],
            [1757797357176, 115975.60665830794],
            [1757800987780, 115902.80087265448],
            [1757804534659, 115914.67697398618],
            [1757808112178, 115974.8873939637],
            [1757811821245, 115972.63064708588],
            [1757815365664, 116020.94225644319],
            [1757818801850, 115908.55482647114],
            [1757822554025, 115771.51295218767],
            [1757826102725, 115806.95820776705],
            [1757829743630, 115931.29222477932],
            [1757833347439, 115782.5467124972],
            [1757836976063, 115800.96862956286],
            [1757840573749, 115974.03122043426],
            [1757844168483, 116143.86978301249],
            [1757847761958, 116069.58488194742],
            [1757851363745, 115882.85033622767],
            [1757854964371, 115816.94199120873],
            [1757858583108, 115335.02449154813],
            [1757862182402, 115424.06207419037],
            [1757865701826, 115264.81046966574],
            [1757869585299, 115525.17752438669],
            [1757872902783, 115618.63633362162],
            [1757876557860, 115440.71361146877],
            [1757880141702, 115673.89884462305],
            [1757883665532, 115854.91350751821],
            [1757887362564, 115965.65715814185],
            [1757890949909, 116031.2706523723],
            [1757894536596, 115278.55251586219],
            [1757898064862, 115079.57387944871],
            [1757901640747, 115221.82820884661],
            [1757905365175, 115416.66833998004],
            [1757908878993, 115501.3042235996],
            [1757912589463, 116039.88908636587],
            [1757916124567, 116552.24107354402],
            [1757919760860, 116168.09610340101],
            [1757923358802, 115792.1934414128],
            [1757926990656, 114850.5440850557],
            [1757930573047, 114911.21426941568],
            [1757934028962, 114801.40925717361],
            [1757937819535, 115033.54381311937],
            [1757941284790, 114744.92311789298],
            [1757944970157, 114843.50523291624],
            [1757948559051, 114840.07931502667],
            [1757952184032, 114798.22619184008],
            [1757955635789, 114696.00606119882],
            [1757959366067, 114913.60325521955],
            [1757962900991, 115354.79218701142],
            [1757966517993, 115314.09587210546],
            [1757970167117, 115315.75715379852],
            [1757973744842, 115507.66358734564],
            [1757977335705, 115299.78030175949],
            [1757980932908, 115356.68489564986],
            [1757984469225, 115085.03010859179],
            [1757988150553, 115069.45354548478],
            [1757991758044, 115082.07756660205],
            [1757995366174, 115398.77427960283],
            [1757998960101, 115487.13956192977],
            [1758002553105, 115983.38149554328],
            [1758006002950, 115753.79463886896],
            [1758007323000, 115861.13479611727],
        ],
    },
};

const OverlappingPredictionsChart = () => {
    const predictions = FedData.chart_data.past_predictions;

    const transformPredictionData = useCallback(() => {
        const series = [] as TSeries[];

        // Process each prediction
        predictions.forEach((prediction, index) => {
            // Convert chart_data to ApexCharts format
            const chartPoints = prediction.chart_data.map((point) => ({
                x: point.timestamp, // Already in milliseconds
                y: point.price,
                // volatility: point.volatility, // Additional data for tooltip
            }));

            // Add anchor point if it exists and is different from first point
            const seriesData = [...chartPoints] as TChartPoint[];
            if (
                prediction.anchor_point &&
                prediction.anchor_point.timestamp !== chartPoints[0]?.x
            ) {
                seriesData.unshift({
                    x: prediction.anchor_point.timestamp,
                    y: prediction.anchor_point.price,
                    isAnchor: true,
                });
            }

            series.push({
                name: `${prediction.case} (${prediction.accuracy_score}% accuracy)`,
                data: seriesData,
                type: "line",
                color: `hsl(${(index * 50) % 360}, 70%, 60%)`,
                strokeWidth: 2,
                strokeDashArray: prediction.case === "baseline" ? 0 : 5, // Solid for baseline, dashed for others
                zIndex: prediction.case === "baseline" ? 10 : 1,
                opacity: prediction.case === "baseline" ? 1 : 0.8,
            });
        });

        return series;
    }, [predictions]);

    // Transform base historical data to ApexCharts format
    const transformBaseData = useCallback((): TSeries => {
        const chartPoints = baseData.history.prices.map(
            ([timestamp, price]) => ({
                x: timestamp, // Already in milliseconds
                y: price,
            })
        );

        return {
            name: `${baseData.coin.name} (${baseData.coin.ticker}) - Actual`,
            data: chartPoints,
            type: "line",
            color: "var(--alpha-primary)",
            strokeWidth: 3,
            zIndex: 20, // Highest priority for actual data
            opacity: 1,
        };
    }, []);

    const series = useMemo(() => {
        const dataSeries = [transformBaseData(), ...transformPredictionData()];
        return dataSeries;
    }, [transformBaseData, transformPredictionData]);

    const options = {
        chart: {
            type: "line",
            zoom: {
                enabled: false,
                type: "x",
                autoScaleYaxis: false,
            },
            toolbar: {
                show: false,
            },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
            },
            redrawOnParentResize: true,
        },
        colors: [
            "var(--alpha-primary)",
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FECA57",
            "#FF9FF3",
            "#54A0FF",
            "#5F27CD",
            "#00D2D3",
            "#FF9F43",
        ],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight",
            width: [3, ...Array(10).fill(2)], // Thicker line for actual data
        },
        legend: {
            show: false,
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
                datetimeFormatter: {
                    year: "yyyy",
                    month: "MMM 'yy",
                    day: "dd MMM",
                    hour: "HH:mm",
                },
                // format: "MMM dd", // Add this line for date formatting
                style: {
                    colors: "var(--alpha-primary-200)",
                    fontSize: "10px",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 500,
                    cssClass: "apexcharts-xaxis-label",
                },
                // formatter: (value: number) => {
                //     console.log("value date", value);
                //     return new Date(value).toLocaleDateString("en-US", {
                //         month: "short",
                //         day: "numeric",
                //         // year: "2-digit",
                //     });
                // },
            },
            // convertedCatToNumeric: false,
        },
        yaxis: {
            tickAmount: 3,
            decimalsInFloat: false,

            labels: {
                datetimeUTC: false,
                style: {
                    colors: "var(--alpha-primary-200)",
                    fontSize: "10px",
                    fontWeight: 500,
                    fontFamily: "Arial, sans-serif",
                    cssClass: "apexcharts-xaxis-label",
                },
                formatter: (value: number) => {
                    return formatNumber({
                        value,
                        style: ENumberStyle.Currency,
                        currency: "USD",
                    }).value;
                },
            },
            axisBorder: {
                show: true,
                color: "var(--alpha-border)",
                offsetX: 0,
                offsetY: 0,
            },
            axisTicks: {
                show: true,
                borderType: "solid",
                color: "var(--alpha-border)",
                width: 6,
                offsetX: 0,
                offsetY: 0,
            },
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
        },
        tooltip: {
            shared: true,
            intersect: false,
            x: {
                format: "MMM dd, yyyy",
            },
            y: {
                formatter(val: number) {
                    return `$${val.toFixed(2)}`;
                },
            },
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false,
                },
            },
        },
    };

    return (
        <ApexLineChart
            options={options}
            series={series}
            width="100%"
            height="100%"
        />
    );
};

export default OverlappingPredictionsChart;
