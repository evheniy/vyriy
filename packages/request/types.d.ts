export type Options = {
    retries?: number;
    timeout?: number;
    retryDelay?: number;
    retryMethods?: string[];
    retryStatuses?: number[];
};
export type StreamChunkHandlerParams = {
    attempt: number;
    response: Response;
};
export type StreamChunkHandler = (chunk: Uint8Array, params: StreamChunkHandlerParams) => Promise<void> | void;
export type StreamOptions = Options & {
    onChunk?: StreamChunkHandler;
};
export type Request = <R = Record<string, unknown>>(input: RequestInfo | URL, init?: RequestInit | null, options?: Options) => Promise<R>;
export type RequestStream = (input: RequestInfo | URL, init?: RequestInit | null, options?: StreamOptions) => Promise<Response>;
