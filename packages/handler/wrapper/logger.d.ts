export type LoggerOptions = {
    logger?: typeof console;
};
export declare const withLogger: <Event, Result, Args extends import("../types.js").HandlerArgs = [context: import("aws-lambda").Context]>(options?: LoggerOptions | undefined) => import("../types.js").Decorator<Event, Result, Args>;
