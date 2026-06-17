import type { SitemapUrl } from './types.js';
export declare const getAbsoluteUrl: (path: string, siteUrl?: string) => string;
export declare const renderSitemap: (urls: readonly SitemapUrl[], siteUrl?: string) => string;
export declare const writeSitemap: (outputDirectory: string, urls: readonly SitemapUrl[], siteUrl?: string) => Promise<void>;
