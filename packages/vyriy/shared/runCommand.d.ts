import { RunCommand, RunCommandOptions } from './types.js';
export declare class RunCommandError extends Error {
    readonly args: readonly string[];
    readonly command: string;
    readonly cwd: string;
    readonly exitCode: number | null;
    constructor({ args, command, cwd }: RunCommandOptions, exitCode: number | null);
}
export declare const runCommand: RunCommand;
