import { VyriyCiPlan, VyriyCiProvider } from '../types.js';
export type VyriyCiPromptProvider = 'none' | VyriyCiProvider;
export type CreateCiPlanOptions = {
    readonly provider?: VyriyCiPromptProvider;
};
export type CreateCiPlan = (options?: CreateCiPlanOptions) => VyriyCiPlan;
