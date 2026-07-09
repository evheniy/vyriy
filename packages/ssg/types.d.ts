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
export type BuildStaticSiteOptions = {
    readonly cwd?: string;
    readonly googleAnalyticsMeasurementId?: string;
    readonly outputPath?: string;
    readonly siteUrl?: string;
    readonly stylesheetContent?: string;
    readonly sourcePath?: string;
    readonly stylesheetHref?: string;
};
export type ContentSection = 'blog' | 'docs' | 'examples';
export type ContentEntry = PageData & {
    readonly href: string;
    readonly slug: string;
};
export type ContentSectionBuildResult = {
    readonly entries: readonly ContentEntry[];
    readonly indexPaths: readonly string[];
};
export type SitemapUrl = {
    readonly path: string;
};
