import {
    FC,
    FormEvent,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DimensionsContext } from "src/api/store/providers/dimensions-context";
import {
    TCustomLayoutEntry,
    TCustomRowProps,
    TCustomItem,
} from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import CONFIG from "src/config";
import { GridBasedTable } from "../custom-modules/TableComponents";

const { WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT } = CONFIG.WIDGETS.TABLE;
const HEADER_HEIGHT = 22;

interface IDuneTableProps {
    items: TCustomItem[];
    columns: TCustomLayoutEntry[];
    rowProps: TCustomRowProps | undefined;
    widgetHeight: number;
    isLoadingItems: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    setWidgetHeight: (size: number) => void;
    duneMeta?: {
        widgetName: string;
        duneQueryURL: string;
        importTime: string;
    } | null;
}

const DuneTableModule: FC<IDuneTableProps> = ({
    items,
    columns,
    rowProps,
    widgetHeight,
    isLoadingItems,
    handlePaginate,
    setWidgetHeight,
    duneMeta,
}) => {
    const { widgetsSize } = useContext(DimensionsContext);
    const { t } = useTranslation();
    const [scrollRef, setScrollRef] = useState<HTMLElement | undefined>();
    const prevScrollRef = useRef<HTMLElement | undefined>();

    useEffect(() => {
        if (scrollRef !== prevScrollRef.current) {
            if (scrollRef) {
                const height =
                    Array.from(scrollRef.children).reduce(
                        (partialSum, child) => partialSum + child.clientHeight,
                        0
                    ) + HEADER_HEIGHT;
                // there seems to be a weird case where the scrollRef is valid,
                // but the height of the items is 0, so we end up with
                // height = HEADER_HEIGHT;
                if (height > HEADER_HEIGHT) {
                    setWidgetHeight(Math.min(height, DEFAULT_WIDGET_HEIGHT));
                }
            }
            prevScrollRef.current = scrollRef;
        }
    }, [scrollRef, setWidgetHeight]);

    const handleScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    const minCellSize = useMemo(
        () =>
            widgetsSize?.width !== undefined
                ? widgetsSize.width / columns.length - 16 // 16 here is a magic number needs futher testing
                : undefined,
        [columns.length, widgetsSize?.width]
    );

    if (isLoadingItems) {
        return <ModuleLoader $height={`${widgetHeight}px`} />;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-auto h-300 justify-center items-center">
                <p>{t("others.noItemsFound")}</p>
            </div>
        );
    }

    return (
        <div className="h-25 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primaryVariant100 scrollbar-thumb-rounded">
            {duneMeta && (
                <div className="px-4 pb-2 text-center text-xs text-primaryVariant200">
                    <span className="font-semibold text-primary">
                        {duneMeta.widgetName}
                    </span>
                    {" | "}
                    <span>
                        {moment(duneMeta.importTime).format(
                            "MMM DD, YYYY HH:mm"
                        )}
                    </span>
                </div>
            )}
            <ScrollBar
                onScroll={handleScroll}
                className="pl-2 pr-[3px] !overflow-x-visible !overflow-y-auto"
                containerRef={setScrollRef}
                style={{
                    height: widgetHeight,
                }}
            >
                <div className="min-w-fit h-full min-h-0">
                    <GridBasedTable
                        columnsLayout={columns}
                        items={items}
                        rowProps={rowProps}
                        minCellSize={minCellSize}
                        options={{ dateformat: "MMM DD, YYYY" }}
                    />
                </div>
            </ScrollBar>
        </div>
    );
};

export default DuneTableModule;
