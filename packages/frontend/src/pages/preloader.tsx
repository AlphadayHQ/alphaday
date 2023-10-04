import { Spinner } from "@alphaday/ui-kit";
import UI_CONFIG from "src/config/ui";

const { Z_INDEX_REGISTRY } = UI_CONFIG;

const Preloader = () => (
    <div
        className="w-full h-full flex justify-center items-center fixed bg-background"
        style={{ zIndex: Z_INDEX_REGISTRY.PRELOADER }}
    >
        <Spinner size="lg" color="primary" />
    </div>
);

export default Preloader;
