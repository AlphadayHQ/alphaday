/**
 * Primitive types
 */
export type TRemoteStatus = {
    up: boolean;
    status_code: number;
    api_version: string;
    "Cache backend: default": string;
    DatabaseBackend: string;
    DefaultFileStorageHealthCheck: string;
    RedisHealthCheck: string;
};

/**
 * Queries
 */

// /status/
export type TGetStatusRequest = void;
export type TGetStatusResponse = TRemoteStatus;
