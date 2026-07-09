import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { getAbsoluteUrl } from './sitemap.js';
const siteTitle = 'Vyriy.dev';
const siteDescription = 'A small static React website about the Vyriy component and package library, calm engineering systems, and reusable project contracts.';
const sectionTitles = {
    blog: 'Blog',
    docs: 'Documentation',
    examples: 'Examples',
};
const markdownLinkTextPattern = /[[\]\\]/gu;
const whitespacePattern = /\s+/gu;
const escapeMarkdownLinkText = (value) => {
    return value.replaceAll(markdownLinkTextPattern, String.raw `\$&`);
};
const normalizeDescription = (value) => {
    return value.replaceAll(whitespacePattern, ' ').trim();
};
const renderLlmTxtLine = (page, siteUrl) => {
    const description = normalizeDescription(page.description);
    const descriptionSuffix = description ? ` - ${description}` : '';
    return `- [${escapeMarkdownLinkText(page.title)}](${getAbsoluteUrl(page.path, siteUrl)})${descriptionSuffix}`;
};
export const renderLlmTxt = (options, siteUrl) => {
    const mainPages = options.pages.map((page) => renderLlmTxtLine(page, siteUrl));
    const sectionGroups = options.sections
        .map((section) => {
        const entries = section.entries.map((entry) => renderLlmTxtLine({
            description: entry.description,
            path: entry.href,
            title: entry.title,
        }, siteUrl));
        return [
            `## ${sectionTitles[section.section]}`,
            '',
            ...entries,
        ].join('\n');
    })
        .join('\n\n');
    return [
        `# ${siteTitle}`,
        '',
        siteDescription,
        '',
        '## Main Pages',
        '',
        ...mainPages,
        '',
        sectionGroups,
        '',
    ].join('\n');
};
export const writeLlmTxt = async (outputDirectory, options, siteUrl) => {
    const outputPath = join(outputDirectory, 'llms.txt');
    await mkdir(dirname(outputPath), {
        recursive: true,
    });
    await writeFile(outputPath, renderLlmTxt(options, siteUrl));
};
