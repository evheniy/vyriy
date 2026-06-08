import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Markdown } from '@storybook/addon-docs/blocks';
import { useDarkMode } from '@vueless/storybook-dark-mode';
import mermaid from 'mermaid';
import { useEffect, useId, useMemo, useState } from 'react';
const mermaidBlockPattern = /```mermaid\s*\n([\s\S]*?)```/g;
const parseMarkdownParts = (markdown) => {
    const parts = [];
    let cursor = 0;
    for (const match of markdown.matchAll(mermaidBlockPattern)) {
        const [block, diagram] = match;
        const { index } = match;
        if (index > cursor) {
            parts.push({
                content: markdown.slice(cursor, index),
                key: `markdown-${cursor}-${index}`,
                type: 'markdown',
            });
        }
        parts.push({
            content: diagram.trim(),
            key: `mermaid-${index}`,
            type: 'mermaid',
        });
        cursor = index + block.length;
    }
    if (cursor < markdown.length) {
        parts.push({
            content: markdown.slice(cursor),
            key: `markdown-${cursor}-${markdown.length}`,
            type: 'markdown',
        });
    }
    return parts;
};
const MermaidDiagram = ({ chart }) => {
    const id = `mermaid-${useId().replaceAll(':', '')}`;
    const isDark = useDarkMode();
    const [svg, setSvg] = useState('');
    const [error, setError] = useState();
    useEffect(() => {
        let mounted = true;
        mermaid.initialize({
            securityLevel: 'strict',
            startOnLoad: false,
            theme: isDark ? 'dark' : 'default',
        });
        mermaid
            .render(id, chart)
            .then(({ svg: renderedSvg }) => {
            if (!mounted) {
                return;
            }
            setError(undefined);
            setSvg(renderedSvg);
        })
            .catch((unknownError) => {
            if (!mounted) {
                return;
            }
            setSvg('');
            setError(unknownError instanceof Error ? unknownError.message : 'Unable to render Mermaid diagram.');
        });
        return () => {
            mounted = false;
        };
    }, [
        chart,
        id,
        isDark,
    ]);
    if (error) {
        return (_jsx("pre", { children: _jsx("code", { children: error }) }));
    }
    return (_jsx("div", { className: "vyriy-mermaid", dangerouslySetInnerHTML: { __html: svg } }));
};
export const MermaidMarkdown = ({ children }) => {
    const parts = useMemo(() => parseMarkdownParts(children), [children]);
    return (_jsx(_Fragment, { children: parts.map((part) => part.type === 'mermaid' ? (_jsx(MermaidDiagram, { chart: part.content }, part.key)) : (_jsx(Markdown, { children: part.content }, part.key))) }));
};
