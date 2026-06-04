import type { ApiEvent, ApiResult, Handler } from '@vyriy/handler';
import type { RouterApi } from '@vyriy/router';
export type StaticOptions = {
    readonly directory?: string;
    readonly index?: string;
    readonly error?: string;
};
export type StaticMountOptions = StaticOptions | string;
export type StaticHandler = Handler<ApiEvent, ApiResult>;
export type StaticServer = (options?: StaticOptions) => Promise<number>;
export type StaticRouterApi = Omit<RouterApi, 'delete' | 'fallback' | 'get' | 'patch' | 'post' | 'put'> & {
    static(path: string, options?: StaticMountOptions): StaticRouterApi;
} & {
    [Method in Extract<keyof RouterApi, 'delete' | 'fallback' | 'get' | 'patch' | 'post' | 'put'>]: (...args: Parameters<RouterApi[Method]>) => StaticRouterApi;
};
