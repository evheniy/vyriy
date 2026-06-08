import type { StaticCacheConfig, UseSpaOptions, UseStaticOptions } from './types.js';
export type NormalizedStaticOptions = UseStaticOptions & {
    readonly cache: StaticCacheConfig;
    readonly directory: string;
    readonly index: false | string;
    readonly notFound: false | string;
};
export type NormalizedSpaOptions = UseSpaOptions & {
    readonly cache: StaticCacheConfig;
    readonly directory: string;
    readonly fallback: string;
};
export declare const normalizeStaticOptions: (directory?: string, options?: UseStaticOptions) => NormalizedStaticOptions;
export declare const normalizeSpaOptions: (directory?: string, options?: UseSpaOptions) => NormalizedSpaOptions;
