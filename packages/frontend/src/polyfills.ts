import { Buffer } from "buffer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).global = window;
global.Buffer = Buffer;
global.process = {
    // Only what Node-style dependencies (web3, util, etc.) may read. Do NOT
    // pass `import.meta.env` here: referencing the whole object makes Vite
    // inline every VITE_* variable from the build environment into the
    // bundle, including ones the app never uses.
    env: { NODE_ENV: import.meta.env.PROD ? "production" : "development" },
    version: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
