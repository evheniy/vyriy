import { replaceInlineCode, replaceMarkdownLinks } from './markdown-plain-text.js';
const parseMetadata = (metadata) => {
    const entries = {};
    let listKey = '';
    for (const line of metadata.split('\n')) {
        const trimmedLine = line.trimStart();
        if (trimmedLine.startsWith('- ') && listKey) {
            const value = entries[listKey];
            entries[listKey] = [...(Array.isArray(value) ? value : []), trimmedLine.slice(2).trim()];
            continue;
        }
        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) {
            continue;
        }
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        listKey = key;
        if (!value) {
            entries[key] = [];
            continue;
        }
        if (value === 'true' || value === 'false') {
            entries[key] = value === 'true';
            continue;
        }
        entries[key] = value;
    }
    return entries;
};
const getString = (value) => {
    return typeof value === 'string' ? value : '';
};
const getNumber = (value) => {
    if (typeof value !== 'string') {
        return undefined;
    }
    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
};
const markdownSyntaxPattern = /[#>*_~|[\](){}\\-]+/gu;
const whitespacePattern = /\s+/gu;
const getPlainText = (value) => {
    return replaceInlineCode(replaceMarkdownLinks(value))
        .replaceAll(markdownSyntaxPattern, ' ')
        .replaceAll(whitespacePattern, ' ')
        .trim();
};
const getFallbackTitle = (markdown) => {
    for (const line of markdown.split('\n')) {
        if (!line.startsWith('#')) {
            continue;
        }
        const afterMarker = line.slice(1);
        const titleText = afterMarker.trimStart();
        if (afterMarker === titleText) {
            continue;
        }
        const title = getPlainText(titleText);
        if (title) {
            return title;
        }
    }
    return 'Vyriy';
};
const getFallbackDescription = (markdown) => {
    let insideCodeBlock = false;
    for (const paragraph of markdown.split(/\n\s*\n/u)) {
        const lines = paragraph
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
        const visibleLines = [];
        for (const line of lines) {
            if (line.startsWith('```')) {
                insideCodeBlock = !insideCodeBlock;
                continue;
            }
            if (!insideCodeBlock) {
                visibleLines.push(line);
            }
        }
        const text = visibleLines.join(' ');
        if (!text || text.startsWith('#') || text.startsWith('|')) {
            continue;
        }
        return getPlainText(text);
    }
    return '';
};
export const parsePage = (markdown) => {
    const frontmatter = /^---\n(?<metadata>[\s\S]*?)\n---\n(?<content>[\s\S]*)$/u.exec(markdown);
    if (!frontmatter?.groups) {
        return {
            content: markdown,
            date: '',
            description: getFallbackDescription(markdown),
            featured: false,
            homePage: false,
            published: true,
            tags: [],
            title: getFallbackTitle(markdown),
        };
    }
    const metadata = parseMetadata(frontmatter.groups.metadata);
    const content = frontmatter.groups.content.trim();
    const featured = metadata.featured;
    const homePage = metadata.homePage;
    const homePageOrder = getNumber(metadata.homePageOrder);
    const tags = metadata.tags;
    const published = metadata.published;
    const updatedAt = getString(metadata.updatedAt);
    return {
        content,
        date: getString(metadata.date),
        description: getString(metadata.description) || getFallbackDescription(content),
        featured: typeof featured === 'boolean' ? featured : false,
        homePage: typeof homePage === 'boolean' ? homePage : false,
        ...(homePageOrder === undefined ? {} : { homePageOrder }),
        published: typeof published === 'boolean' ? published : true,
        tags: Array.isArray(tags) ? tags : [],
        title: getString(metadata.title) || getFallbackTitle(content),
        ...(updatedAt ? { updatedAt } : {}),
    };
};
