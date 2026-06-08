import type { WebpackConfig, WebpackConfigTransform, WebpackEntry, WebpackOutput } from './types.js';
export declare const ssr: (entry: WebpackEntry, output: WebpackOutput, transform?: WebpackConfigTransform) => WebpackConfig;
