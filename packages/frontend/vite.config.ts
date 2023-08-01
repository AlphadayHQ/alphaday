import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: [
            {
                find: "src",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
        ],
    },
    server: {
        port: 3000,
    },
});
