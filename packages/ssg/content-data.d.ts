import type { ContentEntry, ContentSection } from './types.js';
export type SearchDocument = {
    readonly content: string;
    readonly date?: string;
    readonly description: string;
    readonly id: string;
    readonly section: ContentSection;
    readonly slug: string;
    readonly tags: readonly string[];
    readonly title: string;
    readonly updatedAt?: string;
    readonly url: string;
};
export type RelatedDocument = {
    readonly description: string;
    readonly score: number;
    readonly section: ContentSection;
    readonly slug: string;
    readonly tags: readonly string[];
    readonly title: string;
    readonly url: string;
};
export type RelatedDocumentsMap = Record<string, readonly RelatedDocument[]>;
export type HomePageFeaturedContentItem = {
    readonly date?: string;
    readonly description: string;
    readonly homePageOrder?: number;
    readonly section: ContentSection;
    readonly slug: string;
    readonly tags: readonly string[];
    readonly title: string;
    readonly url: string;
};
export type ContentDataSection = {
    readonly entries: readonly ContentEntry[];
    readonly section: ContentSection;
};
export declare const contentSearchOptions: {
    boost: {
        content: number;
        description: number;
        tags: number;
        title: number;
    };
    fuzzy: number;
    prefix: boolean;
};
export declare const contentMiniSearchOptions: {
    fields: string[];
    storeFields: string[];
    searchOptions: {
        boost: {
            content: number;
            description: number;
            tags: number;
            title: number;
        };
        fuzzy: number;
        prefix: boolean;
    };
};
export declare const getPlainTextFromMarkdown: (markdown: string) => string;
export declare const getContentUrl: (section: ContentSection, slug: string) => string;
export declare const getSearchDocuments: (section: ContentSection, entries: readonly ContentEntry[]) => readonly SearchDocument[];
export declare const getSiteSearchDocuments: (sections: readonly ContentDataSection[]) => readonly SearchDocument[];
export declare const getMiniSearchIndexJson: (documents: readonly SearchDocument[]) => unknown;
export declare const getRelatedDocumentsMap: (documents: readonly SearchDocument[]) => RelatedDocumentsMap;
export declare const getHomePageFeaturedContent: (sections: readonly ContentDataSection[]) => readonly HomePageFeaturedContentItem[];
export declare const writeContentData: (sections: readonly ContentDataSection[], outputDirectory: string) => Promise<void>;
