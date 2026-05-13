export type RunVyriyCliOptions = {
    readonly output?: Pick<typeof console, 'log' | 'error'>;
};
export type RunVyriyCli = (args?: readonly string[], options?: RunVyriyCliOptions) => Promise<number>;
