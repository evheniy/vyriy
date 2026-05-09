export declare const isAbortError: (error: unknown) => boolean;
export declare const isRetryableMethod: (method: string, retryMethods: string[]) => boolean;
export declare const isRetryableError: (error: unknown, signal: AbortSignal | null | undefined, retryStatuses: number[]) => boolean;
export declare const wait: (delay: number) => Promise<void>;
