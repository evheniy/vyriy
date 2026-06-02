export type CreateOptions = {
    readonly directory: string;
    readonly dryRun: boolean;
    readonly overwrite: boolean;
    readonly skipExisting: boolean;
    readonly install: boolean;
    readonly verify: boolean;
};
export type Create = (options: CreateOptions) => Promise<number>;
