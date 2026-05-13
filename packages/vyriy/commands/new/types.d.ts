import { PromptProjectPlan } from '../../prompts/project-plan/index.js';
export type RunNewCommandOptions = {
    readonly projectName?: string;
    readonly askProjectPlan?: PromptProjectPlan;
    readonly output?: Pick<typeof console, 'log' | 'error'>;
};
export type RunNewCommand = (options?: RunNewCommandOptions) => Promise<number>;
