import { getAbsoluteUrl } from './sitemap.js';
const escapedJsonScriptCharacters = {
    '&': String.raw `\u0026`,
    '<': String.raw `\u003c`,
    '>': String.raw `\u003e`,
    [String.fromCodePoint(0x2028)]: String.raw `\u2028`,
    [String.fromCodePoint(0x2029)]: String.raw `\u2029`,
};
const escapeJsonScriptContent = (value) => {
    let escaped = '';
    for (const character of value) {
        escaped += escapedJsonScriptCharacters[character] ?? character;
    }
    return escaped;
};
export const renderJsonLdScript = (value) => {
    return `<script type="application/ld+json">${escapeJsonScriptContent(JSON.stringify(value))}</script>`;
};
export const getWebPageJsonLd = ({ canonicalPath, description, siteUrl, title }) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        description,
        isPartOf: {
            '@type': 'WebSite',
            name: 'Vyriy.dev',
            url: getAbsoluteUrl('/', siteUrl),
        },
        name: title,
        publisher: {
            '@type': 'Organization',
            name: 'Vyriy',
        },
        url: canonicalPath ? getAbsoluteUrl(canonicalPath, siteUrl) : undefined,
    };
};
