/// <reference types="vitest" />
import * as path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { optimizeCssModules } from "vite-plugin-optimize-css-modules";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(),
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
                globPatterns: ["**/*.{css,ico,png,svg}"],
            },
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon-180x180.png",
                "maskable-icon-512x512.png",
            ],
            manifest: {
                name: "Alphaday",
                short_name: "Alphaday",
                description: "",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "pwa-64x64.png",
                        sizes: "64x64",
                        type: "image/png",
                    },
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
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
    define: {
        "import.meta.env.VITE_VERSION": JSON.stringify(
            process.env.npm_package_version
        ),
    },
});
