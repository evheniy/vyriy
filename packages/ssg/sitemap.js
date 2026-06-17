import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
const defaultSiteUrl = 'https://vyriy.dev';
const xmlCharacterPattern = /[&<>"']/gu;
const xmlCharacterEntities = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
};
const escapeXml = (value) => {
    return value.replaceAll(xmlCharacterPattern, (character) => xmlCharacterEntities[character]);
};
const normalizeSiteUrl = (siteUrl) => (siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl);
const normalizePath = (path) => (path.startsWith('/') ? path : `/${path}`);
export const getAbsoluteUrl = (path, siteUrl = defaultSiteUrl) => {
    return `${normalizeSiteUrl(siteUrl)}${normalizePath(path)}`;
};
export const renderSitemap = (urls, siteUrl = defaultSiteUrl) => {
    const urlEntries = urls
        .map((url) => `  <url>\n    <loc>${escapeXml(getAbsoluteUrl(url.path, siteUrl))}</loc>\n  </url>`)
        .join('\n');
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        urlEntries,
        '</urlset>',
        '',
    ].join('\n');
};
export const writeSitemap = async (outputDirectory, urls, siteUrl = defaultSiteUrl) => {
    const outputPath = join(outputDirectory, 'sitemap.xml');
    await mkdir(dirname(outputPath), {
        recursive: true,
    });
    await writeFile(outputPath, renderSitemap(urls, siteUrl));
};
