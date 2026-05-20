export type ExecCommand = (command: string, args?: readonly string[]) => Promise<string>;
export type RunCommandOptions = {
    readonly command: string;
    readonly args?: readonly string[];
    readonly cwd: string;
    readonly env?: Record<string, string | undefined>;
};
export type RunCommand = (options: RunCommandOptions) => Promise<void>;
export type CommandExists = (command: string, options?: {
    readonly execCommand?: ExecCommand;
}) => Promise<boolean>;
export type FileExists = (filePath: string) => Promise<boolean>;
