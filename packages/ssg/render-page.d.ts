import type { HomePageFeaturedContentItem, RelatedDocument } from './content-data.js';
import type { ContentEntry, ContentSection, PageData } from './types.js';
type RenderDocumentOptions = {
    readonly discoveryLinks?: readonly DiscoveryLink[];
    readonly googleAnalyticsMeasurementId?: string;
    readonly markdownAlternateHref?: string;
    readonly robotsDirective?: string;
    readonly siteUrl?: string;
    readonly socialMetadata?: SocialMetadata;
    readonly stylesheetContent?: string;
    readonly stylesheetHref?: string;
};
type RenderPageOptions = RenderDocumentOptions & {
    readonly canonicalPath?: string;
    readonly featured?: readonly HomePageFeaturedContentItem[];
    readonly related?: readonly RelatedDocument[];
    readonly showTags?: boolean;
};
type RenderContentIndexOptions = RenderDocumentOptions & {
    readonly page?: number;
    readonly pages?: number;
};
type DiscoveryLink = {
    readonly href: string;
    readonly rel: string;
    readonly type: string;
};
type SocialMetadata = {
    readonly description?: string;
    readonly imageAlt: string;
    readonly imagePath: string;
    readonly siteName?: string;
    readonly title?: string;
};
export declare const renderPage: (page: PageData, { canonicalPath, discoveryLinks, featured, googleAnalyticsMeasurementId, markdownAlternateHref, related, showTags, siteUrl, socialMetadata, stylesheetContent, stylesheetHref, }?: RenderPageOptions) => string;
export declare const renderNotFoundPage: ({ googleAnalyticsMeasurementId, siteUrl, stylesheetContent, stylesheetHref, }?: RenderDocumentOptions) => string;
export declare const getContentIndexHref: (section: ContentSection, page: number) => string;
export declare const renderContentIndex: (section: ContentSection, entries: readonly ContentEntry[], { googleAnalyticsMeasurementId, page, pages, siteUrl, stylesheetContent, stylesheetHref, }?: RenderContentIndexOptions) => string;
export declare const renderSearchPage: ({ googleAnalyticsMeasurementId, siteUrl, stylesheetContent, stylesheetHref, }?: RenderDocumentOptions) => string;
export {};
