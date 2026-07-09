import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { getAbsoluteUrl } from './sitemap.js';
const whitespacePattern = /\s+/gu;
const normalizeDescription = (value) => {
    return value.replaceAll(whitespacePattern, ' ').trim();
};
const getMarkdownPathSegments = (path) => {
    const segments = path.split('/').filter(Boolean);
    if (!segments.length || segments.some((segment) => segment === '.' || segment === '..')) {
        throw new Error(`Invalid Markdown output path: ${path}`);
    }
    return segments;
};
export const getMarkdownOutputPath = (outputDirectory, path) => {
    const segments = getMarkdownPathSegments(path);
    const fileName = `${segments.at(-1)}.md`;
    return join(outputDirectory, ...segments.slice(0, -1), fileName);
};
export const getMarkdownHref = (path) => {
    const segments = getMarkdownPathSegments(path);
    const fileName = `${segments.at(-1)}.md`;
    return `/${[
        ...segments.slice(0, -1),
        fileName,
    ].join('/')}`;
};
export const renderMarkdownPage = (entry, siteUrl) => {
    const description = normalizeDescription(entry.description);
    const metadata = [
        entry.date ? `Published: ${entry.date}` : '',
        entry.updatedAt ? `Updated: ${entry.updatedAt}` : '',
        entry.tags.length ? `Tags: ${entry.tags.join(', ')}` : '',
        `Source: ${getAbsoluteUrl(entry.href, siteUrl)}`,
    ].filter(Boolean);
    return [
        `# ${entry.title}`,
        '',
        description,
        '',
        ...metadata,
        '',
        '---',
        '',
        entry.content.trim(),
        '',
    ].join('\n');
};
export const writeMarkdownPage = async (outputDirectory, entry, siteUrl) => {
    const outputPath = getMarkdownOutputPath(outputDirectory, entry.href);
    await mkdir(dirname(outputPath), {
        recursive: true,
    });
    await writeFile(outputPath, renderMarkdownPage(entry, siteUrl));
};
