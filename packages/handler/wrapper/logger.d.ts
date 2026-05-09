export type LoggerOptions = {
    logger?: typeof console;
};
export declare const withLogger: <Event, Result>(options?: LoggerOptions | undefined) => import("../types.js").Decorator<Event, Result>;
