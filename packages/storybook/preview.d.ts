import type { Preview as ReactWebpackPreview } from '@storybook/react-webpack5';
import { type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { type PropsWithChildren } from 'react';
import { type ThemeVars } from 'storybook/theming';
export type { Preview } from '@storybook/react-webpack5';
export type DocsThemes = {
    readonly dark: ThemeVars;
    readonly light: ThemeVars;
};
export declare const createThemedDocsContainer: (docsThemes: DocsThemes) => ({ children, context }: PropsWithChildren<DocsContainerProps>) => import("react/jsx-runtime").JSX.Element;
declare const preview: ReactWebpackPreview;
export default preview;
