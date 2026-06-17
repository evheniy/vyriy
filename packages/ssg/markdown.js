import { createElement } from 'react';
import { html as renderReactHtml } from '@vyriy/render/html';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { replaceInlineCode, replaceMarkdownLinks, stripFencedCode, stripHtmlTags } from './plain.js';
const markdownSyntaxPattern = /[#>*_~|[\](){}\\-]+/gu;
const whitespacePattern = /\s+/gu;
const htmlCharacterPattern = /[&<>"']/gu;
const htmlCharacterEntities = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    '<': '&lt;',
    '>': '&gt;',
};
export const escapeHtml = (value) => {
    return value.replaceAll(htmlCharacterPattern, (character) => htmlCharacterEntities[character]);
};
export const renderMarkdown = (markdown) => {
    return renderReactHtml(createElement(ReactMarkdown, {
        rehypePlugins: [rehypeHighlight],
        remarkPlugins: [remarkGfm],
    }, markdown));
};
export const getPlainTextFromMarkdown = (markdown) => {
    return stripHtmlTags(replaceInlineCode(replaceMarkdownLinks(stripFencedCode(markdown))))
        .replaceAll(markdownSyntaxPattern, ' ')
        .replaceAll(whitespacePattern, ' ')
        .trim();
};
