export declare class BaseRouter<CurrentHandler> {
    protected fallbackHandler?: CurrentHandler;
    protected readonly routes: Record<string, Record<string, CurrentHandler>>;
    on(method: string, path: string, handler: CurrentHandler): this;
    fallback(handler: CurrentHandler): this;
}
