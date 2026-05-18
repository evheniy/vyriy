export type ExecCommand = (command: string, args?: readonly string[]) => Promise<string>;
export type CommandExists = (command: string, options?: {
    readonly execCommand?: ExecCommand;
}) => Promise<boolean>;
export type FileExists = (filePath: string) => Promise<boolean>;
