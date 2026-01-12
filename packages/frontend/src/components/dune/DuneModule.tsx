import { FC, useState } from "react";
import { Button, ModuleLoader } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import {
    TCustomLayoutEntry,
    TCustomRowProps,
    TCustomItem,
} from "src/api/types";
import DuneTableModule from "./DuneTableModule";
import EndpointInput from "./EndpointInput";

interface IDuneModuleProps {
    items: TCustomItem[] | undefined;
    columns: TCustomLayoutEntry[];
    rowProps: TCustomRowProps | undefined;
    widgetHeight: number;
    isLoadingItems: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    setWidgetHeight: (size: number) => void;
    onSetDuneMeta: (data: {
        widgetName: string;
        duneQueryURL: string;
        importTime: string;
    }) => void;
    duneMeta: {
        widgetName: string;
        duneQueryURL: string;
        importTime: string;
    } | null;
}

const DuneModule: FC<IDuneModuleProps> = ({
    items,
    columns,
    rowProps,
    widgetHeight,
    isLoadingItems,
    handlePaginate,
    setWidgetHeight,
    onSetDuneMeta,
    duneMeta,
}) => {
    const { t } = useTranslation();
    const [showEnterAddress, setShowEnterAddress] = useState(false);

    if (isLoadingItems && !items) {
        return <ModuleLoader $height={`${widgetHeight}px`} />;
    }

    if (!items) {
        return (
            <div className="flex my-14 two-col:my-[18px] mx-auto justify-center">
                <div className="flex w-[315px] justify-center tiny:scale-95">
                    <Button
                        variant="primaryXL"
                        title="Enter a Dune endpoint URL"
                        onClick={() => setShowEnterAddress(true)}
                    >
                        {t("buttons.enterEndpointURL")}
                    </Button>
                    <EndpointInput
                        onSetDuneMeta={onSetDuneMeta}
                        show={showEnterAddress}
                        onClose={() => setShowEnterAddress(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <DuneTableModule
            items={items}
            columns={columns}
            rowProps={rowProps}
            isLoadingItems={isLoadingItems}
            handlePaginate={handlePaginate}
            setWidgetHeight={setWidgetHeight}
            widgetHeight={widgetHeight}
            duneMeta={duneMeta}
        />
    );
};

export default DuneModule;
