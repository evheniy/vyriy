import type { RelatedDocumentsMap } from './content-data.js';
import type { ContentEntry, ContentSection, ContentSectionBuildResult } from './types.js';
export declare const buildContentEntries: (section: ContentSection, projectRoot: string) => Promise<ContentEntry[]>;
export declare const writeContentEntryDocuments: (section: ContentSection, entries: readonly ContentEntry[], outputDirectory: string, { googleAnalyticsMeasurementId, relatedDocuments, siteUrl, stylesheetContent, stylesheetHref, }?: {
    readonly googleAnalyticsMeasurementId?: string;
    readonly relatedDocuments?: RelatedDocumentsMap;
    readonly siteUrl?: string;
    readonly stylesheetContent?: string;
    readonly stylesheetHref?: string;
}) => Promise<void>;
export declare const buildContentSection: (section: ContentSection, projectRoot: string, outputDirectory: string, stylesheetHref?: string, siteUrl?: string, stylesheetContent?: string, googleAnalyticsMeasurementId?: string) => Promise<ContentSectionBuildResult>;
