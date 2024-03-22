import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.alphaday",
    appName: "alphaday",
    webDir: "dist",
    server: {
        androidScheme: "http",
        iosScheme: "http",
    },
    backgroundColor: "#121212",
};

export default config;
