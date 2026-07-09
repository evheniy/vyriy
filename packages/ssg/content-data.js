import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import MiniSearch from 'minisearch';
import { replaceInlineCode, replaceMarkdownLinks, stripFencedCode, stripHtmlTags } from './markdown-plain-text.js';
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
const markdownSyntaxPattern = /[#>*_~|[\](){}\\-]+/gu;
const whitespacePattern = /\s+/gu;
const wordPattern = /[\p{L}\p{N}]+/gu;
export const getPlainTextFromMarkdown = (markdown) => {
    return stripHtmlTags(replaceInlineCode(replaceMarkdownLinks(stripFencedCode(markdown))))
        .replaceAll(markdownSyntaxPattern, ' ')
        .replaceAll(whitespacePattern, ' ')
        .trim();
};
export const getContentUrl = (section, slug) => {
    return slug ? `/${section}/${slug}/` : `/${section}/`;
};
const getOptionalDate = (date) => {
    return date || undefined;
};
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
        url: getContentUrl(section, entry.slug),
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
        url: getContentUrl(section, entry.slug),
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
