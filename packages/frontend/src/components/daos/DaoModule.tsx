import { FC, memo } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import { TDaoItem } from "src/api/types";
import DaoItemList from "./DaoItemList";

interface IDao {
    items: TDaoItem[] | undefined;
    isLoadingItems: boolean;
    handlePaginate: (type: "next" | "previous") => void;
    widgetHeight: number;
}

const DaoModule: FC<IDao> = memo(function DaoModule({
    items,
    isLoadingItems,
    handlePaginate,
    widgetHeight,
}) {
    return isLoadingItems || !items ? (
        <ModuleLoader $height={`${String(widgetHeight)}px`} />
    ) : (
        <div>
            <DaoItemList items={items} handlePaginate={handlePaginate} />
        </div>
    );
});

export default DaoModule;
