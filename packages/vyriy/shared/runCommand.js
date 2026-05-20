import { spawn } from 'node:child_process';
import { env as processEnv } from 'node:process';
export class RunCommandError extends Error {
    args;
    command;
    cwd;
    exitCode;
    constructor({ args = [], command, cwd }, exitCode) {
        super(`Command failed with exit code ${exitCode ?? 'unknown'}: ${command} ${args.join(' ')}`.trim());
        this.name = 'RunCommandError';
        this.args = args;
        this.command = command;
        this.cwd = cwd;
        this.exitCode = exitCode;
    }
}
export const runCommand = async (options) => {
    const child = spawn(options.command, [...(options.args ?? [])], {
        cwd: options.cwd,
        env: options.env ?? processEnv,
        shell: false,
        stdio: 'inherit',
    });
    await new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(new RunCommandError(options, code));
        });
    });
};
