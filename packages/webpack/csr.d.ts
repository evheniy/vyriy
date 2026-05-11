import type { WebpackConfig, WebpackConfigTransform, WebpackEntry, WebpackOutput } from './types.js';
export declare const csr: (entry: WebpackEntry, output: WebpackOutput, transform?: WebpackConfigTransform) => WebpackConfig;
