/// <reference types="vitest" />
import * as path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { optimizeCssModules } from "vite-plugin-optimize-css-modules";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(),
        react(),
        svgr(),
        ViteImageOptimizer(), // optimize images, svgs and gifs
        optimizeCssModules(), // optimize css modules
    ],
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
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    resolve: {
        alias: {
            // hack to prevent uniswap widgets error on vite (see https://github.com/Uniswap/sdk-core/issues/20)
            jsbi: path.resolve(
                __dirname,
                "../..",
                "node_modules",
                "jsbi",
                "dist",
                "jsbi-cjs.js"
            ),
        },
    },
});
