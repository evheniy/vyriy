export type AutoEnvValue = string | number | boolean | null | undefined | Record<string, unknown> | unknown[];
export type AutoOptions = {
    extendedBooleans?: boolean;
    csvArrays?: boolean;
    json?: boolean;
    nullish?: boolean;
};
export type StrictOptions = {
    extendedBooleans?: boolean;
};
export type ConfigParser<T = unknown> = (value: string) => T;
export type ConfigParserWithOptions<T, TOptions> = (value: string, options?: TOptions) => T;
export type ConfigParsers = {
    auto: <T extends AutoEnvValue = string>(value: string, options?: AutoOptions) => T;
    string: (value: string) => string;
    number: (value: string) => number;
    int: (value: string) => number;
    boolean: (value: string, options?: StrictOptions) => boolean;
    csv: (value: string) => string[];
    json: <T = unknown>(value: string) => T;
    duration: (value: string) => number;
};
export type ConfigParserName = keyof ConfigParsers;
export type ConfigParserLike<T = unknown> = ConfigParserName | ConfigParser<T>;
export type GetConfig = {
    <T extends AutoEnvValue = string>(envName: string): T | never;
    <T>(envName: string, defaultValue: T, parser?: ConfigParserLike<T>): T;
    <T>(envName: string, defaultValue: null, parser: ConfigParserLike<T>): T | never;
};
