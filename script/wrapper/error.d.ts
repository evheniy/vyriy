export type ErrorOptions = {
    errorHandler?: (err: unknown) => Promise<void>;
};
export declare const withError: (options?: ErrorOptions | undefined) => import("../types.js").Decorator;
