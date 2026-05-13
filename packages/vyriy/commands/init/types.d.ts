import { RunNewCommandOptions } from '../new/index.js';
export type RunInitCommandOptions = Omit<RunNewCommandOptions, 'projectName'> & {
    readonly cwd?: string;
};
export type RunInitCommand = (options?: RunInitCommandOptions) => Promise<number>;
