export type RouteParams = Record<string, string>;
export type Match<CurrentHandler> = {
    handler: CurrentHandler;
    params: RouteParams;
};
export declare const mergeParams: (existing: Record<string, string | undefined> | null | undefined, params: RouteParams) => Record<string, string | undefined> | undefined;
export declare class BaseRouter<CurrentHandler> {
    protected fallbackHandler?: CurrentHandler;
    protected readonly routes: Record<string, Record<string, CurrentHandler>>;
    private readonly dynamicRoutes;
    private readonly dynamicSignatures;
    on(method: string, path: string, handler: CurrentHandler): this;
    all(path: string, handler: CurrentHandler): this;
    fallback(handler: CurrentHandler): this;
    protected match(method: string, pathname: string): Match<CurrentHandler> | undefined;
    private register;
    private registerDynamic;
}
