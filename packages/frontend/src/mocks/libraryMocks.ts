import { TextEncoder, TextDecoder } from "util";

/**
 * Mock to fix TypeError: window.matchMedia is not a function
 * See https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 */
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

/**
 * Polyfill to fix `TextEncoder is not defined` error in jest
 * after introducing Uniswap dependency
 */
Object.assign(window, { TextDecoder, TextEncoder });

export {};
