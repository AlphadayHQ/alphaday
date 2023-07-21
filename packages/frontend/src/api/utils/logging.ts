import * as Sentry from "@sentry/react";
import CONFIG from "../../config/config";

const { LOGLEVEL } = CONFIG;

export enum ELogLevel {
    Debug,
    Info,
    Warn,
    Error,
    Nothing,
}

let logLevel: ELogLevel;

const notProd = CONFIG.IS_DEV || CONFIG.IS_STAGING;

logLevel = ((): ELogLevel => {
    if (LOGLEVEL in ELogLevel) {
        // allow to set any arbitrary debug level only if this is not a prod build
        if (notProd) {
            return LOGLEVEL;
        }
        if (LOGLEVEL >= 0 && LOGLEVEL < ELogLevel.Warn) {
            // if this is a prod build, we do not allow logLevel < Warn
            return ELogLevel.Warn;
        }
    }
    return notProd ? ELogLevel.Debug : ELogLevel.Warn;
})();

/* eslint-disable no-console */
const consoleLogger = {
    debug: console.log, // console.debug is hidden by default in chrome
    /* eslint-disable-next-line @typescript-eslint/unbound-method */
    info: console.info,
    warn: console.warn,
    error: console.error,
};
/* eslint-enable no-console */

let logger = consoleLogger;

export const setLogger = (newLogger: typeof consoleLogger): void => {
    logger = newLogger;
};

export const setLogLevel = (level: ELogLevel): void => {
    if (!notProd) return;
    logLevel = level;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const Logger = {
    debug: (message: string, ...args: any): boolean | void =>
        /* eslint-disable-next-line */
        ELogLevel.Debug >= logLevel && logger.debug(message, ...args),
    info: (message: string, ...args: any): boolean | void =>
        /* eslint-disable-next-line */
        ELogLevel.Info >= logLevel && logger.info(message, ...args),
    warn: (message: string, ...args: any): boolean | void =>
        /* eslint-disable-next-line */
        ELogLevel.Warn >= logLevel && logger.warn(message, ...args),
    error: (message: string, ...args: any): boolean | void => {
        if (ELogLevel.Error >= logLevel) {
            /* eslint-disable-next-line */
            logger.error(message, ...args);
            // note: sentry does not provide a way to check whether it has
            // been successfully initialised
            if (CONFIG.SENTRY.ENABLE) {
                try {
                    /* eslint-disable @typescript-eslint/restrict-template-expressions */
                    const msg =
                        args && args.length
                            ? `${message}: ${JSON.stringify(args)}`
                            : message;
                    /* eslint-enable @typescript-eslint/restrict-template-expressions */
                    Sentry.captureMessage(msg, "error");
                } catch (_error) {
                    // do nothing
                }
            }
        }
    },
    setLogger,
};
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
