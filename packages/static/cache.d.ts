import type { ApiEvent, ApiResult } from '@vyriy/handler';
import type { StaticCacheConfig, StaticCacheOptions, StaticCachePreset } from './types.js';
type ResolvedCacheOptions = Required<Pick<StaticCacheOptions, 'etag' | 'lastModified'>> & Pick<StaticCacheOptions, 'immutable' | 'maxAge' | 'staleIfError' | 'staleWhileRevalidate'> & {
    readonly cacheControl: string;
};
export declare const resolveCacheOptions: (cache: StaticCacheConfig | undefined, filePath: string, defaultCache: StaticCachePreset) => ResolvedCacheOptions;
export declare const createEtag: (size: number, modifiedTime: Date) => string;
export declare const createCacheHeaders: (cache: ResolvedCacheOptions, size: number, modifiedTime: Date) => Record<string, string>;
export declare const maybeNotModified: (event: ApiEvent, headers: Record<string, string>) => ApiResult | undefined;
export {};
