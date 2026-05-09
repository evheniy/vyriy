export type RunTask = (task: string, environment?: {
    name: string;
    value: string;
}[], taskDefinition?: string) => Promise<void>;
