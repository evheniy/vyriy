export type PageData = {
    readonly content: string;
    readonly date: string;
    readonly description: string;
    readonly featured?: boolean;
    readonly homePage?: boolean;
    readonly homePageOrder?: number;
    readonly published: boolean;
    readonly tags: readonly string[];
    readonly title: string;
    readonly updatedAt?: string;
};
export type StaticSitePage = {
    readonly canonicalPath?: string;
    readonly inputPath: string;
    readonly outputPath: string;
};
export type StaticSiteSection = {
    readonly description?: string;
    readonly index?: boolean;
    readonly pageSize?: number;
    readonly path: string;
    readonly title: string;
};
export type BuildStaticSiteOptions = {
    readonly contentPath?: string;
    readonly copyPublic?: boolean;
    readonly cwd?: string;
    readonly defaultTitle?: string;
    readonly footerText?: string;
    readonly googleAnalyticsMeasurementId?: string;
    readonly homePage?: StaticSitePage;
    readonly outputPath?: string;
    readonly pages?: readonly StaticSitePage[];
    readonly publicPath?: string;
    readonly sections?: readonly StaticSiteSection[];
    readonly siteName?: string;
    readonly siteUrl?: string;
    readonly stylesheetContent?: string;
    readonly stylesheetHref?: string;
};
export type ContentEntry = PageData & {
    readonly href: string;
    readonly section: string;
    readonly slug: string;
};
export type ContentSectionBuildResult = {
    readonly entries: readonly ContentEntry[];
    readonly indexPaths: readonly string[];
};
export type SitemapUrl = {
    readonly path: string;
};
export type SearchDocument = {
    readonly content: string;
    readonly date?: string;
    readonly description: string;
    readonly id: string;
    readonly section: string;
    readonly slug: string;
    readonly tags: readonly string[];
    readonly title: string;
    readonly updatedAt?: string;
    readonly url: string;
};
export type RelatedDocument = {
    readonly description: string;
    readonly score: number;
    readonly section: string;
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
    readonly section: string;
    readonly slug: string;
    readonly tags: readonly string[];
    readonly title: string;
    readonly url: string;
};
