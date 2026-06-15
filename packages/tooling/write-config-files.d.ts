import type { ConfigFile } from './types.js';
type WriteConfigFilesOptions = {
    readonly cwd: string;
    readonly dryRun: boolean;
    readonly exists: (path: string) => Promise<boolean>;
    readonly files: readonly ConfigFile[];
    readonly force: boolean;
};
export declare const writeConfigFiles: ({ cwd, dryRun, exists, files, force, }: WriteConfigFilesOptions) => Promise<readonly ConfigFile[]>;
export {};
