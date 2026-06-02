export type ConflictStrategy = {
    readonly overwrite: boolean;
    readonly skipExisting: boolean;
};
export declare const conflictStrategy: () => Promise<ConflictStrategy | undefined>;
