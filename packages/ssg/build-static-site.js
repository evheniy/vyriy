import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { getHomePageFeaturedContent, getRelatedDocumentsMap, getSiteSearchDocuments, writeContentData, } from './content-data.js';
import { buildContentEntries, buildContentSection, writeContentEntryDocuments } from './content-section.js';
import { writeLlmTxt } from './llm.js';
import { parsePage } from './parse-page.js';
import { getStaticSitePaths } from './paths.js';
import { renderNotFoundPage, renderPage, renderSearchPage } from './render-page.js';
import { writeRobotsTxt } from './robots.js';
import { writeSitemap } from './sitemap.js';
const homeSocialMetadata = {
    description: 'Calm architecture for cloud-ready applications. Small explicit pieces, clear boundaries, predictable behavior.',
    imageAlt: 'Vyriy calm architecture diagram with modular cloud-ready software blocks.',
    imagePath: '/assets/vyriy-calm-architecture.png',
    siteName: 'Vyriy',
    title: 'Vyriy - Calm Architecture',
};
export const buildStaticSite = async (options = {}) => {
    const paths = getStaticSitePaths(options.cwd ?? process.cwd());
    const sourcePath = options.sourcePath ?? paths.sourcePath;
    const outputPath = options.outputPath ?? paths.outputPath;
    const page = parsePage(await readFile(sourcePath, 'utf8'));
    const consultingPage = parsePage(await readFile(paths.consultingSourcePath, 'utf8'));
    const docPage = parsePage(await readFile(paths.docSourcePath, 'utf8'));
    const consultingDocument = renderPage(consultingPage, {
        canonicalPath: '/consulting/',
        googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
        siteUrl: options.siteUrl,
        stylesheetContent: options.stylesheetContent,
        stylesheetHref: options.stylesheetHref,
    });
    const docDocument = renderPage(docPage, {
        canonicalPath: '/docs/',
        googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
        siteUrl: options.siteUrl,
        stylesheetContent: options.stylesheetContent,
        stylesheetHref: options.stylesheetHref,
    });
    const notFoundDocument = renderNotFoundPage({
        googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
        siteUrl: options.siteUrl,
        stylesheetContent: options.stylesheetContent,
        stylesheetHref: options.stylesheetHref,
    });
    const searchDocument = renderSearchPage({
        googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
        siteUrl: options.siteUrl,
        stylesheetContent: options.stylesheetContent,
        stylesheetHref: options.stylesheetHref,
    });
    const searchOutputPath = join(paths.outputDirectory, 'search/index.html');
    await mkdir(dirname(outputPath), {
        recursive: true,
    });
    await mkdir(dirname(paths.consultingOutputPath), {
        recursive: true,
    });
    await mkdir(dirname(paths.docOutputPath), {
        recursive: true,
    });
    await mkdir(paths.outputDirectory, {
        recursive: true,
    });
    await mkdir(dirname(searchOutputPath), {
        recursive: true,
    });
    await writeFile(paths.consultingOutputPath, consultingDocument);
    await writeFile(paths.docOutputPath, docDocument);
    await writeFile(join(paths.outputDirectory, '404.html'), notFoundDocument);
    await writeFile(searchOutputPath, searchDocument);
    const blogSection = await buildContentSection('blog', paths.projectRoot, paths.outputDirectory, options.stylesheetHref, options.siteUrl, options.stylesheetContent, options.googleAnalyticsMeasurementId);
    const examplesSection = await buildContentSection('examples', paths.projectRoot, paths.outputDirectory, options.stylesheetHref, options.siteUrl, options.stylesheetContent, options.googleAnalyticsMeasurementId);
    const docsEntries = await buildContentEntries('docs', paths.projectRoot);
    const docsRootEntry = {
        ...docPage,
        href: '/docs/',
        slug: '',
    };
    const contentSections = [
        {
            entries: blogSection.entries,
            section: 'blog',
        },
        {
            entries: [
                docsRootEntry,
                ...docsEntries,
            ],
            section: 'docs',
        },
        {
            entries: examplesSection.entries,
            section: 'examples',
        },
    ];
    const relatedDocuments = getRelatedDocumentsMap(getSiteSearchDocuments(contentSections));
    const featured = getHomePageFeaturedContent(contentSections);
    const document = renderPage(page, {
        canonicalPath: '/',
        discoveryLinks: [
            {
                href: '/llms.txt',
                rel: 'describedby',
                type: 'text/markdown',
            },
            {
                href: '/docs/',
                rel: 'service-doc',
                type: 'text/html',
            },
            {
                href: '/sitemap.xml',
                rel: 'sitemap',
                type: 'application/xml',
            },
        ],
        featured,
        googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
        siteUrl: options.siteUrl,
        socialMetadata: homeSocialMetadata,
        stylesheetContent: options.stylesheetContent,
        stylesheetHref: options.stylesheetHref,
    });
    await writeFile(outputPath, document);
    await Promise.all([
        writeContentEntryDocuments('blog', blogSection.entries, paths.outputDirectory, {
            googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
            relatedDocuments,
            siteUrl: options.siteUrl,
            stylesheetContent: options.stylesheetContent,
            stylesheetHref: options.stylesheetHref,
        }),
        writeContentEntryDocuments('examples', examplesSection.entries, paths.outputDirectory, {
            googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
            relatedDocuments,
            siteUrl: options.siteUrl,
            stylesheetContent: options.stylesheetContent,
            stylesheetHref: options.stylesheetHref,
        }),
        writeContentEntryDocuments('docs', docsEntries, paths.outputDirectory, {
            googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
            relatedDocuments,
            siteUrl: options.siteUrl,
            stylesheetContent: options.stylesheetContent,
            stylesheetHref: options.stylesheetHref,
        }),
    ]);
    await writeContentData(contentSections, paths.outputDirectory);
    await writeSitemap(paths.outputDirectory, [
        {
            path: '/',
        },
        {
            path: '/consulting/',
        },
        {
            path: '/docs/',
        },
        ...docsEntries.map((entry) => ({
            path: entry.href,
        })),
        ...blogSection.indexPaths.map((path) => ({
            path,
        })),
        ...blogSection.entries.map((entry) => ({
            path: entry.href,
        })),
        ...examplesSection.indexPaths.map((path) => ({
            path,
        })),
        ...examplesSection.entries.map((entry) => ({
            path: entry.href,
        })),
    ], options.siteUrl);
    await writeRobotsTxt(paths.outputDirectory, options.siteUrl);
    await writeLlmTxt(paths.outputDirectory, {
        pages: [
            {
                description: page.description,
                path: '/',
                title: page.title,
            },
            {
                description: consultingPage.description,
                path: '/consulting/',
                title: consultingPage.title,
            },
        ],
        sections: contentSections,
    }, options.siteUrl);
};
