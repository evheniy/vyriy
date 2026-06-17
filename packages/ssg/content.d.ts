import type { BuildStaticSiteOptions, ContentEntry, ContentSectionBuildResult, HomePageFeaturedContentItem, RelatedDocumentsMap, SearchDocument, StaticSiteSection } from './types.js';
type ContentDataSection = {
    readonly entries: readonly ContentEntry[];
    readonly section: string;
};
type RenderOptions = Required<Pick<BuildStaticSiteOptions, 'defaultTitle' | 'footerText' | 'siteName'>> & Pick<BuildStaticSiteOptions, 'googleAnalyticsMeasurementId' | 'siteUrl' | 'stylesheetContent' | 'stylesheetHref'>;
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
export declare const findReadmePaths: (directory: string) => Promise<readonly string[]>;
export declare const buildContentEntries: (section: StaticSiteSection, contentPath: string, defaultTitle?: string) => Promise<ContentEntry[]>;
export declare const buildContentSection: (section: StaticSiteSection, contentPath: string, outputDirectory: string, renderOptions: RenderOptions) => Promise<ContentSectionBuildResult>;
export declare const writeContentEntryDocuments: (section: StaticSiteSection, entries: readonly ContentEntry[], outputDirectory: string, renderOptions: RenderOptions & {
    readonly relatedDocuments?: RelatedDocumentsMap;
}) => Promise<void>;
export declare const getSearchDocuments: (section: string, entries: readonly ContentEntry[]) => readonly SearchDocument[];
export declare const getSiteSearchDocuments: (sections: readonly ContentDataSection[]) => readonly SearchDocument[];
export declare const getMiniSearchIndexJson: (documents: readonly SearchDocument[]) => unknown;
export declare const getRelatedDocumentsMap: (documents: readonly SearchDocument[]) => RelatedDocumentsMap;
export declare const getHomePageFeaturedContent: (sections: readonly ContentDataSection[]) => readonly HomePageFeaturedContentItem[];
export declare const writeContentData: (sections: readonly ContentDataSection[], outputDirectory: string) => Promise<void>;
export {};
