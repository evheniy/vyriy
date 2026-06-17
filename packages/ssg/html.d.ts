import type { ContentEntry, HomePageFeaturedContentItem, PageData, RelatedDocument } from './types.js';
type RenderDocumentOptions = {
    readonly canonicalPath?: string;
    readonly footerText: string;
    readonly googleAnalyticsMeasurementId?: string;
    readonly robotsDirective?: string;
    readonly siteName: string;
    readonly siteUrl?: string;
    readonly stylesheetContent?: string;
    readonly stylesheetHref?: string;
};
type RenderPageOptions = RenderDocumentOptions & {
    readonly featured?: readonly HomePageFeaturedContentItem[];
    readonly related?: readonly RelatedDocument[];
    readonly showTags?: boolean;
};
type RenderContentIndexOptions = RenderDocumentOptions & {
    readonly page?: number;
    readonly pages?: number;
    readonly sectionPath: string;
    readonly sectionTitle: string;
};
export declare const defaultStylesheet: string;
export declare const renderPage: (page: PageData, options: RenderPageOptions) => string;
export declare const renderContentIndex: (entries: readonly ContentEntry[], { page, pages, sectionPath, sectionTitle, ...documentOptions }: RenderContentIndexOptions) => string;
export declare const renderNotFoundPage: (options: RenderDocumentOptions) => string;
export declare const searchScript: string;
export declare const renderSearchPage: (options: RenderDocumentOptions) => string;
export {};
