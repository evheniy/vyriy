import { PromptProjectPlan } from '../../prompts/project-plan/index.js';
export type ConflictResolution = 'overwrite' | 'skip' | 'abort';
export type RunNewCommandOptions = {
    readonly projectName?: string;
    readonly askProjectPlan?: PromptProjectPlan;
    readonly askConflictResolution?: () => Promise<ConflictResolution>;
    readonly output?: Pick<typeof console, 'log' | 'error'>;
    readonly dryRun?: boolean;
    readonly yes?: boolean;
    readonly overwrite?: boolean;
    readonly skipExisting?: boolean;
};
export type RunNewCommand = (options?: RunNewCommandOptions) => Promise<number>;
