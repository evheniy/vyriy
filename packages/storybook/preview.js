import { jsx as _jsx } from "react/jsx-runtime";
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { themes } from 'storybook/theming';
import { useDarkMode } from '@vueless/storybook-dark-mode';
const ThemedDocsContainer = ({ children, context }) => {
    const isDark = useDarkMode();
    return (_jsx(DocsContainer, { context: context, theme: isDark ? themes.dark : themes.light, children: children }));
};
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
