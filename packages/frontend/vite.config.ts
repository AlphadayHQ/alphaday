/// <reference types="vitest" />
import * as path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { optimizeCssModules } from "vite-plugin-optimize-css-modules";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const plugins = [
        tsconfigPaths(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
            },
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
                navigateFallbackAllowlist: [/^\//],
                maximumFileSizeToCacheInBytes: 1024 * 1024 * 4,
            },
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon-180x180.png",
                "maskable-icon-512x512.png",
            ],
            manifest: {
                id: "com.alphaday.pwa",
                name: "Alphaday",
                short_name: "Alphaday",
                description: "News, Information & Curated Research - Alphaday",
                theme_color: "#FAA202",
                orientation: "portrait",
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
    ];
    if (env.VITE_USE_SSH === "true") {
        plugins.push(
            basicSsl({
                name: "Alphaday",
                domains: ["app.localday.com"],
                certDir:
                    process.env.CERT_DIR || path.resolve(__dirname, "certs"),
            })
        );
    }
    return {
        plugins,
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
    };
});
