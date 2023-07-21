import ExtendableError from "es6-error";
import { Logger } from "./logging";

export class AssertionFailed extends ExtendableError {}

/* eslint-disable */
const assert = (value: any, message: string, ...args: any): never | void => {
    if (value) return;
    Logger.error(`Assertion failed: ${message}`, ...args);
    throw new AssertionFailed(message);
};
/* eslint-enable */

export default assert;
