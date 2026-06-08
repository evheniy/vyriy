export declare class HttpError extends Error {
    readonly status: number;
    readonly url: string;
    constructor(response: Response);
}
export declare class TimeoutError extends Error {
    readonly timeout: number;
    constructor(timeout: number);
}
