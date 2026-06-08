import type { ExecOptions } from 'node:child_process';
export type ExecRuntimeOptions = Omit<ExecOptions, 'encoding'>;
export type PromiseExec = (cmd: string, options?: ExecOptions) => Promise<{
    stderr: string;
    stdout: string;
}>;
export type Exec = (cmd: string, options?: ExecRuntimeOptions, showLogs?: boolean) => Promise<string>;
