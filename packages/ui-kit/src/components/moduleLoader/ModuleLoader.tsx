import { FC } from "react";
import { Z_INDEX_REGISTRY } from "src/config/zIndexRegistry";
import { twMerge } from "tailwind-merge";
import { Spinner } from "../spinner/Spinner";

interface IModuleLoaderProps {
    $height: string;
    collapse?: boolean;
}

export const ModuleLoader: FC<IModuleLoaderProps> = ({
    $height,
    collapse = false,
}) => (
    <div
        className={twMerge(
            "`flex h-full w-full items-center justify-center",
            collapse ? "hidden" : "flex"
        )}
        style={{
            height: $height,
            zIndex: Z_INDEX_REGISTRY.MODULE_LOADER,
        }}
    >
        <Spinner size="lg" color="primary" />
    </div>
);
