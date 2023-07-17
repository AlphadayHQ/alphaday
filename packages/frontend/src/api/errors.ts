/* eslint-disable max-classes-per-file */
import ExtendableError from "es6-error";

export class UnexpectedNull extends ExtendableError {}

export class RequestRejectedError extends ExtendableError {
    public readonly status: number | undefined;

    public readonly data?: {
        non_field_errors?: string[];
    };
}

export class MetamaskNotInstalledError extends ExtendableError {}

/* eslint-enable max-classes-per-file */
