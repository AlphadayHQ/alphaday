import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "io.ionic.starter",
    appName: "alphaday",
    webDir: "dist",
    server: {
        androidScheme: "http",
        iosScheme: "http",
    },
};

export default config;
