import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import MiniSearch from 'minisearch';
import { renderContentIndex, renderPage } from './html.js';
import { getPlainTextFromMarkdown } from './markdown.js';
import { parsePage } from './parse-page.js';
const relatedDocumentCount = 4;
const homePageFeaturedContentCount = 4;
const minimumRelatedScore = 10;
export const contentSearchOptions = {
    boost: {
        content: 1,
        description: 2,
        tags: 3,
        title: 4,
    },
    fuzzy: 0.2,
    prefix: true,
};
export const contentMiniSearchOptions = {
    fields: [
        'title',
        'description',
        'tags',
        'content',
    ],
    storeFields: [
        'title',
        'description',
        'section',
        'slug',
        'url',
        'tags',
        'date',
    ],
    searchOptions: contentSearchOptions,
};
const isNodeError = (error) => {
    return typeof error === 'object' && error !== null && 'code' in error;
};
export const findReadmePaths = async (directory) => {
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
const getContentIndexHref = (sectionPath, page) => {
    return page <= 1 ? `/${sectionPath}/` : `/${sectionPath}/${page}/`;
};
const getContentIndexOutputPath = (outputDirectory, sectionPath, page) => {
    return page <= 1
        ? join(outputDirectory, sectionPath, 'index.html')
        : join(outputDirectory, sectionPath, String(page), 'index.html');
};
export const buildContentEntries = async (section, contentPath, defaultTitle = 'Vyriy') => {
    const sectionDirectory = join(contentPath, section.path);
    const readmePaths = await findReadmePaths(sectionDirectory);
    const entries = (await Promise.all(readmePaths.map(async (readmePath) => {
        const slug = getSlug(sectionDirectory, readmePath);
        const page = parsePage(await readFile(readmePath, 'utf8'), defaultTitle);
        if (!slug || !page.published) {
            return undefined;
        }
        return {
            ...page,
            href: `/${section.path}/${slug}/`,
            section: section.path,
            slug,
        };
    })))
        .filter((entry) => Boolean(entry))
        .sort((left, right) => right.date.localeCompare(left.date) || left.title.localeCompare(right.title));
    return entries;
};
export const buildContentSection = async (section, contentPath, outputDirectory, renderOptions) => {
    const entries = await buildContentEntries(section, contentPath, renderOptions.defaultTitle);
    const pageSize = section.pageSize ?? 10;
    const pages = Math.max(1, Math.ceil(entries.length / pageSize));
    const indexPaths = Array.from({ length: pages }, (_value, index) => getContentIndexHref(section.path, index + 1));
    await Promise.all(indexPaths.map((_path, index) => {
        const page = index + 1;
        const pageEntries = entries.slice(index * pageSize, page * pageSize);
        return writeDocument(getContentIndexOutputPath(outputDirectory, section.path, page), renderContentIndex(pageEntries, {
            ...renderOptions,
            page,
            pages,
            sectionPath: section.path,
            sectionTitle: section.title,
        }));
    }));
    return {
        entries,
        indexPaths,
    };
};
export const writeContentEntryDocuments = async (section, entries, outputDirectory, renderOptions) => {
    await Promise.all(entries.map((entry) => writeDocument(join(outputDirectory, section.path, entry.slug, 'index.html'), renderPage(entry, {
        ...renderOptions,
        canonicalPath: entry.href,
        related: renderOptions.relatedDocuments?.[`${section.path}:${entry.slug}`] ?? [],
        showTags: true,
    }))));
};
const getOptionalDate = (date) => date || undefined;
export const getSearchDocuments = (section, entries) => {
    return entries.map((entry) => ({
        content: getPlainTextFromMarkdown(entry.content),
        date: getOptionalDate(entry.date),
        description: entry.description,
        id: `${section}:${entry.slug}`,
        section,
        slug: entry.slug,
        tags: entry.tags,
        title: entry.title,
        updatedAt: entry.updatedAt,
        url: entry.href,
    }));
};
export const getSiteSearchDocuments = (sections) => {
    return sections.flatMap((section) => getSearchDocuments(section.section, section.entries));
};
export const getMiniSearchIndexJson = (documents) => {
    const miniSearch = new MiniSearch(contentMiniSearchOptions);
    miniSearch.addAll([...documents]);
    return miniSearch.toJSON();
};
const wordPattern = /[\p{L}\p{N}]+/gu;
const getKeywords = (text) => {
    return new Set((text.toLowerCase().match(wordPattern) ?? []).map((word) => word.trim()).filter((word) => word.length >= 4));
};
const countKeywordMatches = (keywords, text) => {
    const targetKeywords = getKeywords(text);
    let matches = 0;
    for (const keyword of keywords) {
        if (targetKeywords.has(keyword)) {
            matches += 1;
        }
    }
    return matches;
};
const getSharedTagCount = (leftTags, rightTags) => {
    const rightTagSet = new Set(rightTags.map((tag) => tag.toLowerCase()));
    return leftTags.filter((tag) => rightTagSet.has(tag.toLowerCase())).length;
};
const getRelatedScore = (document, candidate) => {
    const keywords = getKeywords(`${document.title} ${document.description}`);
    return (getSharedTagCount(document.tags, candidate.tags) * 10 +
        countKeywordMatches(keywords, candidate.title) * 4 +
        countKeywordMatches(keywords, candidate.description) * 2 +
        countKeywordMatches(keywords, candidate.content));
};
export const getRelatedDocumentsMap = (documents) => {
    return Object.fromEntries(documents.map((document) => [
        document.id,
        documents
            .filter((candidate) => candidate.id !== document.id)
            .map((candidate) => ({
            description: candidate.description,
            score: getRelatedScore(document, candidate),
            section: candidate.section,
            slug: candidate.slug,
            tags: candidate.tags,
            title: candidate.title,
            url: candidate.url,
        }))
            .filter((candidate) => candidate.score >= minimumRelatedScore)
            .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
            .slice(0, relatedDocumentCount),
    ]));
};
export const getHomePageFeaturedContent = (sections) => {
    return sections
        .flatMap((section) => section.entries
        .filter((entry) => entry.homePage)
        .map((entry) => ({
        entry,
        section: section.section,
    })))
        .sort((left, right) => (left.entry.homePageOrder ?? Number.MAX_SAFE_INTEGER) -
        (right.entry.homePageOrder ?? Number.MAX_SAFE_INTEGER) ||
        right.entry.date.localeCompare(left.entry.date) ||
        left.entry.title.localeCompare(right.entry.title))
        .map(({ entry, section }) => ({
        date: getOptionalDate(entry.date),
        description: entry.description,
        homePageOrder: entry.homePageOrder,
        section,
        slug: entry.slug,
        tags: entry.tags,
        title: entry.title,
        url: entry.href,
    }))
        .slice(0, homePageFeaturedContentCount);
};
const writeJson = async (path, value) => {
    await mkdir(dirname(path), {
        recursive: true,
    });
    await writeFile(path, `${JSON.stringify(value, undefined, 2)}\n`);
};
export const writeContentData = async (sections, outputDirectory) => {
    const documents = getSiteSearchDocuments(sections);
    await Promise.all([
        writeJson(join(outputDirectory, 'search/documents.json'), documents),
        writeJson(join(outputDirectory, 'search/minisearch-index.json'), getMiniSearchIndexJson(documents)),
        writeJson(join(outputDirectory, 'search/related.json'), getRelatedDocumentsMap(documents)),
        writeJson(join(outputDirectory, 'home-featured.json'), getHomePageFeaturedContent(sections)),
    ]);
};
