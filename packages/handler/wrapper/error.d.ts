export type ErrorOptions = {
    errorHandler?: (err: unknown) => Promise<void>;
    throwError?: boolean;
};
export declare const withError: <Event, Result>(options?: ErrorOptions | undefined) => import("../types.js").Decorator<Event, Result>;
