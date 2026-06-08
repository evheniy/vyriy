export type GetEnv = {
    (name: string): string | never;
    <T extends string>(name: string): T | never;
    <T extends string>(name: string, defaultValue: T): T;
};
export type ExistsEnv = (name: string) => boolean;
export type NodeEnv = 'production' | 'development' | 'test';
export type GetNodeEnv = () => NodeEnv;
export type IsNodeEnv = () => boolean;
export type GetStage = () => string;
export type IsStage = () => boolean;
