import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    css: {
        modules: {
            localsConvention: "camelCase",
        },
    },
    resolve: {
        alias: [
            {
                find: "src",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
        ],
    },
});
