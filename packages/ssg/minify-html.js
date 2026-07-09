const whitespaceInsensitiveTags = new Set([
    'article',
    'aside',
    'body',
    'br',
    'dd',
    'div',
    'dl',
    'dt',
    'figcaption',
    'figure',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hr',
    'html',
    'li',
    'link',
    'main',
    'meta',
    'nav',
    'ol',
    'p',
    'section',
    'style',
    'title',
    'ul',
]);
const tagBoundaryPattern = /(<\/?([a-z][\w:-]*)\b[^>]*>)\s+(<\/?([a-z][\w:-]*)\b[^>]*>)/gi;
const doctypeBoundaryPattern = /(<!doctype html>)\s+(<html\b[^>]*>)/i;
const isWhitespaceInsensitiveBoundary = (leftTagName, rightTagName) => {
    return (whitespaceInsensitiveTags.has(leftTagName.toLowerCase()) ||
        whitespaceInsensitiveTags.has(rightTagName.toLowerCase()));
};
export const minifyHtml = (document) => {
    let minified = document.trim().replace(doctypeBoundaryPattern, '$1$2');
    let previousDocument = '';
    while (minified !== previousDocument) {
        previousDocument = minified;
        minified = minified.replaceAll(tagBoundaryPattern, (match, leftTag, leftTagName, rightTag, rightTagName) => {
            return isWhitespaceInsensitiveBoundary(leftTagName, rightTagName) ? `${leftTag}${rightTag}` : match;
        });
    }
    return minified;
};
