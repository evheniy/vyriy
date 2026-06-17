import { escapeHtml, renderMarkdown } from './markdown.js';
import { getAbsoluteUrl } from './sitemap.js';
const escapedStyleCloseTag = ['<', String.fromCodePoint(92), '/style'].join('');
const googleAnalyticsMeasurementIdPattern = /^G-[A-Z0-9]+$/;
export const defaultStylesheet = String.raw `
:root{color-scheme:light;--vyriy-bg:#f8faf7;--vyriy-surface:#ffffff;--vyriy-text:#17211b;--vyriy-muted:#5b675f;--vyriy-line:#dbe3dd;--vyriy-accent:#176f5b;--vyriy-accent-soft:#e2f3ee;--vyriy-code:#10201a}*{box-sizing:border-box}body{margin:0;background:var(--vyriy-bg);color:var(--vyriy-text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.65}a{color:var(--vyriy-accent);text-decoration-thickness:.08em;text-underline-offset:.18em}img{max-width:100%;height:auto}.vyriy-layout{min-height:100vh;display:flex;flex-direction:column}.vyriy-header{border-bottom:1px solid var(--vyriy-line);background:rgba(248,250,247,.92);backdrop-filter:blur(12px)}.vyriy-header__inner{max-width:1120px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}.vyriy-header__brand{display:inline-flex;align-items:center;gap:.75rem;color:var(--vyriy-text);font-weight:800;font-size:1.2rem;text-decoration:none}.vyriy-header__logo{width:44px;height:44px;object-fit:contain}.vyriy-nav{display:flex;gap:1rem;flex-wrap:wrap}.vyriy-nav a{color:var(--vyriy-muted);font-weight:650;text-decoration:none}.vyriy-nav a:hover{color:var(--vyriy-accent)}.vyriy-main{width:100%;max-width:1120px;margin:0 auto;padding:3rem 1.5rem 4rem;flex:1}.vyriy-page{max-width:820px}.vyriy-page__content h1{font-size:clamp(2.2rem,5vw,4.2rem);line-height:1.05;margin:0 0 1.25rem}.vyriy-page__content h2{font-size:1.8rem;line-height:1.2;margin:2.5rem 0 .75rem}.vyriy-page__content h3{font-size:1.25rem;margin:2rem 0 .5rem}.vyriy-page__content p,.vyriy-page__content li{font-size:1.05rem}.vyriy-page__content pre{overflow:auto;padding:1rem;border-radius:8px;background:var(--vyriy-code);color:#f4fff9}.vyriy-page__content code{font-size:.92em}.vyriy-page__content :not(pre)>code{padding:.12rem .35rem;border-radius:5px;background:var(--vyriy-accent-soft);color:var(--vyriy-code)}.vyriy-page__content table{width:100%;border-collapse:collapse;margin:1.5rem 0;display:block;overflow:auto}.vyriy-page__content th,.vyriy-page__content td{border:1px solid var(--vyriy-line);padding:.65rem .75rem;text-align:left}.vyriy-page__content blockquote{margin:1.5rem 0;padding:.25rem 1rem;border-left:4px solid var(--vyriy-accent);color:var(--vyriy-muted);background:var(--vyriy-surface)}.vyriy-card{border:1px solid var(--vyriy-line);border-radius:8px;background:var(--vyriy-surface)}.vyriy-card__link{display:block;height:100%;padding:1rem;color:inherit;text-decoration:none}.vyriy-card__title{font-size:1.1rem;line-height:1.25;margin:0 0 .5rem}.vyriy-card__description{margin:0;color:var(--vyriy-muted)}.vyriy-card__meta{margin-top:.85rem;display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;color:var(--vyriy-muted);font-size:.9rem}.vyriy-card__tags,.vyriy-tags{display:flex;gap:.4rem;flex-wrap:wrap;list-style:none;padding:0;margin:0}.vyriy-card__tag,.vyriy-tag{display:inline-flex;border-radius:999px;background:var(--vyriy-accent-soft);color:var(--vyriy-accent);padding:.15rem .5rem;font-size:.78rem;text-decoration:none}.vyriy-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-top:1.5rem}.vyriy-catalog__content{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}.vyriy-pagination{margin-top:2rem;display:flex;gap:.5rem;flex-wrap:wrap}.vyriy-pagination a,.vyriy-pagination span{min-width:2.25rem;padding:.4rem .7rem;border:1px solid var(--vyriy-line);border-radius:6px;text-align:center;text-decoration:none}.vyriy-pagination [aria-current=page]{background:var(--vyriy-accent);color:#fff;border-color:var(--vyriy-accent)}.vyriy-footer{border-top:1px solid var(--vyriy-line);color:var(--vyriy-muted);padding:1.5rem;text-align:center}.vyriy-search{max-width:720px}.vyriy-search__form{display:flex;gap:.5rem;margin:1.5rem 0}.vyriy-search__form input{flex:1;min-width:0;padding:.7rem .85rem;border:1px solid var(--vyriy-line);border-radius:6px}.vyriy-search__form button{padding:.7rem 1rem;border:0;border-radius:6px;background:var(--vyriy-accent);color:#fff;font-weight:700}.vyriy-search__result{padding:1rem 0;border-top:1px solid var(--vyriy-line)}@media (max-width:720px){.vyriy-header__inner{align-items:flex-start;flex-direction:column}.vyriy-main{padding-top:2rem}.vyriy-search__form{flex-direction:column}}
`;
const renderStylesheet = (stylesheetHref, stylesheetContent) => {
    if (stylesheetContent) {
        return `<style>${stylesheetContent.trim().replaceAll('</style', escapedStyleCloseTag)}</style>`;
    }
    return `<link href="${escapeHtml(stylesheetHref ?? '/styles.css')}" rel="stylesheet" />`;
};
const renderGoogleAnalyticsTag = (measurementId) => {
    if (!measurementId) {
        return '';
    }
    if (!googleAnalyticsMeasurementIdPattern.test(measurementId)) {
        throw new Error(`Invalid Google Analytics measurement ID: ${measurementId}`);
    }
    return [
        `<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(measurementId)}"></script>`,
        '<script>',
        'window.dataLayer = window.dataLayer || [];',
        'function gtag(){dataLayer.push(arguments);}',
        "gtag('js', new Date());",
        `gtag('config', '${escapeHtml(measurementId)}');`,
        '</script>',
    ].join('');
};
const minifyHtml = (document) => document.trim().replaceAll(/>\s+</gu, '><');
const renderHeader = (siteName) => {
    return [
        '<header class="vyriy-header"><div class="vyriy-header__inner">',
        `<a class="vyriy-header__brand" href="/"><img class="vyriy-header__logo" src="/assets/vyriy-v-wings.png" alt="" width="72" height="46" />${escapeHtml(siteName)}</a>`,
        '<nav class="vyriy-nav" aria-label="Primary"><a href="/blog/">Blog</a><a href="/docs/">Docs</a><a href="/examples/">Examples</a><a href="/search/">Search</a></nav>',
        '</div></header>',
    ].join('');
};
const renderLayout = (body, siteName, footerText) => {
    return `<div class="vyriy-layout">${renderHeader(siteName)}<main class="vyriy-main">${body}</main><footer class="vyriy-footer">${escapeHtml(footerText)}</footer></div>`;
};
const renderDocument = (title, description, body, { canonicalPath, footerText, googleAnalyticsMeasurementId, robotsDirective, siteName, siteUrl, stylesheetContent, stylesheetHref, }) => {
    return minifyHtml([
        '<!DOCTYPE html><html lang="en"><head>',
        '<meta charset="utf-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1" />',
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}" />`,
        robotsDirective ? `<meta name="robots" content="${escapeHtml(robotsDirective)}" />` : '',
        renderStylesheet(stylesheetHref, stylesheetContent),
        canonicalPath ? `<link href="${escapeHtml(getAbsoluteUrl(canonicalPath, siteUrl))}" rel="canonical" />` : '',
        '<link href="/favicon.ico" rel="icon" sizes="any" />',
        '<link href="/favicon-16x16.png" rel="icon" sizes="16x16" />',
        '<link href="/favicon-32x32.png" rel="icon" sizes="32x32" />',
        '<link href="/apple-touch-icon.png" rel="apple-touch-icon" />',
        renderGoogleAnalyticsTag(googleAnalyticsMeasurementId),
        '</head><body>',
        renderLayout(body, siteName, footerText),
        '</body></html>',
    ].join(''));
};
const renderCard = (entry) => {
    return [
        '<article class="vyriy-card">',
        `<a aria-label="${escapeHtml(entry.title)}" class="vyriy-card__link" href="${escapeHtml(entry.href)}">`,
        `<h2 class="vyriy-card__title">${escapeHtml(entry.title)}</h2>`,
        `<p class="vyriy-card__description">${escapeHtml(entry.description)}</p>`,
        entry.date || entry.tags.length > 0
            ? [
                '<div class="vyriy-card__meta">',
                entry.date
                    ? `<time class="vyriy-card__date" datetime="${escapeHtml(entry.date)}">${escapeHtml(entry.date)}</time>`
                    : '',
                entry.tags.length > 0
                    ? `<ul class="vyriy-card__tags" aria-label="Tags">${entry.tags
                        .map((tag) => `<li class="vyriy-card__tag">${escapeHtml(tag)}</li>`)
                        .join('')}</ul>`
                    : '',
                '</div>',
            ].join('')
            : '',
        '</a></article>',
    ].join('');
};
export const renderPage = (page, options) => {
    const featured = options.featured ?? [];
    const related = options.related ?? [];
    const tags = options.showTags ? page.tags : [];
    const body = [
        '<section class="vyriy-page"><div class="vyriy-page__content">',
        renderMarkdown(page.content),
        '</div>',
        featured.length > 0
            ? `<section aria-label="Featured posts" class="vyriy-grid">${featured
                .map((item) => renderCard({
                date: item.date ?? '',
                description: item.description,
                href: item.url,
                tags: item.tags,
                title: item.title,
            }))
                .join('')}</section>`
            : '',
        tags.length > 0
            ? `<nav aria-label="Post tags" class="vyriy-tags">${tags
                .map((tag) => `<a class="vyriy-tag" href="/search/?tag=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a>`)
                .join('')}</nav>`
            : '',
        related.length > 0
            ? `<aside class="vyriy-page__related"><h2>Related posts</h2><div class="vyriy-grid">${related
                .map((item) => renderCard({
                date: '',
                description: item.description,
                href: item.url,
                tags: item.tags,
                title: item.title,
            }))
                .join('')}</div></aside>`
            : '',
        '</section>',
    ].join('');
    return renderDocument(page.title, page.description, body, options);
};
export const renderContentIndex = (entries, { page = 1, pages = 1, sectionPath, sectionTitle, ...documentOptions }) => {
    const pageTitle = pages > 1 && page > 1 ? `${sectionTitle} ${page}` : sectionTitle;
    const cards = entries.map(renderCard).join('');
    const pagination = pages > 1
        ? `<nav class="vyriy-pagination" aria-label="${escapeHtml(sectionTitle)} pagination">${Array.from({ length: pages }, (_value, index) => {
            const targetPage = index + 1;
            const href = targetPage <= 1 ? `/${sectionPath}/` : `/${sectionPath}/${targetPage}/`;
            return targetPage === page
                ? `<span aria-current="page">${targetPage}</span>`
                : `<a href="${escapeHtml(href)}">${targetPage}</a>`;
        }).join('')}</nav>`
        : '';
    return renderDocument(pageTitle, documentOptions.siteName === sectionTitle ? sectionTitle : `${sectionTitle} from ${documentOptions.siteName}.`, `<section class="vyriy-catalog"><h1>${escapeHtml(sectionTitle)}</h1><div class="vyriy-catalog__content">${cards}</div>${pagination}</section>`, {
        ...documentOptions,
        canonicalPath: page <= 1 ? `/${sectionPath}/` : `/${sectionPath}/${page}/`,
    });
};
export const renderNotFoundPage = (options) => {
    return renderDocument('Page not found', 'The requested page could not be found.', '<section class="vyriy-page"><div class="vyriy-page__content"><h1>Page not found</h1><p>The requested page could not be found.</p></div></section>', {
        ...options,
        canonicalPath: '',
    });
};
export const searchScript = String.raw `
(() => {
  const root = document.getElementById('search-root');
  if (!root) return;
  const documentsUrl = root.dataset.documentsUrl || '/search/documents.json';
  const indexUrl = root.dataset.indexUrl || '/search/minisearch-index.json';
  const parameters = new URLSearchParams(window.location.search);
  const tag = parameters.get('tag');
  const query = (parameters.get('q') || '').trim();
  const input = document.querySelector('.vyriy-search__form input[name="q"]');
  if (input) input.value = parameters.get('q') || '';
  const searchOptions = {
    boost: {
      content: 1,
      description: 2,
      tags: 3,
      title: 4
    },
    fuzzy: 0.2,
    prefix: true
  };
  const miniSearchOptions = {
    fields: ['title', 'description', 'tags', 'content'],
    storeFields: ['title', 'description', 'section', 'slug', 'url', 'tags', 'date'],
    searchOptions
  };
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const render = (documents) => {
    if (!documents.length) {
      root.innerHTML = '<p>No matching pages yet.</p>';
      return;
    }
    root.innerHTML = documents.map((document) => '<article class="vyriy-search__result"><a href="' + escapeHtml(document.url) + '"><h2>' + escapeHtml(document.title) + '</h2><p>' + escapeHtml(document.description || '') + '</p></a></article>').join('');
  };
  const getDocumentMap = (documents) => new Map(documents.map((document) => [document.id, document]));
  const getTagMatches = (documents, value) => {
    const normalizedTag = value.trim().toLowerCase();
    return documents.filter((document) => Array.isArray(document.tags) && document.tags.some((candidate) => candidate.trim().toLowerCase() === normalizedTag));
  };
  const getQueryMatches = (documents, indexJson, value) => {
    const MiniSearch = window.MiniSearch;
    if (!MiniSearch) throw new Error('MiniSearch is unavailable.');
    const documentsById = getDocumentMap(documents);
    const search = MiniSearch.loadJSON(JSON.stringify(indexJson), miniSearchOptions);
    return search.search(value).map((result) => documentsById.get(result.id) || result).filter(Boolean);
  };
  if (!tag && !query) {
    root.innerHTML = '<p>Choose a post tag or enter a search query to see matching pages.</p>';
    return;
  }
  const dataRequests = [fetch(documentsUrl)];
  if (query) dataRequests.push(fetch(indexUrl));
  Promise.all(dataRequests)
    .then((responses) => {
      for (const response of responses) {
        if (!response.ok) throw new Error('Search data unavailable.');
      }
      return Promise.all(responses.map((response, index) => index === 1 ? response.text() : response.json()));
    })
    .then(([documents, indexText]) => {
      const indexJson = indexText ? JSON.parse(indexText) : undefined;
      const queryMatches = query ? getQueryMatches(documents, indexJson, query) : documents;
      render(tag ? getTagMatches(queryMatches, tag) : queryMatches);
    })
    .catch(() => { root.innerHTML = '<p>Search data could not be loaded.</p>'; });
})();
`;
export const renderSearchPage = (options) => {
    return renderDocument(`${options.siteName} Search`, `Search pages from ${options.siteName}.`, [
        '<section class="vyriy-search"><h1>Search</h1><p>Search by text query or tag.</p>',
        '<form class="vyriy-search__form" action="/search/"><input name="q" placeholder="Search" type="search" /><button type="submit">Search</button></form>',
        '<div data-documents-url="/search/documents.json" data-index-url="/search/minisearch-index.json" id="search-root"></div>',
        '<script src="/assets/minisearch.js"></script>',
        '<script src="/assets/search.js"></script>',
        '</section>',
    ].join(''), {
        ...options,
        canonicalPath: '',
        robotsDirective: 'noindex, follow',
    });
};
