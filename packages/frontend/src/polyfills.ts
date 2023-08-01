import { Buffer } from "buffer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).global = window;
global.Buffer = Buffer;
global.process = {
    env: import.meta.env,
    version: "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
