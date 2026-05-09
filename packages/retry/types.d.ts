export type Handler = () => Promise<unknown>;
export type RetryOptions = {
    retries?: number;
    delay?: number;
};
export type Retry = (handler: Handler, options?: RetryOptions) => Promise<unknown>;
export type Run = (attempt?: number) => Promise<unknown>;
