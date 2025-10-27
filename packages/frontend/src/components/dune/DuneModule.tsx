import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { Button, ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { useWidgetBreakpoints } from "src/api/hooks";
import {
    TCustomLayoutEntry,
    TCustomRowProps,
    TCustomItem,
} from "src/api/types";
import { shouldFetchMoreItems } from "src/api/utils/itemUtils";
import {
    CompactTableRow,
    TableHeader,
    TableRow,
} from "src/components/custom-modules/TableComponents";
import CONFIG from "src/config";
import AddressInput from "./EndpointInput";

const { WIDGET_HEIGHT: DEFAULT_WIDGET_HEIGHT } = CONFIG.WIDGETS.TABLE;
const HEADER_HEIGHT = 22;
// allow standard layout for tables of up to STD_LAYOUT_MAX_SIZE columns
const STD_LAYOUT_MAX_SIZE = 4;

const validateUrl = (url: string): boolean => {
    try {
        URL.parse(url);
        return true;
    } catch (error) {
        return false;
    }
};

interface IDuneModuleProps {
    items: TCustomItem[] | undefined;
    columns: TCustomLayoutEntry[];
    rowProps: TCustomRowProps | undefined;
    widgetHeight: number;
    isLoadingItems: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    setWidgetHeight: (size: number) => void;
    onSetEndpointUrl: (url: string) => void;
}

const DuneModule: FC<IDuneModuleProps> = ({
    items,
    columns,
    rowProps,
    widgetHeight,
    isLoadingItems,
    handlePaginate,
    setWidgetHeight,
    onSetEndpointUrl,
}) => {
    const { t } = useTranslation();
    const widgetSize = useWidgetBreakpoints([500]);
    const isCompactMode =
        widgetSize === "sm" || columns.length > STD_LAYOUT_MAX_SIZE;
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
    }, [scrollRef, prevScrollRef, setWidgetHeight]);

    const handleScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (shouldFetchMoreItems(currentTarget)) {
            handlePaginate("next");
        }
    };

    const addLinkColumn = rowProps?.uri_ref !== undefined;
    const [showEnterAddress, setShowEnterAddress] = useState(false);
    const [disableAddAddressInput, setDisableAddAddressInput] = useState(true);

    const onInputChange = (addr: string) =>
        setDisableAddAddressInput(!validateUrl(addr));

    if (isLoadingItems) {
        return <ModuleLoader $height={`${widgetHeight}px`} />;
    }

    if (!items) {
        return (
            <div className="flex my-4 mx-auto justify-center">
                <div className="flex w-[315px] justify-center tiny:scale-95">
                    <Button
                        variant="primaryXL"
                        title="Enter a Dune endpoint URL"
                        onClick={() => setShowEnterAddress(true)}
                        className=" max-w-[49%]"
                    >
                        {t("buttons.enterEndpointURL")}
                    </Button>
                    <AddressInput
                        onChange={onInputChange}
                        onAddAddress={onSetEndpointUrl}
                        show={showEnterAddress}
                        onClose={() => setShowEnterAddress(false)}
                        disabled={disableAddAddressInput}
                    />
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-auto h-300 justify-center items-center">
                <p>{t("others.noItemsFound")}</p>
            </div>
        );
    }

    return (
        <div className="h-25">
            {!isCompactMode && (
                <TableHeader layout={columns} addExtraColumn={addLinkColumn} />
            )}
            <ScrollBar
                onScroll={handleScroll}
                className="divide-y divide-solid divide-borderLine pl-2 pr-[3px]"
                containerRef={setScrollRef}
                style={{
                    height: widgetHeight - HEADER_HEIGHT,
                }}
            >
                {items.map((item) => {
                    return isCompactMode ? (
                        <CompactTableRow
                            columnsLayout={columns}
                            rowData={item}
                            rowProps={rowProps}
                            key={item.id}
                        />
                    ) : (
                        <TableRow
                            columnsLayout={columns}
                            rowData={item}
                            rowProps={rowProps}
                            key={item.id}
                        />
                    );
                })}
            </ScrollBar>
        </div>
    );
};

export default DuneModule;
