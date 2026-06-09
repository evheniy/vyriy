import { createLogger } from '@vyriy/logger';
import { output } from '@vyriy/cdk';
import { script } from '@vyriy/script';
import { request } from '@vyriy/request';
import { retry } from '@vyriy/retry';
import { recursive } from '@vyriy/recursive';
const toUrl = (baseUrl, path) => new URL(path, baseUrl).toString();
const locTag = '<loc>';
const locEndTag = '</loc>';
const sitemapIndexTag = '<sitemapindex';
const isTagBoundary = (character) => !character || character === '>' || character === '/' || character <= ' ';
const parseSitemapUrls = (sitemap) => {
    const urls = [];
    const normalizedSitemap = sitemap.toLowerCase();
    let searchIndex = 0;
    while (searchIndex < sitemap.length) {
        const locStartIndex = normalizedSitemap.indexOf(locTag, searchIndex);
        if (locStartIndex === -1) {
            break;
        }
        const urlStartIndex = locStartIndex + locTag.length;
        const locEndIndex = normalizedSitemap.indexOf(locEndTag, urlStartIndex);
        if (locEndIndex === -1) {
            break;
        }
        const url = sitemap.slice(urlStartIndex, locEndIndex).trim();
        if (url) {
            urls.push(url);
        }
        searchIndex = locEndIndex + locEndTag.length;
    }
    return urls;
};
const isSitemapIndex = (sitemap) => {
    const normalizedSitemap = sitemap.toLowerCase();
    const tagIndex = normalizedSitemap.indexOf(sitemapIndexTag);
    return tagIndex !== -1 && isTagBoundary(normalizedSitemap[tagIndex + sitemapIndexTag.length]);
};
const requestText = (url) => request(url);
export const site = (resourceName = 'SiteUrl') => script(async () => {
    const logger = createLogger();
    logger.info('Site Smoke testing...');
    const retryOptions = {
        retries: 2,
        delay: 2000,
    };
    const siteUrl = output()[resourceName];
    const robotsUrl = toUrl(siteUrl, 'robots.txt');
    const sitemapUrl = toUrl(siteUrl, 'sitemap.xml');
    logger.info('Site url:', siteUrl);
    await retry(async () => {
        logger.info(`Testing: ${siteUrl}`);
        await request(siteUrl);
    }, retryOptions);
    await retry(async () => {
        logger.info(`Testing: ${robotsUrl}`);
        await request(robotsUrl);
    }, retryOptions);
    const sitemap = (await retry(async () => {
        logger.info(`Testing: ${sitemapUrl}`);
        return requestText(sitemapUrl);
    }, retryOptions));
    const sitemapUrls = parseSitemapUrls(sitemap);
    const pageUrls = isSitemapIndex(sitemap)
        ? (await Promise.all(sitemapUrls.map((nestedSitemapUrl) => retry(async () => {
            logger.info(`Testing: ${nestedSitemapUrl}`);
            const nestedSitemap = await requestText(nestedSitemapUrl);
            return parseSitemapUrls(nestedSitemap);
        }, retryOptions)))).flat()
        : sitemapUrls;
    if (!pageUrls.length) {
        throw new Error(`Sitemap has no URLs: ${sitemapUrl}`);
    }
    await recursive(async (pageUrl) => {
        await retry(async () => {
            logger.info(`Testing: ${pageUrl}`);
            await request(pageUrl);
        }, retryOptions);
    }, pageUrls);
    logger.info('Site Smoke testing finished!');
});
