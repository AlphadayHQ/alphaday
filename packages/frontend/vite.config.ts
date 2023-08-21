/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), react(), svgr()],
    css: {
        modules: {
            localsConvention: "camelCase",
        },
    },
    server: {
        port: 3001,
    },
    test: {
        globals: true,
        environment: "happy-dom",
    },
});
