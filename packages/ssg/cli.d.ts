import type { BuildStaticSiteOptions } from './types.js';
type CliOptions = BuildStaticSiteOptions & {
    readonly help?: boolean;
};
export declare const parseSsgCliArgs: (args: readonly string[]) => Promise<CliOptions>;
export declare const runSsgCli: (args?: readonly string[]) => Promise<void>;
export {};
