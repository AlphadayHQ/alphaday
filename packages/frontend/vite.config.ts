import { fileURLToPath, URL } from "url";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), legacy(), svgr()],
    resolve: {
        alias: [
            {
                find: "src",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
        ],
    },
});
