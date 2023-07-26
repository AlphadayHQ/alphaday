import { Buffer } from "buffer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).global = window;
global.Buffer = Buffer;
global.process = {
    env: { DEBUG: undefined },
    version: "",
    // eslint-disable-next-line
    nextTick: require("next-tick"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
