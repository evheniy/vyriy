import { jsx as _jsx } from "react/jsx-runtime";
import { MDXProvider } from '@mdx-js/react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { lazy, Suspense } from 'react';
import { themes } from 'storybook/theming';
import { useDarkMode } from '@vueless/storybook-dark-mode';
const LazyMermaidMarkdown = lazy(async () => {
    const { MermaidMarkdown } = await import('./mermaid-markdown.js');
    return { default: MermaidMarkdown };
});
const MermaidMarkdownOverride = ({ children }) => (_jsx(Suspense, { fallback: null, children: _jsx(LazyMermaidMarkdown, { children: children }) }));
export const createThemedDocsContainer = (docsThemes) => {
    const ThemedDocsContainer = ({ children, context }) => {
        const isDark = useDarkMode();
        return (_jsx(DocsContainer, { context: context, theme: isDark ? docsThemes.dark : docsThemes.light, children: _jsx(MDXProvider, { components: { Markdown: MermaidMarkdownOverride }, children: children }) }));
    };
    return ThemedDocsContainer;
};
const ThemedDocsContainer = createThemedDocsContainer({
    dark: themes.dark,
    light: themes.light,
});
const preview = {
    tags: ['autodocs'],
    argTypes: {
        items: {
            table: {
                disable: true,
            },
        },
    },
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            container: ThemedDocsContainer,
        },
        backgrounds: { disable: true },
        darkMode: {
            classTarget: 'html',
            stylePreview: true,
            current: 'light',
            dark: { ...themes.dark },
            light: { ...themes.light },
        },
    },
};
export default preview;
