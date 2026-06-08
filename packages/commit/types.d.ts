export type CommitParams = {
    rule: RegExp;
    error: string;
    info: string;
};
export type Commit = (params: CommitParams) => void;
