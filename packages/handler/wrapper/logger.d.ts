export type LoggerOptions = {
    logger?: typeof console;
};
export declare const withLogger: <Event, Result>(options?: LoggerOptions | undefined) => import("../types.js").Decorator<Event, Result>;
export declare const streamWithLogger: <Event>(options?: LoggerOptions | undefined) => import("../types.js").StreamDecorator<Event>;
export declare const httpWithLogger: (options?: LoggerOptions | undefined) => import("../types.js").HttpDecorator;
