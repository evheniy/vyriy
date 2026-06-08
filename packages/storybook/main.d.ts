import type { StorybookConfig as ReactWebpackStorybookConfig } from '@storybook/react-webpack5';
export type { StorybookConfig } from '@storybook/react-webpack5';
declare const config: Omit<ReactWebpackStorybookConfig, 'stories'>;
export default config;
