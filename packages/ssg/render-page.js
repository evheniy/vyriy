import { jsx as _jsx } from "react/jsx-runtime";
import { html as renderDocumentHtml } from '@vyriy/html';
import { html as renderReactHtml } from '@vyriy/render/html';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Card, Catalog, NotFoundPage, Page, SearchPage } from './components.js';
import { getWebPageJsonLd, renderJsonLdScript } from './json-ld.js';
import { minifyHtml } from './minify-html.js';
import { getAbsoluteUrl } from './sitemap.js';
const escapedStyleCloseTag = ['<', String.fromCodePoint(92), '/style'].join('');
const googleAnalyticsMeasurementIdPattern = /^G-[A-Z0-9]+$/;
const internalMarkdownLinkHostnames = new Set(['vyriy.dev', 'vyriy.local']);
const videoAssetExtensionPattern = /\.(mp4|mov|webm)(?:[?#].*)?$/iu;
const renderDocument = (title, description, body, { canonicalPath = '/', discoveryLinks = [], googleAnalyticsMeasurementId, markdownAlternateHref, robotsDirective, siteUrl, socialMetadata, stylesheetContent, stylesheetHref = '/styles.css', } = {}) => {
    return minifyHtml(renderDocumentHtml({
        htmlAttributes: 'lang="en"',
        title: renderReactHtml(_jsx("title", { children: title })),
        meta: [
            '<meta charset="utf-8" />',
            '<meta name="viewport" content="width=device-width, initial-scale=1" />',
            renderReactHtml(_jsx("meta", { content: description, name: "description" })),
            robotsDirective ? renderReactHtml(_jsx("meta", { content: robotsDirective, name: "robots" })) : '',
            renderSocialMetadata(title, description, canonicalPath, siteUrl, socialMetadata),
        ].join('\n'),
        link: [
            renderStylesheet(stylesheetHref, stylesheetContent),
            canonicalPath ? renderReactHtml(_jsx("link", { href: getAbsoluteUrl(canonicalPath, siteUrl), rel: "canonical" })) : '',
            markdownAlternateHref
                ? renderReactHtml(_jsx("link", { href: markdownAlternateHref, rel: "alternate", type: "text/markdown" }))
                : '',
            ...discoveryLinks.map((link) => renderReactHtml(_jsx("link", { href: link.href, rel: link.rel, type: link.type }))),
            renderReactHtml(_jsx("link", { href: "/favicon.ico", rel: "icon", sizes: "any" })),
            renderReactHtml(_jsx("link", { href: "/favicon-16x16.png", rel: "icon", sizes: "16x16" })),
            renderReactHtml(_jsx("link", { href: "/favicon-32x32.png", rel: "icon", sizes: "32x32" })),
            renderReactHtml(_jsx("link", { href: "/apple-touch-icon.png", rel: "apple-touch-icon" })),
            renderGoogleAnalyticsTag(googleAnalyticsMeasurementId),
        ].join('\n'),
        body,
        script: renderJsonLdScript(getWebPageJsonLd({
            canonicalPath,
            description,
            siteUrl,
            title,
        })),
    }));
};
const renderSocialMetadata = (title, description, canonicalPath, siteUrl, metadata) => {
    if (!metadata) {
        return '';
    }
    const socialTitle = metadata.title ?? title;
    const socialDescription = metadata.description ?? description;
    const socialImageUrl = getAbsoluteUrl(metadata.imagePath, siteUrl);
    const canonicalUrl = getAbsoluteUrl(canonicalPath, siteUrl);
    return [
        renderReactHtml(_jsx("meta", { content: "website", property: "og:type" })),
        renderReactHtml(_jsx("meta", { content: metadata.siteName ?? 'Vyriy', property: "og:site_name" })),
        renderReactHtml(_jsx("meta", { content: socialTitle, property: "og:title" })),
        renderReactHtml(_jsx("meta", { content: socialDescription, property: "og:description" })),
        renderReactHtml(_jsx("meta", { content: canonicalUrl, property: "og:url" })),
        renderReactHtml(_jsx("meta", { content: socialImageUrl, property: "og:image" })),
        renderReactHtml(_jsx("meta", { content: metadata.imageAlt, property: "og:image:alt" })),
        renderReactHtml(_jsx("meta", { content: "summary_large_image", name: "twitter:card" })),
        renderReactHtml(_jsx("meta", { content: socialTitle, name: "twitter:title" })),
        renderReactHtml(_jsx("meta", { content: socialDescription, name: "twitter:description" })),
        renderReactHtml(_jsx("meta", { content: socialImageUrl, name: "twitter:image" })),
    ].join('\n');
};
const renderStylesheet = (stylesheetHref, stylesheetContent) => {
    if (stylesheetContent) {
        return `<style>${stylesheetContent.trim().replaceAll('</style', escapedStyleCloseTag)}</style>`;
    }
    return renderReactHtml(_jsx("link", { href: stylesheetHref, rel: "stylesheet" }));
};
const isExternalMarkdownHref = (href) => {
    if (!href) {
        return false;
    }
    try {
        const url = new URL(href);
        return (url.protocol === 'http:' || url.protocol === 'https:') && !internalMarkdownLinkHostnames.has(url.hostname);
    }
    catch {
        return false;
    }
};
const isVideoAsset = (src) => Boolean(src && videoAssetExtensionPattern.test(src));
const markdownComponents = {
    a: (props) => {
        const anchorProps = { ...props };
        delete anchorProps.node;
        const externalLinkProps = isExternalMarkdownHref(anchorProps.href) ? { rel: 'noreferrer', target: '_blank' } : {};
        return (_jsx("a", { ...anchorProps, ...externalLinkProps, children: anchorProps.children }));
    },
    img: (props) => {
        const imageProps = { ...props };
        delete imageProps.node;
        const { alt = '', src, title } = imageProps;
        if (!isVideoAsset(src)) {
            return _jsx("img", { ...imageProps, alt: alt });
        }
        return (_jsx("video", { "aria-label": alt, controls: true, preload: "metadata", src: src, title: title, children: _jsx("track", { kind: "captions" }) }));
    },
};
const renderGoogleAnalyticsTag = (measurementId) => {
    if (!measurementId) {
        return '';
    }
    if (!googleAnalyticsMeasurementIdPattern.test(measurementId)) {
        throw new Error(`Invalid Google Analytics measurement ID: ${measurementId}`);
    }
    return [
        renderReactHtml(_jsx("script", { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}` })),
        [
            '<script>',
            'window.dataLayer = window.dataLayer || [];',
            'function gtag(){dataLayer.push(arguments);}',
            "gtag('js', new Date());",
            `gtag('config', '${measurementId}');`,
            '</script>',
        ].join(''),
    ].join('');
};
export const renderPage = (page, { canonicalPath = '/', discoveryLinks, featured = [], googleAnalyticsMeasurementId, markdownAlternateHref, related = [], showTags = false, siteUrl, socialMetadata, stylesheetContent, stylesheetHref = '/styles.css', } = {}) => {
    const body = renderReactHtml(_jsx(Page, { content: _jsx(ReactMarkdown, { components: markdownComponents, rehypePlugins: [rehypeHighlight], remarkPlugins: [remarkGfm], children: page.content }), featured: featured.map((item) => ({
            description: item.description,
            href: item.url,
            title: item.title,
        })), related: related.map((item) => ({
            description: item.description,
            href: item.url,
            title: item.title,
        })), tags: showTags ? page.tags : [] }));
    return renderDocument(page.title, page.description, body, {
        canonicalPath,
        discoveryLinks,
        googleAnalyticsMeasurementId,
        markdownAlternateHref,
        siteUrl,
        socialMetadata,
        stylesheetContent,
        stylesheetHref,
    });
};
export const renderNotFoundPage = ({ googleAnalyticsMeasurementId, siteUrl, stylesheetContent, stylesheetHref = '/styles.css', } = {}) => {
    const body = renderReactHtml(_jsx(NotFoundPage, {}));
    return renderDocument('Page not found', 'The requested Vyriy page could not be found.', body, {
        canonicalPath: '',
        googleAnalyticsMeasurementId,
        siteUrl,
        stylesheetContent,
        stylesheetHref,
    });
};
const getSectionTitle = (section) => {
    if (section === 'blog') {
        return 'Blog';
    }
    if (section === 'docs') {
        return 'Documentation';
    }
    return 'Examples';
};
export const getContentIndexHref = (section, page) => {
    return page <= 1 ? `/${section}/` : `/${section}/${page}/`;
};
export const renderContentIndex = (section, entries, { googleAnalyticsMeasurementId, page = 1, pages = 1, siteUrl, stylesheetContent, stylesheetHref = '/styles.css', } = {}) => {
    const title = getSectionTitle(section);
    const body = renderReactHtml(_jsx(Catalog, { content: entries.map((entry) => (_jsx(Card, { date: entry.date || undefined, description: entry.description, href: entry.href, tags: entry.tags, title: entry.title }, entry.href))), paginate: {
            getHref: (targetPage) => getContentIndexHref(section, targetPage),
            page,
            pages,
        } }));
    return renderDocument(`Vyriy ${title}`, `${title} from Vyriy.`, body, {
        canonicalPath: getContentIndexHref(section, page),
        googleAnalyticsMeasurementId,
        siteUrl,
        stylesheetContent,
        stylesheetHref,
    });
};
export const renderSearchPage = ({ googleAnalyticsMeasurementId, siteUrl, stylesheetContent, stylesheetHref = '/styles.css', } = {}) => {
    const body = renderReactHtml(_jsx(SearchPage, {}));
    return renderDocument('Vyriy Search', 'Search articles and documentation from Vyriy.', body, {
        canonicalPath: '',
        googleAnalyticsMeasurementId,
        robotsDirective: 'noindex, follow',
        siteUrl,
        stylesheetContent,
        stylesheetHref,
    });
};
