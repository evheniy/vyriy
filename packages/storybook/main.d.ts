import type { StorybookConfig } from '@storybook/react-webpack5';
type SharedStorybookConfig = Omit<StorybookConfig, 'stories'>;
declare const config: SharedStorybookConfig;
export default config;
