import type { Configuration } from 'webpack';
export type WebpackConfig = Configuration;
export type WebpackEntry = WebpackConfig['entry'];
export type WebpackOutput = WebpackConfig['output'];
export type WebpackConfigTransform = (config: WebpackConfig) => WebpackConfig;
export type WebpackExternal = Extract<NonNullable<Configuration['externals']>, unknown[]>[number];
export type NodeModulesExternalOptions = {
    allowlist?: (RegExp | string)[];
};
