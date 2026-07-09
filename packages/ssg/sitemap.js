import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
const defaultSiteUrl = 'https://vyriy.dev';
const escapeXml = (value) => {
    let escaped = '';
    for (const character of value) {
        if (character === '&') {
            escaped += '&amp;';
            continue;
        }
        if (character === '<') {
            escaped += '&lt;';
            continue;
        }
        if (character === '>') {
            escaped += '&gt;';
            continue;
        }
        if (character === '"') {
            escaped += '&quot;';
            continue;
        }
        if (character === "'") {
            escaped += '&apos;';
            continue;
        }
        escaped += character;
    }
    return escaped;
};
const normalizeSiteUrl = (siteUrl) => {
    return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
};
const normalizePath = (path) => {
    return path.startsWith('/') ? path : `/${path}`;
};
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
