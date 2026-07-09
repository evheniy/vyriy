import type { ContentEntry } from './types.js';
export declare const getMarkdownOutputPath: (outputDirectory: string, path: string) => string;
export declare const getMarkdownHref: (path: string) => string;
export declare const renderMarkdownPage: (entry: ContentEntry, siteUrl?: string) => string;
export declare const writeMarkdownPage: (outputDirectory: string, entry: ContentEntry, siteUrl?: string) => Promise<void>;
