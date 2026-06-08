import type { StaticCachePreset, StaticServer } from './types.js';
export type StaticBinCommand = {
    readonly type: 'help' | 'version';
} | {
    readonly cache?: StaticCachePreset;
    readonly type: 'serve';
    readonly directory?: string;
    readonly fallback?: string;
    readonly index?: false | string;
    readonly notFound?: false | string;
    readonly port?: string;
    readonly spa?: boolean;
};
export type RunStaticCli = (args?: readonly string[], command?: string, alias?: false | string) => Promise<void>;
export declare const staticVersion: string;
export declare const createStaticHelpText: (command?: string, alias?: false | string) => string;
export declare const parseStaticBinArgs: (args: readonly string[]) => StaticBinCommand;
export declare const runStaticCli: RunStaticCli;
export declare const staticServer: StaticServer;
