export type ErrorOptions = {
    errorHandler?: (err: unknown) => Promise<void>;
    throwError?: boolean;
};
export declare const withError: <Event, Result, Args extends import("../types.js").HandlerArgs = [context: import("aws-lambda").Context]>(options?: ErrorOptions | undefined) => import("../types.js").Decorator<Event, Result, Args>;
