import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { parsePage } from './parse-page.js';
import { getContentIndexHref, renderContentIndex, renderPage } from './render-page.js';
import { getMarkdownHref, writeMarkdownPage } from './markdown-page.js';
const isNodeError = (error) => {
    return typeof error === 'object' && error !== null && 'code' in error;
};
const findReadmePaths = async (directory) => {
    let entries;
    try {
        entries = await readdir(directory, {
            withFileTypes: true,
        });
    }
    catch (error) {
        if (isNodeError(error) && error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
    const paths = await Promise.all(entries.map(async (entry) => {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            return findReadmePaths(entryPath);
        }
        return entry.name === 'README.md' ? [entryPath] : [];
    }));
    return paths.flat();
};
const getSlug = (sectionDirectory, readmePath) => {
    return dirname(relative(sectionDirectory, readmePath))
        .split(sep)
        .filter((segment) => segment && segment !== '.')
        .join('/');
};
const writeDocument = async (outputPath, document) => {
    await mkdir(dirname(outputPath), {
        recursive: true,
    });
    await writeFile(outputPath, document);
};
const contentIndexPageSize = 10;
const getContentIndexOutputPath = (outputDirectory, section, page) => {
    return page <= 1
        ? join(outputDirectory, section, 'index.html')
        : join(outputDirectory, section, String(page), 'index.html');
};
export const buildContentEntries = async (section, projectRoot) => {
    const sectionDirectory = join(projectRoot, 'site', section);
    const readmePaths = await findReadmePaths(sectionDirectory);
    const entries = (await Promise.all(readmePaths.map(async (readmePath) => {
        const slug = getSlug(sectionDirectory, readmePath);
        const page = parsePage(await readFile(readmePath, 'utf8'));
        if (!slug || !page.published) {
            return undefined;
        }
        const href = `/${section}/${slug}/`;
        return {
            ...page,
            href,
            slug,
        };
    })))
        .filter((entry) => Boolean(entry))
        .sort((left, right) => right.date.localeCompare(left.date) || left.title.localeCompare(right.title));
    return entries;
};
export const writeContentEntryDocuments = async (section, entries, outputDirectory, { googleAnalyticsMeasurementId, relatedDocuments = {}, siteUrl, stylesheetContent, stylesheetHref, } = {}) => {
    await Promise.all(entries.map((entry) => Promise.all([
        writeDocument(join(outputDirectory, section, entry.slug, 'index.html'), renderPage(entry, {
            canonicalPath: entry.href,
            googleAnalyticsMeasurementId,
            markdownAlternateHref: getMarkdownHref(entry.href),
            related: relatedDocuments[`${section}:${entry.slug}`] ?? [],
            showTags: true,
            siteUrl,
            stylesheetContent,
            stylesheetHref,
        })),
        writeMarkdownPage(outputDirectory, entry, siteUrl),
    ])));
};
export const buildContentSection = async (section, projectRoot, outputDirectory, stylesheetHref, siteUrl, stylesheetContent, googleAnalyticsMeasurementId) => {
    const entries = await buildContentEntries(section, projectRoot);
    const pages = Math.max(1, Math.ceil(entries.length / contentIndexPageSize));
    const indexPaths = Array.from({ length: pages }, (_value, index) => getContentIndexHref(section, index + 1));
    await Promise.all(indexPaths.map((_path, index) => {
        const page = index + 1;
        const pageEntries = entries.slice(index * contentIndexPageSize, page * contentIndexPageSize);
        return writeDocument(getContentIndexOutputPath(outputDirectory, section, page), renderContentIndex(section, pageEntries, {
            googleAnalyticsMeasurementId,
            page,
            pages,
            siteUrl,
            stylesheetHref,
            stylesheetContent,
        }));
    }));
    return {
        entries,
        indexPaths,
    };
};
