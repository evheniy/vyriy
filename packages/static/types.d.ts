import type { ApiEvent, ApiResult, Handler } from '@vyriy/handler';
import type { Handler as RouterHandler, RouterApi } from '@vyriy/router';
export type StaticCachePreset = false | 'none' | 'default' | 'static' | 'immutable';
export type StaticCacheOptions = {
    readonly etag?: boolean;
    readonly immutable?: boolean;
    readonly lastModified?: boolean;
    readonly maxAge?: number;
    readonly staleIfError?: number;
    readonly staleWhileRevalidate?: number;
};
export type StaticCacheRule = {
    readonly cache: StaticCachePreset | StaticCacheOptions;
    readonly match: string | readonly string[];
};
export type StaticCacheConfig = StaticCachePreset | StaticCacheOptions | {
    readonly fallback?: StaticCachePreset | StaticCacheOptions;
    readonly rules: readonly StaticCacheRule[];
};
export type StaticHeaderContext = {
    readonly filePath: string;
    readonly requestPath: string;
    readonly statusCode: number;
};
export type StaticBaseOptions = {
    readonly cache?: StaticCacheConfig;
    readonly headers?: HeadersInit | ((context: StaticHeaderContext) => HeadersInit);
};
export type UseStaticOptions = StaticBaseOptions & {
    readonly index?: false | string;
    readonly notFound?: false | string;
};
export type UseSpaOptions = StaticBaseOptions & {
    readonly fallback?: string;
};
export type StaticServerOptions = (UseStaticOptions | UseSpaOptions) & {
    readonly directory?: string;
    readonly spa?: boolean;
};
export type StaticHandler = Handler<ApiEvent, ApiResult>;
export type StaticServer = (options?: StaticServerOptions) => Promise<number>;
export type StaticRouterApi = Omit<RouterApi, 'all' | 'delete' | 'fallback' | 'get' | 'patch' | 'post' | 'put'> & {
    static(path: string, directory: string, options?: UseStaticOptions): StaticRouterApi;
    spa(path: string, directory: string, options?: UseSpaOptions): StaticRouterApi;
    fallbackStatic(directory: string, options?: UseStaticOptions): StaticRouterApi;
    fallbackSpa(directory: string, options?: UseSpaOptions): StaticRouterApi;
} & {
    [Method in Extract<keyof RouterApi, 'all' | 'delete' | 'get' | 'patch' | 'post' | 'put'>]: (...args: Parameters<RouterApi[Method]>) => StaticRouterApi;
} & {
    fallback(handler: RouterHandler): StaticRouterApi;
};
