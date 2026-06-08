export type LoggerOptions = {
    logger?: typeof console;
};
export declare const withLogger: (options?: LoggerOptions | undefined) => import("../types.js").Decorator;
