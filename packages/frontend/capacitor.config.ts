import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.alphaday",
    appName: "alphaday",
    webDir: "dist",
    server: {
        androidScheme: "http",
        iosScheme: "http",
    },
    backgroundColor: "#FAA202",
};

export default config;
