export type FilePlanItemStatus = 'create' | 'overwrite' | 'skip' | 'conflict';
export type ProjectFile = {
    readonly path: string;
    readonly content: string;
};
export type FilePlanItem = ProjectFile & {
    readonly status: FilePlanItemStatus;
};
export type FilePlanOptions = {
    readonly overwrite?: boolean;
    readonly skipExisting?: boolean;
};
