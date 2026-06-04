import type { StaticServer } from './types.js';
export type StaticBinCommand = {
    readonly type: 'help' | 'version';
} | {
    readonly type: 'serve';
    readonly directory?: string;
    readonly port?: string;
};
export type RunStaticCli = (args?: readonly string[], command?: string, alias?: false | string) => Promise<void>;
export declare const staticVersion: string;
export declare const createStaticHelpText: (command?: string, alias?: false | string) => string;
export declare const parseStaticBinArgs: (args: readonly string[]) => StaticBinCommand;
export declare const runStaticCli: RunStaticCli;
export declare const staticServer: StaticServer;
