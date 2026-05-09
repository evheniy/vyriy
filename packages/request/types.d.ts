export type Options = {
    retries?: number;
    timeout?: number;
    retryDelay?: number;
    retryMethods?: string[];
    retryStatuses?: number[];
};
export type Request = <R = Record<string, unknown>>(input: RequestInfo | URL, init?: RequestInit | null, options?: Options) => Promise<R>;
