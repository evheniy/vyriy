import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { buildContentEntries, buildContentSection, getHomePageFeaturedContent, getRelatedDocumentsMap, getSiteSearchDocuments, writeContentData, writeContentEntryDocuments, } from './content.js';
import { defaultStylesheet, renderNotFoundPage, renderPage, renderSearchPage, searchScript } from './html.js';
import { parsePage } from './parse-page.js';
import { writeRobotsTxt } from './robots.js';
import { writeSitemap } from './sitemap.js';
const defaultSiteName = 'Vyriy';
const defaultContentPath = 'site';
const defaultOutputPath = 'dist';
const require = createRequire(import.meta.url);
const miniSearchBrowserPath = join(dirname(dirname(require.resolve('minisearch'))), 'umd/index.js');
const defaultSections = [
    {
        path: 'blog',
        title: 'Blog',
    },
    {
        index: false,
        path: 'docs',
        title: 'Documentation',
    },
    {
        path: 'examples',
        title: 'Examples',
    },
];
const isNodeError = (error) => {
    return typeof error === 'object' && error !== null && 'code' in error;
};
const pathExists = async (path) => {
    try {
        await readdir(path);
        return true;
    }
    catch (error) {
        if (isNodeError(error) && error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
};
const copyDirectory = async (sourcePath, outputPath) => {
    let entries;
    try {
        entries = await readdir(sourcePath, {
            withFileTypes: true,
        });
    }
    catch (error) {
        if (isNodeError(error) && error.code === 'ENOENT') {
            return;
        }
        throw error;
    }
    await mkdir(outputPath, {
        recursive: true,
    });
    await Promise.all(entries.map(async (entry) => {
        const sourceEntryPath = join(sourcePath, entry.name);
        const outputEntryPath = join(outputPath, entry.name);
        if (entry.isDirectory()) {
            await copyDirectory(sourceEntryPath, outputEntryPath);
            return;
        }
        if (entry.isFile()) {
            await mkdir(dirname(outputEntryPath), {
                recursive: true,
            });
            await copyFile(sourceEntryPath, outputEntryPath);
        }
    }));
};
const getDefaultPages = (contentPath) => [
    {
        canonicalPath: '/consulting/',
        inputPath: join(contentPath, 'consulting/README.md'),
        outputPath: 'consulting/index.html',
    },
    {
        canonicalPath: '/docs/',
        inputPath: join(contentPath, 'docs/README.md'),
        outputPath: 'docs/index.html',
    },
];
const renderOptionsFrom = (options) => {
    const siteName = options.siteName ?? defaultSiteName;
    return {
        defaultTitle: options.defaultTitle ?? siteName,
        footerText: options.footerText ?? `Copyright © 2026 ${siteName}`,
        googleAnalyticsMeasurementId: options.googleAnalyticsMeasurementId,
        siteName,
        siteUrl: options.siteUrl,
        stylesheetContent: options.stylesheetContent,
        stylesheetHref: options.stylesheetHref ?? (options.stylesheetContent ? undefined : '/styles.css'),
    };
};
const writeStandalonePage = async (page, outputDirectory, renderOptions) => {
    try {
        const pageData = parsePage(await readFile(page.inputPath, 'utf8'), renderOptions.defaultTitle);
        if (!pageData.published) {
            return undefined;
        }
        await mkdir(dirname(join(outputDirectory, page.outputPath)), {
            recursive: true,
        });
        await writeFile(join(outputDirectory, page.outputPath), renderPage(pageData, {
            ...renderOptions,
            canonicalPath: page.canonicalPath,
        }));
        return page.canonicalPath;
    }
    catch (error) {
        if (isNodeError(error) && error.code === 'ENOENT') {
            return undefined;
        }
        throw error;
    }
};
export const buildStaticSite = async (options = {}) => {
    const cwd = options.cwd ?? process.cwd();
    const contentPath = resolve(cwd, options.contentPath ?? defaultContentPath);
    const outputDirectory = resolve(cwd, options.outputPath ?? defaultOutputPath);
    const publicPath = resolve(cwd, options.publicPath ?? join(options.contentPath ?? defaultContentPath, 'public'));
    const homePage = options.homePage ?? {
        canonicalPath: '/',
        inputPath: join(contentPath, 'home/README.md'),
        outputPath: 'index.html',
    };
    const pages = options.pages ?? getDefaultPages(contentPath);
    const sections = options.sections ?? defaultSections;
    const renderOptions = renderOptionsFrom(options);
    await mkdir(outputDirectory, {
        recursive: true,
    });
    if (!options.stylesheetContent && !options.stylesheetHref) {
        await writeFile(join(outputDirectory, 'styles.css'), `${defaultStylesheet.trim()}\n`);
    }
    await mkdir(join(outputDirectory, 'assets'), {
        recursive: true,
    });
    await Promise.all([
        copyFile(miniSearchBrowserPath, join(outputDirectory, 'assets/minisearch.js')),
        writeFile(join(outputDirectory, 'assets/search.js'), `${searchScript.trim()}\n`),
    ]);
    const sectionResults = await Promise.all(sections.map(async (section) => {
        if (section.index === false) {
            return {
                result: {
                    entries: await buildContentEntries(section, contentPath, renderOptions.defaultTitle),
                    indexPaths: [],
                },
                section,
            };
        }
        return {
            result: await buildContentSection(section, contentPath, outputDirectory, renderOptions),
            section,
        };
    }));
    const contentSections = sectionResults.map(({ result, section }) => ({
        entries: result.entries,
        section: section.path,
    }));
    const relatedDocuments = getRelatedDocumentsMap(getSiteSearchDocuments(contentSections));
    const featured = getHomePageFeaturedContent(contentSections);
    const standalonePaths = (await Promise.all(pages.map((page) => writeStandalonePage(page, outputDirectory, renderOptions)))).filter((path) => Boolean(path));
    const homePageData = parsePage(await readFile(homePage.inputPath, 'utf8'), renderOptions.defaultTitle);
    await writeFile(join(outputDirectory, homePage.outputPath), renderPage(homePageData, {
        ...renderOptions,
        canonicalPath: homePage.canonicalPath,
        featured,
    }));
    await Promise.all(sectionResults.map(({ result, section }) => writeContentEntryDocuments(section, result.entries, outputDirectory, {
        ...renderOptions,
        relatedDocuments,
    })));
    await writeFile(join(outputDirectory, '404.html'), renderNotFoundPage(renderOptions));
    await mkdir(join(outputDirectory, 'search'), {
        recursive: true,
    });
    await writeFile(join(outputDirectory, 'search/index.html'), renderSearchPage(renderOptions));
    await writeContentData(contentSections, outputDirectory);
    if (options.copyPublic ?? (await pathExists(publicPath))) {
        await copyDirectory(publicPath, outputDirectory);
    }
    await writeSitemap(outputDirectory, [
        {
            path: homePage.canonicalPath ?? '/',
        },
        ...standalonePaths.map((path) => ({
            path,
        })),
        ...sectionResults.flatMap(({ result }) => result.indexPaths.map((path) => ({ path }))),
        ...sectionResults.flatMap(({ result }) => result.entries.map((entry) => ({ path: entry.href }))),
    ], options.siteUrl);
    await writeRobotsTxt(outputDirectory, options.siteUrl);
};
